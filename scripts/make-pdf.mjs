// Produce handout.pdf from the Reveal deck using headless Chromium.
// Replaces decktape, which doesn't navigate Reveal 5.x correctly after detecting
// all slides. We rely on Reveal's own ?print-pdf mode, which lays out every
// slide as a static page — Chromium then prints the page directly.

import puppeteer from 'puppeteer';

const URL = process.env.DECK_URL || 'http://localhost:8765/?print-pdf';
const OUT = process.env.OUT_PATH || 'handout.pdf';

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });

  // Our index.html uses an async loader to inject slides and then imports
  // main.js which calls Reveal.initialize(). Wait until Reveal reports itself
  // ready and print-pdf layout has completed.
  await page.waitForFunction(
    () => window.Reveal && window.Reveal.isReady && window.Reveal.isReady(),
    { timeout: 20000 }
  );

  // Reveal's print-pdf mode renders each slide as a separate absolutely
  // positioned page. Give it a beat to settle after isReady fires.
  await new Promise((r) => setTimeout(r, 1500));

  await page.pdf({
    path: OUT,
    width: '1280px',
    height: '720px',
    printBackground: true,
    preferCSSPageSize: false,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  console.log(`Wrote ${OUT}`);
} finally {
  await browser.close();
}
