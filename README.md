# SmartPeak, EMS-presentatie

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
