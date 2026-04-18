# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Presentation about EMS (Energy Management System) for SmartPeak. Being built collaboratively — treat this CLAUDE.md as a living document and update sections below as decisions are made.

## Status

Design goedgekeurd 2026-04-18. Spec: `docs/superpowers/specs/2026-04-18-ems-presentation-design.md`.
Brainstorm-beslissingen: `brainstorm/decisions.md`.

**Volgende stap:** implementatieplan schrijven via `superpowers:writing-plans`, daarna gefaseerd implementeren.

## Stack

- **Framework:** Reveal.js (4.x), static HTML/CSS/JS — geen build-step waar vermijdbaar.
- **Deploy:** GitHub Pages in `smartpeak-be` organisatie (admin-toegang via Blox-It-account).
- **Font:** Inter, self-hosted (GDPR).
- **PDF-export:** Reveal built-in `?print-pdf`, in CI gegenereerd.

## Commands

_To be filled in during implementatie (dev server, PDF-export, deploy)._

## Architecture

Zie spec. Repo-structuur (`slides/`, `css/`, `js/`, `assets/`) met één slide-file per hoofdstuk, `sources.md` als werklijst van bronnen.

## Inhoudelijke regels (vastgelegd in brainstorm)

- **Positionering:** expertise impliciet, nooit expliciet "wij zijn beter" of "kom bij ons". Geen USP-slides.
- **Claim-validatie:** elke bewering op een slide krijgt een bron. Waar Kevins input afwijkt van de bron, expliciet flaggen én corrigeren.
- **Rode draden:** fiets-analogie (netbalans), "markt egaliseert zichzelf" (dynamisch tarief + VPP), peakshaving-vs-zelfconsumptie trade-off, nuance-taal waar we simplifiëren.

## Working notes

- When adding slides, keep one slide per file/section where the tooling supports it — easier to review diffs.
- Diagrams: prefer text-based formats (Mermaid, D2, PlantUML) over binary images so they're diff-friendly and regenerable.
- Speaker notes belong in the slide source, not a separate doc.
