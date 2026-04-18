# EMS-presentatie — Foundation + Scaffolding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Een werkende, deploybare Reveal.js-deck op GitHub Pages (in `smartpeak-be` organisatie) met alle 10 hoofdstukken als lege structuur, volledige SmartPeak-styling, navigatie, speaker notes, automatische PDF-export via CI, iframe-slide voor de ROI-tool, en bronnen-template.

**Architecture:** Static site, pure HTML/CSS/JS. Één slide-file per hoofdstuk onder `slides/`, geïnclude vanuit `index.html` via Reveal's `data-external` plugin (of server-side concat via simpele build-stap indien `data-external` onvoldoende blijkt). Theme in eigen CSS zodat we niet vastzitten aan Reveal-defaults. GitHub Actions bouwt PDF via headless Chromium op elke push naar `main`.

**Tech Stack:**
- Reveal.js 5.x (pinned), via `npm`-less vendored `dist/` óf via `<script type="module" src="https://unpkg.com/...">` met SRI-hash. Voorkeur: vendored voor offline-werkbaarheid.
- Inter font (woff2, self-hosted)
- Decktape (CLI, via Docker in CI) voor PDF-export
- `qrcode` CLI voor QR-generatie
- GitHub Pages als deploy target
- GitHub Actions als CI

**Scope buiten dit plan:** inhoudelijke slide-content per hoofdstuk (komt per hoofdstuk als eigen plan); bronnen-verificatie (idem); custom illustraties (zoals fiets-analogie-tekening) — placeholder-icoon volstaat in dit plan.

---

## File Structure

```
smartpeak-be/ems-presentatie/           # repo in smartpeak-be org
├── index.html                          # Reveal entry-point, includes all slide fragments
├── css/
│   ├── reveal-overrides.css            # Theme: kleuren, typografie, layout
│   └── print.css                       # PDF-export overrides
├── js/
│   └── main.js                         # Reveal init + plugins configuratie
├── slides/
│   ├── 00-opener.html
│   ├── 01-stroomnet.html
│   ├── 02-waar-sta-je-nu.html
│   ├── 03-zonnepanelen.html
│   ├── 04-thuisbatterij.html
│   ├── 05-ems-brein.html
│   ├── 06-uitbreiding.html
│   ├── 07-vpp-netdiensten.html
│   ├── 08-nuance-regio.html
│   ├── 09-roi-tool.html
│   ├── 10-afsluiter.html
│   └── 99-bronnen.html
├── assets/
│   ├── logo.jpg                        # placeholder uit smartpeak.be
│   ├── fonts/
│   │   ├── Inter-Regular.woff2
│   │   ├── Inter-Medium.woff2
│   │   └── Inter-Bold.woff2
│   ├── icons/
│   │   └── .gitkeep                    # SVG iconen worden per hoofdstuk toegevoegd
│   ├── illustrations/
│   │   └── .gitkeep                    # illustraties per hoofdstuk
│   └── qr-handout.svg                  # QR-code naar handout.pdf
├── vendor/
│   └── reveal.js/                      # gepinde Reveal.js dist/
├── sources.md                          # werklijst van bronnen (leeg scaffold)
├── .github/
│   └── workflows/
│       └── pages.yml                   # build + deploy workflow
├── .gitignore
├── README.md
└── CLAUDE.md                           # kopie/symlink van root CLAUDE.md
```

Elke slide-file is een `<section>`-blok dat Reveal inlaadt. Dat houdt diffs per hoofdstuk leesbaar.

---

## Task 0: Repo aanmaken in smartpeak-be org

**Doel:** lege repo klaar in `smartpeak-be` org met Pages aangezet.

- [ ] **Step 1: Repo aanmaken via gh CLI**

```bash
gh repo create smartpeak-be/ems-presentatie \
  --public \
  --description "SmartPeak — EMS & thuisbatterij presentatie" \
  --homepage "https://smartpeak-be.github.io/ems-presentatie/"
```

Verwachte output: `✓ Created repository smartpeak-be/ems-presentatie on github.com`

- [ ] **Step 2: Lokaal clonen in parent-directory van current project**

```bash
cd /home/ubuntu/kevin/smartpeak/
gh repo clone smartpeak-be/ems-presentatie ems-presentatie-repo
cd ems-presentatie-repo
```

- [ ] **Step 3: Brainstorm- en spec-materiaal meeverhuizen**

```bash
cp -r ../ems-presentation/CLAUDE.md ./CLAUDE.md
mkdir -p docs/superpowers/specs docs/superpowers/plans brainstorm
cp ../ems-presentation/docs/superpowers/specs/*.md docs/superpowers/specs/
cp ../ems-presentation/docs/superpowers/plans/*.md docs/superpowers/plans/
cp ../ems-presentation/brainstorm/*.md brainstorm/
```

- [ ] **Step 4: Initial commit**

```bash
git add CLAUDE.md docs/ brainstorm/
git commit -m "chore: import design spec and plan from brainstorm repo"
git push -u origin main
```

- [ ] **Step 5: GitHub Pages aanzetten op `main` / root**

```bash
gh api repos/smartpeak-be/ems-presentatie/pages \
  --method POST \
  -f 'source[branch]=main' \
  -f 'source[path]=/'
```

Verwachte output: JSON met `"status": "queued"` of `"built"`.

- [ ] **Step 6: Bevestigen dat Pages URL bereikbaar is (mag 404 zijn, als DNS maar werkt)**

```bash
curl -sI https://smartpeak-be.github.io/ems-presentatie/ | head -1
```

Verwachte output: `HTTP/2 404` (nog geen `index.html`) of `HTTP/2 200` — beide OK. Domein resolveert dus Pages staat actief.

---

## Task 1: Reveal.js vendoren

**Doel:** Reveal 5.x dist in `vendor/reveal.js/` zonder `node_modules` in de repo.

**Files:**
- Create: `vendor/reveal.js/dist/reveal.js`
- Create: `vendor/reveal.js/dist/reveal.css`
- Create: `vendor/reveal.js/dist/theme/white.css` (als basis, overschreven door eigen theme)
- Create: `vendor/reveal.js/plugin/notes/notes.js`
- Create: `vendor/reveal.js/plugin/notes/notes.html`

- [ ] **Step 1: Download Reveal.js 5.1.0 tarball**

```bash
cd vendor
curl -sL https://github.com/hakimel/reveal.js/archive/refs/tags/5.1.0.tar.gz | tar xz
mv reveal.js-5.1.0 reveal.js
cd ..
```

- [ ] **Step 2: Alleen dist/ en plugin/ bewaren (gooi src, test, node_modules weg)**

```bash
cd vendor/reveal.js
find . -maxdepth 1 -type d ! -name dist ! -name plugin ! -name . -exec rm -rf {} +
find . -maxdepth 1 -type f ! -name LICENSE -exec rm -f {} +
cd ../..
```

- [ ] **Step 3: Size check**

```bash
du -sh vendor/reveal.js
```

Verwachte output: <5 MB.

- [ ] **Step 4: Commit**

```bash
git add vendor/reveal.js
git commit -m "chore: vendor reveal.js 5.1.0 (dist + plugins)"
```

---

## Task 2: Inter font self-hosten

**Doel:** drie woff2-bestanden in `assets/fonts/` + `@font-face`-definities in CSS. Geen externe CDN.

**Files:**
- Create: `assets/fonts/Inter-Regular.woff2`
- Create: `assets/fonts/Inter-Medium.woff2`
- Create: `assets/fonts/Inter-Bold.woff2`

- [ ] **Step 1: Download Inter 4.0 woff2-bestanden van rsms/inter releases**

```bash
cd assets/fonts
curl -sLO https://github.com/rsms/inter/releases/download/v4.0/Inter-4.0.zip
unzip -j Inter-4.0.zip 'Inter-4.0/web/Inter-Regular.woff2' -d .
unzip -j Inter-4.0.zip 'Inter-4.0/web/Inter-Medium.woff2' -d .
unzip -j Inter-4.0.zip 'Inter-4.0/web/Inter-Bold.woff2' -d .
rm Inter-4.0.zip
cd ../..
```

- [ ] **Step 2: Verifieer bestaan en grootte**

```bash
ls -la assets/fonts/
```

Verwachte output: drie `.woff2` bestanden, elk 100-300 KB.

- [ ] **Step 3: Commit**

```bash
git add assets/fonts/
git commit -m "chore: self-host Inter font (Regular/Medium/Bold)"
```

---

## Task 3: Logo placeholder + assets-structuur

**Doel:** logo-JPEG gekopieerd uit `smartpeak.be`, lege folders voor icons/illustrations.

**Files:**
- Create: `assets/logo.jpg`
- Create: `assets/icons/.gitkeep`
- Create: `assets/illustrations/.gitkeep`

- [ ] **Step 1: Logo downloaden van site**

```bash
curl -sL -o assets/logo.jpg \
  'https://smartpeak.be/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-17-at-16.41.12-e1760712137275.jpeg'
```

- [ ] **Step 2: Image-dimensies controleren**

```bash
file assets/logo.jpg
```

Verwachte output: `assets/logo.jpg: JPEG image data, ...`.

- [ ] **Step 3: Lege folders met `.gitkeep`**

```bash
touch assets/icons/.gitkeep
touch assets/illustrations/.gitkeep
```

- [ ] **Step 4: Commit**

```bash
git add assets/
git commit -m "chore: add logo placeholder + assets folders"
```

---

## Task 4: Theme CSS (kleuren, typografie, layout)

**Doel:** één CSS-file die het SmartPeak-gevoel legt over Reveal's default. Donker-marine primair, amber en soft green als accenten, Inter font.

**Files:**
- Create: `css/reveal-overrides.css`

- [ ] **Step 1: Schrijf `css/reveal-overrides.css`**

```css
/* SmartPeak — Reveal theme overrides
   Colors: marine primary, amber highlight, soft green 'good'.
   Typography: Inter, self-hosted.
*/

@font-face {
  font-family: 'Inter';
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url('../assets/fonts/Inter-Regular.woff2') format('woff2');
}
@font-face {
  font-family: 'Inter';
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  src: url('../assets/fonts/Inter-Medium.woff2') format('woff2');
}
@font-face {
  font-family: 'Inter';
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  src: url('../assets/fonts/Inter-Bold.woff2') format('woff2');
}

:root {
  --sp-marine: #0A2540;
  --sp-marine-soft: #1E3A5F;
  --sp-amber: #FFB400;
  --sp-green: #06A77D;
  --sp-text: #1A202C;
  --sp-text-muted: #4A5568;
  --sp-bg: #FFFFFF;
  --sp-bg-subtle: #F7FAFC;
  --sp-border: #E2E8F0;
}

.reveal {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 32px;
  color: var(--sp-text);
  background: var(--sp-bg);
}

.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4 {
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 700;
  color: var(--sp-marine);
  text-transform: none;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin-bottom: 0.5em;
}

.reveal h1 { font-size: 2.0em; }
.reveal h2 { font-size: 1.5em; }
.reveal h3 { font-size: 1.15em; color: var(--sp-marine-soft); }

.reveal p,
.reveal li {
  line-height: 1.5;
  color: var(--sp-text);
}

.reveal a {
  color: var(--sp-marine);
  text-decoration: underline;
  text-decoration-color: var(--sp-amber);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

.reveal .slide-number {
  display: none;
}

.reveal .controls {
  color: var(--sp-marine);
}

.reveal .progress {
  color: var(--sp-amber);
  height: 3px;
}

/* Semantic classes for slide content */
.reveal .sp-valkuil {
  border-left: 6px solid var(--sp-amber);
  padding: 0.5em 0 0.5em 1em;
  background: var(--sp-bg-subtle);
  font-size: 0.9em;
}

.reveal .sp-valkuil::before {
  content: "Valkuil — ";
  font-weight: 700;
  color: var(--sp-amber);
}

.reveal .sp-goed {
  border-left: 6px solid var(--sp-green);
  padding: 0.5em 0 0.5em 1em;
  background: var(--sp-bg-subtle);
}

.reveal .sp-bron {
  position: absolute;
  bottom: 16px;
  left: 24px;
  right: 24px;
  font-size: 0.45em;
  color: var(--sp-text-muted);
  text-align: left;
}

.reveal .sp-chapter-label {
  position: absolute;
  top: 24px;
  right: 32px;
  font-size: 0.5em;
  color: var(--sp-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.reveal .sp-logo {
  position: absolute;
  top: 16px;
  left: 24px;
  height: 48px;
}

/* Title slide */
.reveal .sp-title-slide {
  text-align: left;
}

.reveal .sp-title-slide h1 {
  font-size: 2.5em;
  margin-bottom: 0.3em;
}

.reveal .sp-title-slide .sp-subtitle {
  color: var(--sp-text-muted);
  font-size: 1.0em;
  font-weight: 400;
}
```

- [ ] **Step 2: Verifieer syntaxis (lees terug, let op: geen typos)**

```bash
grep -c "^}" css/reveal-overrides.css
```

Verwachte output: een getal ≥ 15 (elk rule-blok eindigt met `}`).

- [ ] **Step 3: Commit**

```bash
git add css/reveal-overrides.css
git commit -m "feat: add SmartPeak theme overrides (marine + amber + green, Inter)"
```

---

## Task 5: Print-stylesheet voor PDF-export

**Doel:** CSS-overrides zodat de Reveal `?print-pdf`-mode een nette PDF oplevert.

**Files:**
- Create: `css/print.css`

- [ ] **Step 1: Schrijf `css/print.css`**

```css
/* Overrides voor PDF-export (Reveal ?print-pdf mode)
   Doel: zelfde visual als op scherm, maar consistent per slide.
*/

@media print {
  /* Ensure each slide prints on its own page */
  .reveal .slides section.present {
    break-after: page;
  }

  /* Hide controls, progress, chapter labels in PDF */
  .reveal .controls,
  .reveal .progress {
    display: none !important;
  }

  /* Ensure logos and sources render in print */
  .reveal .sp-logo,
  .reveal .sp-bron,
  .reveal .sp-chapter-label {
    display: block !important;
  }

  /* Links as underlined but not blue-browser-style */
  .reveal a {
    color: var(--sp-marine);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add css/print.css
git commit -m "feat: add print stylesheet for PDF export"
```

---

## Task 6: Reveal-init en plugins configuratie

**Doel:** `js/main.js` configureert Reveal met de gewenste opties (navigatie, notes-plugin, fragments, keyboard bindings).

**Files:**
- Create: `js/main.js`

- [ ] **Step 1: Schrijf `js/main.js`**

```javascript
// SmartPeak — Reveal init
// Sterk opiniated: PowerPoint-stijl navigatie, notes on 'S', overview on 'Esc'.

import Reveal from '../vendor/reveal.js/dist/reveal.esm.js';
import Notes from '../vendor/reveal.js/plugin/notes/notes.esm.js';

const deck = new Reveal({
  hash: true,
  controls: true,
  controlsTutorial: false,
  controlsLayout: 'edges',
  progress: true,
  slideNumber: false,
  history: true,
  keyboard: true,
  overview: true,
  center: false,
  transition: 'slide',
  transitionSpeed: 'fast',
  backgroundTransition: 'none',

  // Sizing
  width: 1280,
  height: 720,
  margin: 0.04,
  minScale: 0.2,
  maxScale: 1.5,

  plugins: [Notes],
});

deck.initialize();

window.addEventListener('keydown', (e) => {
  if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }
});
```

- [ ] **Step 2: Commit**

```bash
git add js/main.js
git commit -m "feat: add Reveal initialization with SmartPeak configuratie"
```

---

## Task 7: index.html met slide-fragments inlading

**Doel:** hoofdpagina die alle `slides/*.html` inlaadt via een kleine fetch-loop vóór `deck.initialize()`. Reveal's built-in `data-external` bleek in v5 onbetrouwbaar — we doen het zelf.

**Files:**
- Create: `index.html`

- [ ] **Step 1: Test eerst dat we een failing-state hebben (TDD-stijl)**

Omdat dit statische HTML + fetches betreft, is de "test" een curl naar een opgestarte local server. Eerst zorgen we dat de server start maar niks toont.

```bash
cd /home/ubuntu/kevin/smartpeak/ems-presentatie-repo
python3 -m http.server 8765 &>/dev/null &
SERVER_PID=$!
sleep 1
curl -sI http://localhost:8765/ | head -1
kill $SERVER_PID
```

Verwachte output: `HTTP/1.0 404 File not found` (geen `index.html` nog).

- [ ] **Step 2: Schrijf `index.html`**

```html
<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SmartPeak — EMS & thuisbatterij</title>

  <link rel="stylesheet" href="vendor/reveal.js/dist/reveal.css" />
  <link rel="stylesheet" href="vendor/reveal.js/dist/theme/white.css" id="theme" />
  <link rel="stylesheet" href="css/reveal-overrides.css" />
  <link rel="stylesheet" href="css/print.css" />
</head>
<body>
  <div class="reveal">
    <div class="slides" id="slides-root">
      <!-- Slides worden hier geïnjecteerd via loader.js -->
    </div>
  </div>

  <script type="module">
    const chapters = [
      '00-opener',
      '01-stroomnet',
      '02-waar-sta-je-nu',
      '03-zonnepanelen',
      '04-thuisbatterij',
      '05-ems-brein',
      '06-uitbreiding',
      '07-vpp-netdiensten',
      '08-nuance-regio',
      '09-roi-tool',
      '10-afsluiter',
      '99-bronnen',
    ];

    const slidesRoot = document.getElementById('slides-root');
    for (const chapter of chapters) {
      const response = await fetch(`slides/${chapter}.html`);
      if (!response.ok) {
        console.error(`Failed to load slides/${chapter}.html: ${response.status}`);
        continue;
      }
      const html = await response.text();
      slidesRoot.insertAdjacentHTML('beforeend', html);
    }

    // Import and init Reveal only after slides are loaded
    const mainModule = await import('./js/main.js');
  </script>
</body>
</html>
```

- [ ] **Step 3: Commit (zonder slides nog — fetch zal 404'en, da's OK voor nu)**

```bash
git add index.html
git commit -m "feat: add index.html with chapter-fragment loader"
```

---

## Task 8: Slide-template scaffold — opener

**Doel:** één voorbeeld hoofdstuk-file zodat we het patroon vastleggen; andere hoofdstukken volgen het template.

**Files:**
- Create: `slides/00-opener.html`

- [ ] **Step 1: Schrijf `slides/00-opener.html`**

```html
<!-- Hoofdstuk 0 — Opener -->
<section>
  <section class="sp-title-slide">
    <img class="sp-logo" src="assets/logo.jpg" alt="SmartPeak" />
    <h1>Slim omgaan met jouw energie</h1>
    <p class="sp-subtitle">Wat een EMS is, wat hij doet, en wat je moet weten voor je beslist.</p>
    <aside class="notes">
      Titel-slide. Welkom heten, kort voorstellen Kevin + collega, en introduceren
      dat het doel van de avond is om het publiek <em>gewapend</em> naar huis te sturen.
      Niet: SmartPeak als verkoper positioneren. Wel: neutrale kennis.
    </aside>
  </section>

  <section>
    <span class="sp-chapter-label">Opener</span>
    <h2>Wat neem je vanavond mee?</h2>
    <ul>
      <li>Hoe je factuur vandaag werkelijk is opgebouwd.</li>
      <li>Wanneer een batterij zinvol is — en wanneer niet.</li>
      <li>Welke vragen je aan een aanbieder moet stellen.</li>
    </ul>
    <aside class="notes">
      Kernboodschap: "je gaat naar huis met genoeg kennis om zelf de juiste keuze te maken
      — en om herkennen wanneer iemand anders die keuze voor jou probeert te maken."
      Nadruk op drie punten. 30 seconden op deze slide.
    </aside>
  </section>

  <section>
    <span class="sp-chapter-label">Opener</span>
    <h2>Waar gaan we naartoe?</h2>
    <ol style="font-size: 0.8em;">
      <li>Hoe het stroomnet werkt</li>
      <li>Hoe je factuur werkt</li>
      <li>Zonnepanelen vandaag</li>
      <li>De thuisbatterij</li>
      <li>Het slimme brein: EMS</li>
      <li>Uitbreiden: laadpaal, warmtepomp</li>
      <li>Netdiensten en VPP</li>
      <li>Wat verschilt in Wallonië en Brussel</li>
      <li>Live ROI-tool</li>
      <li>Afsluiting en vragen</li>
    </ol>
    <aside class="notes">
      Roadmap. Kort doornemen (max 1 minuut). Niet voor alles toelichting geven —
      publiek moet het gevoel hebben dat er een logische structuur is.
    </aside>
  </section>
</section>
```

- [ ] **Step 2: Lokaal serveren en bekijken**

```bash
python3 -m http.server 8765 &>/dev/null &
SERVER_PID=$!
sleep 1
curl -s http://localhost:8765/slides/00-opener.html | head -5
kill $SERVER_PID
```

Verwachte output: de eerste regels van `slides/00-opener.html` (begint met `<!-- Hoofdstuk 0 -->`).

- [ ] **Step 3: Commit**

```bash
git add slides/00-opener.html
git commit -m "feat: add opener chapter (00) with title + roadmap placeholders"
```

---

## Task 9: Scaffolds voor hoofdstukken 1 t/m 10 + bronnen

**Doel:** elk hoofdstuk heeft één placeholder-slide met de juiste chapter-label, titel, en een notes-blok dat verwijst naar de spec. Geen inhoud — dat komt per vervolgplan.

**Files:**
- Create: `slides/01-stroomnet.html`
- Create: `slides/02-waar-sta-je-nu.html`
- Create: `slides/03-zonnepanelen.html`
- Create: `slides/04-thuisbatterij.html`
- Create: `slides/05-ems-brein.html`
- Create: `slides/06-uitbreiding.html`
- Create: `slides/07-vpp-netdiensten.html`
- Create: `slides/08-nuance-regio.html`
- Create: `slides/09-roi-tool.html`
- Create: `slides/10-afsluiter.html`
- Create: `slides/99-bronnen.html`

- [ ] **Step 1: Schrijf hoofdstuk 1 — `slides/01-stroomnet.html`**

```html
<!-- Hoofdstuk 1 — Hoe werkt het stroomnet? -->
<section>
  <section>
    <span class="sp-chapter-label">1 · Stroomnet</span>
    <h2>Hoe werkt het stroomnet eigenlijk?</h2>
    <p style="color: var(--sp-text-muted);">Fiets-analogie, 50 Hz, productiemiddelen, grote batterijparken.</p>
    <aside class="notes">
      SCAFFOLD. Content komt in vervolgplan. Zie spec hoofdstuk 1. Rode draad:
      fiets-analogie als metafoor voor netbalans. Introductie van "markt egaliseert
      zichzelf"-draad via grote batterijparken.
    </aside>
  </section>
</section>
```

- [ ] **Step 2: Schrijf hoofdstuk 2 — `slides/02-waar-sta-je-nu.html`**

```html
<!-- Hoofdstuk 2 — Waar sta je nu? -->
<section>
  <section>
    <span class="sp-chapter-label">2 · Je factuur</span>
    <h2>Waar sta je nu?</h2>
    <p style="color: var(--sp-text-muted);">Factuur: verbruik + capaciteitstarief + injectie + vast/dynamisch. Slimme meter.</p>
    <aside class="notes">
      SCAFFOLD. Content komt in vervolgplan. Zie spec hoofdstuk 2. Nuance:
      exacte Fluvius-mechaniek capaciteitstarief (maandpiek + glijdend gemiddelde) verifiëren.
      Valkuil: dynamisch contract = krimpende marges.
    </aside>
  </section>
</section>
```

- [ ] **Step 3: Schrijf hoofdstuk 3 — `slides/03-zonnepanelen.html`**

```html
<!-- Hoofdstuk 3 — Je had al zonnepanelen -->
<section>
  <section>
    <span class="sp-chapter-label">3 · Zonnepanelen</span>
    <h2>Je had al zonnepanelen</h2>
    <p style="color: var(--sp-text-muted);">Wat veranderde sinds terugdraaiende teller werd afgeschaft. Injectietarief.</p>
    <aside class="notes">
      SCAFFOLD. Content komt in vervolgplan. Zie spec hoofdstuk 3. Valkuil:
      ROI-berekeningen op oude terugdraai-aannames.
    </aside>
  </section>
</section>
```

- [ ] **Step 4: Schrijf hoofdstuk 4 — `slides/04-thuisbatterij.html`**

```html
<!-- Hoofdstuk 4 — De thuisbatterij (dikste hoofdstuk) -->
<section>
  <section>
    <span class="sp-chapter-label">4 · Thuisbatterij</span>
    <h2>De thuisbatterij</h2>
    <p style="color: var(--sp-text-muted);">
      Use-cases, chemie, AC/DC, sizing, off-grid vs back-up, veiligheid.
      12-14 slides in vervolgplan.
    </p>
    <aside class="notes">
      SCAFFOLD. Content komt in vervolgplan. Zie spec hoofdstuk 4 — dit is het dikste hoofdstuk.
      Trade-off zelfconsumptie vs peakshaving expliciet als eigen slide.
      Cumulatieve valkuil-slide aan einde.
    </aside>
  </section>
</section>
```

- [ ] **Step 5: Schrijf hoofdstuk 5 — `slides/05-ems-brein.html`**

```html
<!-- Hoofdstuk 5 — Het slimme brein: EMS -->
<section>
  <section>
    <span class="sp-chapter-label">5 · EMS</span>
    <h2>Het slimme brein</h2>
    <p style="color: var(--sp-text-muted);">EMS functioneel, orchestratie, dynamische tarieven. Home Assistant terloops.</p>
    <aside class="notes">
      SCAFFOLD. Content komt in vervolgplan. Zie spec hoofdstuk 5. Geen protocollen-slide
      (bewuste keuze). Valkuil: gesloten ecosystemen + vage meerwaarde.
    </aside>
  </section>
</section>
```

- [ ] **Step 6: Schrijf hoofdstuk 6 — `slides/06-uitbreiding.html`**

```html
<!-- Hoofdstuk 6 — Uitbreiding: EV, warmtepomp, V2G -->
<section>
  <section>
    <span class="sp-chapter-label">6 · Uitbreiding</span>
    <h2>Verder gaan: EV, warmtepomp, V2G</h2>
    <p style="color: var(--sp-text-muted);">Laadpaal smart charging, DC-charging + V2G, warmtepomp high-level.</p>
    <aside class="notes">
      SCAFFOLD. Content komt in vervolgplan. Zie spec hoofdstuk 6. Voordeel DC-charging
      (Sungrow-achtig): hoge snelheid zonder AC-capaciteitsbelasting.
      SmartPeak installeert warmtepompen niet — wel inhoudelijk behandelen.
    </aside>
  </section>
</section>
```

- [ ] **Step 7: Schrijf hoofdstuk 7 — `slides/07-vpp-netdiensten.html`**

```html
<!-- Hoofdstuk 7 — Het grotere plaatje: VPP / netdiensten -->
<section>
  <section>
    <span class="sp-chapter-label">7 · VPP</span>
    <h2>Het grotere plaatje: netdiensten</h2>
    <p style="color: var(--sp-text-muted);">VPP, frequentieregeling, eerlijk cijfer voor particulieren anno 2026.</p>
    <aside class="notes">
      SCAFFOLD. Content komt in vervolgplan. Zie spec hoofdstuk 7. Eerlijk zijn
      over wat het anno 2026 in BE al oplevert. Industriële batterijparken
      concurreren rechtstreeks met thuisbatterijen. Opbrengst-cijfers verifiëren.
    </aside>
  </section>
</section>
```

- [ ] **Step 8: Schrijf hoofdstuk 8 — `slides/08-nuance-regio.html`**

```html
<!-- Hoofdstuk 8 — Nuance: Wallonië / Brussel -->
<section>
  <section>
    <span class="sp-chapter-label">8 · Regio's</span>
    <h2>Wallonië en Brussel: wat is anders?</h2>
    <p style="color: var(--sp-text-muted);">Capaciteitstarief, compensatieregelingen, premies — kort.</p>
    <aside class="notes">
      SCAFFOLD. Content komt in vervolgplan. Zie spec hoofdstuk 8. Eén slide,
      doel is voorkomen dat publiek met Waalse familie verkeerd geïnformeerd thuiskomt.
    </aside>
  </section>
</section>
```

- [ ] **Step 9: Schrijf hoofdstuk 9 — `slides/09-roi-tool.html` (iframe-embed vast klaar)**

```html
<!-- Hoofdstuk 9 — De ROI-tool live -->
<section>
  <section>
    <span class="sp-chapter-label">9 · ROI</span>
    <h2>Assumpties in de tool</h2>
    <ul>
      <li>Dag- en nachttarief</li>
      <li>Capaciteitstarief</li>
      <li>Batterij-cycli</li>
      <li>BTW (6 % of 21 %)</li>
      <li>Keuring (wel of niet)</li>
    </ul>
    <p class="sp-bron">Bron: SmartPeak ROI-tool — input-parameters.</p>
    <aside class="notes">
      SCAFFOLD. Tekst blijft, context komt in vervolgplan.
    </aside>
  </section>

  <section data-background-color="#F7FAFC">
    <span class="sp-chapter-label">9 · ROI</span>
    <h2>Live berekening</h2>
    <iframe
      src="https://smartpeak-be.github.io/battery-roi-tool/"
      style="width: 100%; height: 560px; border: 1px solid var(--sp-border); border-radius: 4px;"
      loading="lazy"
      title="SmartPeak ROI-tool"
    ></iframe>
    <p class="sp-bron">Live embed: smartpeak-be.github.io/battery-roi-tool</p>
    <aside class="notes">
      Bij presentatie: vooraf gedeelde-resultaten-URL laden, geen live CSV-upload.
      Fallback: screenshot als iframe niet laadt (zie assets/illustrations/roi-fallback.png — toe te voegen).
    </aside>
  </section>

  <section>
    <span class="sp-chapter-label">9 · ROI</span>
    <h2>Vraag je aanbieder</h2>
    <p style="color: var(--sp-text-muted);">Checklist — 5 concrete vragen. Komt in vervolgplan.</p>
    <aside class="notes">
      SCAFFOLD. Content komt in vervolgplan. Doel: letterlijke checklist die
      publiek thuis kan gebruiken om offertes te vergelijken.
    </aside>
  </section>
</section>
```

- [ ] **Step 10: Schrijf hoofdstuk 10 — `slides/10-afsluiter.html`**

```html
<!-- Hoofdstuk 10 — Afsluiter -->
<section>
  <section>
    <span class="sp-chapter-label">10 · Afsluiter</span>
    <h2>Wat neem je mee?</h2>
    <p style="color: var(--sp-text-muted);">Samenvatting in 3 punten. Komt in vervolgplan.</p>
    <aside class="notes">
      SCAFFOLD. Drie samenvattende punten uit de deck.
    </aside>
  </section>

  <section>
    <img class="sp-logo" src="assets/logo.jpg" alt="SmartPeak" />
    <h2>Meer weten?</h2>
    <p>smartpeak.be</p>
    <img src="assets/qr-handout.svg" alt="QR-code naar handout" style="width: 200px; margin-top: 1em;" />
    <p style="font-size: 0.5em; color: var(--sp-text-muted);">Scan voor de handout (PDF).</p>
    <aside class="notes">
      Sober: geen salespitch. Contact-slide. QR wijst naar /handout.pdf.
    </aside>
  </section>
</section>
```

- [ ] **Step 11: Schrijf bronnen-slide — `slides/99-bronnen.html`**

```html
<!-- Bronnen-slide — wordt per vervolgplan aangevuld -->
<section>
  <section>
    <span class="sp-chapter-label">Bronnen</span>
    <h2>Bronnen</h2>
    <p style="color: var(--sp-text-muted);">
      Deze slide wordt per hoofdstuk aangevuld met bron-verwijzingen.
      Werklijst: <code>sources.md</code>.
    </p>
    <aside class="notes">
      SCAFFOLD. Wordt aangevuld als elk hoofdstuk content krijgt.
    </aside>
  </section>
</section>
```

- [ ] **Step 12: Commit alle scaffolds in één commit**

```bash
git add slides/01-stroomnet.html slides/02-waar-sta-je-nu.html \
        slides/03-zonnepanelen.html slides/04-thuisbatterij.html \
        slides/05-ems-brein.html slides/06-uitbreiding.html \
        slides/07-vpp-netdiensten.html slides/08-nuance-regio.html \
        slides/09-roi-tool.html slides/10-afsluiter.html \
        slides/99-bronnen.html
git commit -m "feat: scaffold slides for chapters 1-10 + sources (content TBD per chapter)"
```

---

## Task 10: sources.md scaffold

**Doel:** lege werklijst voor bronvermelding per hoofdstuk.

**Files:**
- Create: `sources.md`

- [ ] **Step 1: Schrijf `sources.md`**

```markdown
# Bronnen

Werklijst van alle bronnen die in de deck worden geclaimd.
Per claim: link, titel, bezoekdatum, relevante quote.

## Hoofdstuk 1 — Stroomnet

_Wordt aangevuld tijdens hoofdstuk 1 content-plan._

## Hoofdstuk 2 — Je factuur

_Wordt aangevuld. Expliciet te verifiëren: exacte Fluvius-mechaniek capaciteitstarief._

## Hoofdstuk 3 — Zonnepanelen

_Wordt aangevuld. Expliciet te verifiëren: datum afschaffing terugdraaiende teller + overgangsregels._

## Hoofdstuk 4 — Thuisbatterij

_Wordt aangevuld. Expliciet te verifiëren: brandveiligheid LFP vs NMC._

## Hoofdstuk 5 — EMS

_Wordt aangevuld._

## Hoofdstuk 6 — Uitbreiding

_Wordt aangevuld._

## Hoofdstuk 7 — VPP

_Wordt aangevuld. Expliciet te verifiëren: Elia/CREG cijfers over VPP-opbrengst particulieren BE 2026._

## Hoofdstuk 8 — Nuance Wa/Br

_Wordt aangevuld. Bronnen: CWaPE, Brugel._
```

- [ ] **Step 2: Commit**

```bash
git add sources.md
git commit -m "chore: scaffold sources.md with per-chapter sections"
```

---

## Task 11: QR-code voor handout genereren

**Doel:** `assets/qr-handout.svg` die verwijst naar de uiteindelijke handout-URL op Pages.

**Files:**
- Create: `assets/qr-handout.svg`

- [ ] **Step 1: Installeer `qrencode` (eenmalig)**

```bash
which qrencode || sudo apt-get install -y qrencode
```

- [ ] **Step 2: Genereer QR-svg**

```bash
qrencode -t SVG -o assets/qr-handout.svg \
  'https://smartpeak-be.github.io/ems-presentatie/handout.pdf'
```

- [ ] **Step 3: Verifieer inhoud**

```bash
head -3 assets/qr-handout.svg
```

Verwachte output: `<?xml version="1.0" encoding="UTF-8"?>` en een `<svg>`-tag.

- [ ] **Step 4: Commit**

```bash
git add assets/qr-handout.svg
git commit -m "feat: add QR code pointing to /handout.pdf"
```

---

## Task 12: `.gitignore`

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Schrijf `.gitignore`**

```gitignore
# OS
.DS_Store
Thumbs.db

# Editors
.vscode/
.idea/
*.swp

# Build artifacts
handout.pdf
dist/

# Logs / temp
*.log
node_modules/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: add .gitignore"
```

---

## Task 13: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Schrijf `README.md`**

```markdown
# SmartPeak — EMS-presentatie

Een herbruikbare web-based presentatie over EMS en thuisbatterijen, gebouwd op Reveal.js.

**Live:** https://smartpeak-be.github.io/ems-presentatie/

## Lokaal draaien

```bash
python3 -m http.server 8765
# Open http://localhost:8765 in een browser
```

## PDF-export

In de browser: voeg `?print-pdf` toe aan de URL, dan print naar PDF via Cmd/Ctrl+P.

In CI: wordt automatisch gegenereerd op elke push naar `main` en gepubliceerd als `/handout.pdf`.

## Toetsen

| Toets | Actie |
|---|---|
| ←  →  | Vorige / volgende slide |
| Spatie | Volgende slide |
| Esc | Overzichtsweergave |
| S | Speaker notes venster |
| F | Fullscreen |

## Structuur

Zie `docs/superpowers/specs/` voor het design en `docs/superpowers/plans/` voor implementatieplannen.
Eén slide-file per hoofdstuk in `slides/`.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README"
```

---

## Task 14: Lokale smoke-test — draait de deck?

**Doel:** voor we CI/CD doen, bevestigen dat de deck lokaal opent en alle slides inlaadt.

- [ ] **Step 1: Start lokale server**

```bash
python3 -m http.server 8765 &>/tmp/sp-server.log &
echo $! > /tmp/sp-server.pid
sleep 1
```

- [ ] **Step 2: Controleer dat `index.html` 200 teruggeeft**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8765/
```

Verwachte output: `200`.

- [ ] **Step 3: Controleer dat alle 12 slide-fragmenten 200 teruggeven**

```bash
for chapter in 00-opener 01-stroomnet 02-waar-sta-je-nu 03-zonnepanelen \
               04-thuisbatterij 05-ems-brein 06-uitbreiding 07-vpp-netdiensten \
               08-nuance-regio 09-roi-tool 10-afsluiter 99-bronnen; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8765/slides/${chapter}.html")
  echo "${chapter}: ${code}"
done
```

Verwachte output: elke regel eindigt op `200`.

- [ ] **Step 4: Controleer dat vendored Reveal-assets geladen worden**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8765/vendor/reveal.js/dist/reveal.css
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8765/vendor/reveal.js/dist/reveal.esm.js
```

Verwachte output: twee keer `200`.

- [ ] **Step 5: Controleer dat fonts laadbaar zijn**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8765/assets/fonts/Inter-Regular.woff2
```

Verwachte output: `200`.

- [ ] **Step 6: Stop de server**

```bash
kill "$(cat /tmp/sp-server.pid)"
rm /tmp/sp-server.pid /tmp/sp-server.log
```

- [ ] **Step 7: Geen commit (dit is enkel verificatie)**

Als een van bovenstaande stappen faalt: fix het onderliggend probleem vóór door te gaan.

---

## Task 15: GitHub Actions workflow voor Pages + PDF-export

**Doel:** automatische deploy naar Pages op elke push naar `main`, met PDF-export via decktape.

**Files:**
- Create: `.github/workflows/pages.yml`

- [ ] **Step 1: Schrijf de workflow**

```yaml
name: Build and Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build-pdf:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install decktape dependencies (Chromium)
        run: |
          sudo apt-get update
          sudo apt-get install -y chromium-browser

      - name: Install decktape
        run: npm install -g decktape@3.12.0

      - name: Start local server
        run: |
          python3 -m http.server 8765 &>server.log &
          echo $! > server.pid
          sleep 2

      - name: Generate PDF
        env:
          PUPPETEER_EXECUTABLE_PATH: /usr/bin/chromium-browser
        run: |
          decktape reveal \
            --size 1280x720 \
            --load-pause 500 \
            http://localhost:8765/?print-pdf \
            handout.pdf

      - name: Stop server
        run: kill "$(cat server.pid)" || true

      - name: Upload PDF artifact
        uses: actions/upload-artifact@v4
        with:
          name: handout-pdf
          path: handout.pdf
          if-no-files-found: error

  deploy:
    needs: build-pdf
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Download PDF artifact
        uses: actions/download-artifact@v4
        with:
          name: handout-pdf
          path: .

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/pages.yml
git commit -m "ci: add Pages deploy workflow with decktape PDF export"
```

- [ ] **Step 3: Push en trigger de workflow**

```bash
git push
```

- [ ] **Step 4: Wacht op workflow-resultaat en inspecteer**

```bash
sleep 60
gh run list --limit 1
gh run view --log | tail -60
```

Verwachte output: run met status `completed` en conclusion `success`. Als `failure`: log bekijken, fix, opnieuw pushen.

- [ ] **Step 5: Bevestig Pages URL**

```bash
curl -sI https://smartpeak-be.github.io/ems-presentatie/ | head -1
curl -sI https://smartpeak-be.github.io/ems-presentatie/handout.pdf | head -1
```

Verwachte output: beide `HTTP/2 200`.

---

## Task 16: Browser-smoke-test van de gedeployde site

**Doel:** visuele bevestiging dat de deck zoals verwacht opent. Dit is handmatige validatie — Kevin (of een browser-automation in latere iteratie) bekijkt de site.

- [ ] **Step 1: Open `https://smartpeak-be.github.io/ems-presentatie/` in de browser**

Verwacht:
- Titelslide zichtbaar met "Slim omgaan met jouw energie" + logo links boven
- Inter font geladen (niet systeemdefault)
- Donker-marine kleur voor de titel
- Amber progress-bar bovenaan

- [ ] **Step 2: Navigeer met pijltjestoets door alle hoofdstukken**

Verwacht: 12 hoofdstuk-containers. De meeste met placeholder-tekst. Chapter-label rechtsboven klopt bij het hoofdstuk.

- [ ] **Step 3: Druk ESC voor overzichtsmode**

Verwacht: grid-overzicht van alle slides.

- [ ] **Step 4: Druk `S` voor speaker notes**

Verwacht: pop-up met notes-view, bronvermelding en scaffold-tekst zichtbaar.

- [ ] **Step 5: Ga naar hoofdstuk 9 (ROI-tool) en wacht op iframe-laad**

Verwacht: SmartPeak ROI-tool wordt geladen in iframe en is interactief.

- [ ] **Step 6: Download `https://smartpeak-be.github.io/ems-presentatie/handout.pdf` en open**

Verwacht: PDF met alle slides, visueel consistent met de web-versie.

- [ ] **Step 7: Bij problemen: issues loggen in deze repo met screenshot**

Geen commit — enkel validatie.

---

## Self-Review Checklist

Na alle tasks:

- [ ] **Spec coverage** — elk deel van de spec heeft een task in dit plan:
  - Repo in `smartpeak-be` org: Task 0 ✓
  - Reveal.js + vendoring: Task 1 ✓
  - Inter font self-hosted: Task 2 ✓
  - Theme CSS (kleuren, typografie): Task 4 ✓
  - Print-CSS voor PDF: Task 5 ✓
  - Reveal init + navigatie: Task 6 ✓
  - index.html met loader: Task 7 ✓
  - Scaffolds 12 slide-files: Tasks 8 + 9 ✓
  - sources.md: Task 10 ✓
  - QR-code: Task 11 ✓
  - CI/CD met Pages + PDF-export: Task 15 ✓
  - ROI-tool iframe-slide: Task 9.9 ✓
  - Speaker notes plugin: Task 6 ✓

- [ ] **Placeholder scan** — `grep -n 'TBD\|TODO\|fill in\|implement later' docs/superpowers/plans/2026-04-18-ems-presentation-foundation.md` mag alleen expliciete "komt in vervolgplan"-verwijzingen tonen, geen onwerkbare placeholders.

- [ ] **Type consistency** — CSS-klassen `sp-*` consistent tussen `reveal-overrides.css` en slide-files. `sp-valkuil`, `sp-goed`, `sp-bron`, `sp-logo`, `sp-chapter-label`, `sp-title-slide`, `sp-subtitle`. Alle hoofdstukken gebruiken `sp-chapter-label` in dezelfde positie.

- [ ] **Geen gefabriceerde paden** — elke file die later wordt gerefereerd, wordt eerder in het plan gecreëerd. Geen forward-references naar niet-bestaande assets.

---

## Wat NA dit plan komt

Per hoofdstuk een eigen content-plan (`docs/superpowers/plans/2026-MM-DD-hoofdstuk-NN-<topic>.md`). Elk content-plan:

1. Onderzoekt en valideert bronnen (zie `sources.md`).
2. Schrijft concrete slide-tekst + speaker notes.
3. Voegt illustraties/iconen toe aan `assets/`.
4. Test lokaal + deployt via CI.

Voorgestelde volgorde van content-plannen:
- Hoofdstuk 1 (Stroomnet) — fiets-analogie, zet rode draad neer
- Hoofdstuk 2 (Factuur) — validatie capaciteitstarief-nuance
- Hoofdstuk 4 (Thuisbatterij) — kern, langste hoofdstuk
- Hoofdstuk 3 (Zonnepanelen)
- Hoofdstuk 5 (EMS)
- Hoofdstuk 6 (Uitbreiding)
- Hoofdstuk 7 (VPP)
- Hoofdstuk 8 (Regio-nuance)
- Hoofdstuk 9 (ROI-tool checklist + assumpties)
- Hoofdstuk 0 + 10 (opener + afsluiter) — als laatste, zodra alle inhoud landt.
