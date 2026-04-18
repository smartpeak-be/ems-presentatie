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

// Expose the deck instance globally so tools that expect the classic
// script-tag API (e.g. decktape, which probes window.Reveal.getProgress())
// can drive the deck. With ESM imports, Reveal is a class, not a singleton.
window.Reveal = deck;

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
