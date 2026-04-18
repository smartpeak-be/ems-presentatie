# EMS-presentatie SmartPeak — Design

**Datum:** 2026-04-18
**Status:** design, wachtend op review

## Kernidee

Een herbruikbare, web-based presentatie over EMS en thuisbatterijen, primair voor particuliere infoavonden in Vlaanderen. Doel: het publiek kennis meegeven waarmee ze een onderbouwde keuze kunnen maken én typische verkooppraktijken in de sector kunnen herkennen. SmartPeak wordt zichtbaar als de bron, niet als verkoper — expertise blijkt uit de inhoud, niet uit claims.

**Kernboodschap:** *"Je gaat naar huis met genoeg kennis om zelf de juiste keuze te maken — en om herkennen wanneer iemand anders die keuze voor jou probeert te maken."*

## Publiek, setting, taal

- **Doelgroep:** primair particulieren (koopbeslissing); daarna B2B-prospects en algemene geïnteresseerden.
- **Voorkennis:** mix van leken en prosumers. Basis meenemen zonder prosumers te verliezen.
- **Setting:** infoavond/klantendag (plenair, zaal, 20-100 personen). Secundair: ingekorte 1-op-1 variant uit dezelfde bron, later.
- **Duur:** richtlijn 45 min + Q&A. De som van de hoofdstuk-indicaties hieronder komt uit op ~52 min; bij implementatie snoeien we in de slide-invulling van hoofdstukken 4 en 5 (de dikste) tot ~45 min gehaald wordt. Timing per hoofdstuk is indicatief, niet vast.
- **Taal:** Nederlands.
- **Gewest:** Vlaanderen primair, één nuance-slide voor Wallonië/Brussel.
- **Presentatoren:** Kevin + collega, wisselend (soms samen, soms apart). Speaker notes bondig-maar-volledig, bruikbaar door beiden.

## Positioneringsregel (hard)

Geen expliciete zelfpromotie. Geen "waarom SmartPeak?"-slide. Geen bullets met USPs. Logo en bedrijfsnaam zijn aanwezig op de titel-slide en de afsluiter; contact (sober, geen salespitch) staat op de afsluiter. Alle overtuigingswerk gebeurt impliciet via de kwaliteit en eerlijkheid van de inhoud.

## Verhaalstructuur

**Klantenreis als ruggengraat, valkuil-moment per hoofdstuk.** Hoofdstukken bouwen op elkaar: elke stap voegt kennis toe waarmee het publiek de volgende stap beter kan beoordelen. Valkuilen zijn geen aparte "aanklacht"-sectie, maar een terugkerend ritme aan het einde van de relevante hoofdstukken.

### Rode draden door de deck

1. **Fiets-analogie voor netbalans.** Individuele fietser, constante kracht op vlak terrein = constante snelheid. Helling/wind verstoort, correctie is real-time. Deze analogie wordt in hoofdstuk 1 geïntroduceerd en teruggehaald bij dynamische tarieven (hoofdstuk 2) en netdiensten (hoofdstuk 7).
2. **De markt egaliseert zichzelf.** Dynamische tarieven en batterij-arbitrage leven van prijsverschillen die krimpen door (a) stijgende basisvraag (elektrificatie) en (b) industriële batterijparken van 400+ MW. Wordt geïntroduceerd in hoofdstuk 1, terugkomt in hoofdstukken 2, 4 en 7.
3. **Peakshaving versus zelfconsumptie is een trade-off.** Niet beide optimaal tegelijk — capaciteit reserveren voor piek kost zelfconsumptie-ruimte. Capaciteitstarief is bovendien onverbiddelijk qua meting (te verifiëren: exacte Fluvius-mechaniek). Deze nuance wordt expliciet in hoofdstuk 4.
4. **Nuance-taal.** Waar we simplificeren, zeggen we het. Terugkerende zinnen als *"dit is versimpeld — de werkelijkheid kent meer uitzonderingen"*.
5. **Valideer voor je claimt.** Elke harde bewering op een slide krijgt een bronvermelding. Waar Kevins initiële input afwijkt van de bron, flaggen we dat expliciet in brainstorm-notes én corrigeren we in de slide.

## Hoofdstuk-outline

### 0. Opener (3 slides, ~3 min)
- Titel + SmartPeak logo.
- "Wat neem je vanavond mee" — kernboodschap, zonder verkooppraatje.
- Roadmap van de avond.

### 1. Hoe werkt het stroomnet? (4-5 slides, ~5 min)
- Elektriciteit = real-time balans van vraag en aanbod.
- **Fiets-analogie** als metafoor voor frequentie.
- Frequentie van 50 Hz als maat.
- Productiemiddelen en hun reactiesnelheid: kern (traag, laag CO₂), gas (sneller, CO₂-intensief), wind/zon (niet stuurbaar), batterijen (milliseconden).
- Grote batterijparken als nieuwe speler — introductie voor de "markt egaliseert zichzelf"-draad.

### 2. Waar sta je nu? (5 slides, ~5 min)
- Hoe ziet je factuur er vandaag uit — vier componenten: verbruik, capaciteitstarief, injectie, vast/dynamisch.
- **Capaciteitstarief uitgelegd** (exacte Fluvius-mechaniek te verifiëren; huidige vermoeden: maandpiek per maand met minimum van 2.5 kW, glijdend gemiddelde over 12 maanden).
- Vast vs dynamisch tarief — terugverwijzing fiets-analogie (zon = rugwind, winteravondpiek = helling opwaarts + tegenwind).
- Slimme meter als meetbasis.
- **Valkuil:** dynamisch contract is profiteren van prijsverschillen die aan het krimpen zijn. Het werkt nu, minder later.

### 3. Je had al zonnepanelen (3 slides, ~4 min)
- Wat veranderde sinds de afschaffing van de terugdraaiende teller.
- Injectietarief en waarom het laag is.
- **Valkuil:** ROI-berekeningen op basis van oude terugdraai-aannames. Vraag hoe een aanbieder jouw opbrengst berekent.

### 4. De thuisbatterij (12-14 slides, ~12 min) *dikste hoofdstuk*
- Vier use-cases geïntroduceerd: zelfconsumptie, piekscheren, arbitrage, back-up.
- **Trade-off zelfconsumptie vs peakshaving** — expliciete slide: niet beide optimaal.
- Chemie: LFP vs NMC, met nadruk op brandveiligheid en moderne preventiemiddelen in batterij-BMS.
- AC- versus DC-gekoppeld: verschillen, verliezen door omvorming.
- Types: vaste/geïntegreerde systemen (voorbeeld Marstek) vs modulair (voorbeeld Zendure).
- Sizing en ROI: oversizing-valkuil, maar ook *meer-dan-geld* (ecologie, onafhankelijkheid van marktschommelingen).
- Off-grid vs back-up: de nuance — back-up betekent vaak één stopcontact, niet de hele woning; er zíjn wel systemen die dat doen.
- Veiligheid, garantie, kleine lettertjes (cycli, DoD, degradatie).
- **Valkuil-slide (cumulatief):** de vier typische verkooptactieken samengebracht — oversizing, best-case ROI, vendor lock-in, vage garantievoorwaarden.

### 5. Het slimme brein: EMS (5 slides, ~6 min)
- Wat doet een EMS functioneel? Orchestratie tussen PV, batterij, verbruikers, net.
- Geen protocollen-slide (bewuste keuze). Waar nodig technische diepte alleen als ze direct relevant is.
- Hoe een EMS dynamische tarieven benut, met terugverwijzing "markt egaliseert zichzelf".
- Home Assistant als terloopse vermelding: voor wie meer controle wil.
- **Valkuil:** gesloten ecosystemen + meerwaarde die met opzet vaag blijft.

### 6. Uitbreiding: EV, warmtepomp, V2G (4-5 slides, ~5 min)
- Laadpaal en smart charging.
- DC-charging en V2G (voorbeeld Sungrow-achtig): voordeel is snelheid zonder AC-capaciteitsbelasting, dus geen capaciteitstarief-impact.
- Warmtepomp en boiler in het EMS-plaatje (high-level; SmartPeak installeert ze niet).
- Geen valkuil in dit hoofdstuk — focus op mogelijkheden.

### 7. Het grotere plaatje: VPP en netdiensten (3 slides, ~4 min)
- Wat is een VPP/aggregator? Terugverwijzing fiets-analogie: batterijen snel genoeg voor frequentieregeling.
- **Eerlijkheidsslide:** wat levert het anno 2026 op voor particulieren in BE? (Concrete cijfers te verifiëren via Elia, CREG.)
- **Valkuil:** beloftes over netdiensten die vandaag nog niet leveren; industriële batterijparken concurreren rechtstreeks met thuisbatterijen op dezelfde opbrengst.

### 8. Nuance: Wallonië en Brussel (1 slide, ~1 min)
Eén slide over de belangrijkste verschillen met Vlaanderen (capaciteitstarief-mechaniek, compensatieregelingen, premies). Geen diepgang; vermijden dat publiek met Waalse familie verkeerd geïnformeerd naar huis gaat.

### 9. De ROI-tool (live) (3 slides, ~5 min)
- **Assumpties-slide:** de vijf parameters die de tool verwerkt — tarieven, cycli, BTW, keuring, CSV-basis.
- **Live iframe-embed** van de SmartPeak ROI-tool met een voorbereid gedeeld scenario (via de deelbare-URL-functie). Geen live CSV-upload tijdens de avond.
- **Checklist-slide:** "wat moet je aan jouw aanbieder vragen voor een eerlijke ROI?" — 5 concrete vragen/getallen die het publiek letterlijk mee naar huis kan nemen.

### 10. Afsluiter (2 slides, ~2 min)
- Samenvatting: wat je vandaag hebt meegekregen (kort, drie punten).
- Contact + QR-code voor PDF-download. Sober: logo, website, mailadres. Geen sales-pitch.

### Bronnen (aparte slide na afsluiter)
Complete lijst van referenties. Bronvermelding gebeurt ook op individuele slides waar een claim valt — deze slide is de complete index.

## Tech

### Framework
- **Reveal.js** (5.1.0, vendored in `vendor/`), zonder build-step — plain HTML/CSS/JS.
- Deploy: GitHub Pages, repo in `smartpeak-be` organisatie.
- Geen server, geen authenticated content, geen externe fonts at runtime (GDPR).

### Navigatie
- Default Reveal: pijltjes, spacebar vooruit, ESC voor overview, F voor fullscreen.
- Progress bar onderaan.
- Slide-nummers uit (zaal-setting, niet nuttig).

### Slide-stijl (visueel)
- **Tekstdichtheid:** kort en krachtig. Eén hoofdgedachte per slide. Speaker notes dragen de uitleg.
- **Visuals:** iconen (vectors), eenvoudige tekeningen, diagrammen (Mermaid waar zinvol), fiets-illustratie voor de analogie.
- **Geen foto's van installaties** — te reclame-achtig voor het eerlijke register.
- **Bronvermelding** onderaan slide in kleine grijze tekst, hyperlink waar mogelijk.

### Kleurpalet (voorstel, ter validatie)
- **Primair:** donker-marine (`#0A2540`) — headers, accenten, links.
- **Accent warm:** amber (`#FFB400`) — highlights, valkuil-indicatoren.
- **Accent groen:** soft green (`#06A77D`) — "duurzaam/goed"-signaal.
- **Tekst:** `#1A202C` op `#FFFFFF`, met `#4A5568` voor bijschriften.
- Verantwoording: de site heeft geen merkkleur (WordPress-defaults). Dit voorstel kiest sober + betrouwbaar + één accent voor waarschuwingen. Kevin valideert.

### Typografie
- **Inter** (self-hosted via `@font-face`, geen CDN, GDPR-veilig).
- Hoofdingen: Inter 700. Body: Inter 400. Monospace alleen waar nodig.

### Logo
- Bestaande JPEG van `smartpeak.be` opnemen in `assets/logo.jpg` als placeholder.
- Spec-TODO: upgrade naar SVG zodra beschikbaar.

### ROI-tool integratie
- Iframe-embed van `https://smartpeak-be.github.io/battery-roi-tool/` op een dedicated slide.
- Vooraf ingevuld scenario via de deelbare-URL-parameter (query-string), zodat live-upload niet nodig is tijdens de presentatie.
- Fallback: screenshot als de tool tijdens de live-demo onverhoopt niet laadt.

### PDF-export en handout
- Reveal-built-in print-stylesheet (`?print-pdf`) genereert een PDF.
- Build-stap in CI: op elke push naar `main` wordt de PDF gegenereerd en gepubliceerd naast de deck.
- QR-code op afsluit-slide verwijst naar `https://smartpeak-be.github.io/ems-presentatie/handout.pdf` (URL definitief bij implementatie).

### Speaker notes
- Ingebouwd in Reveal (`<aside class="notes">`).
- Bondig (≤200 woorden per slide), bruikbaar door Kevin én collega.
- Waar relevant: onderscheid tussen *harde feiten met bron* en *ervaring/overtuiging van spreker*.

### Repo-structuur (voorstel)
```
smartpeak-be/ems-presentatie/
├── index.html              # Reveal entry-point
├── css/
│   ├── theme.css           # kleuren, typografie, layout
│   └── print.css           # overrides voor PDF-export
├── js/
│   └── main.js             # init Reveal, plugins
├── slides/                 # slide-HTML per hoofdstuk
│   ├── 00-opener.html
│   ├── 01-stroomnet.html
│   ├── ...
├── assets/
│   ├── logo.jpg
│   ├── fonts/              # Inter woff2
│   ├── icons/              # SVG iconen
│   └── illustrations/      # diagrammen, fiets-illustratie
├── sources.md              # werklijst van bronnen (voor slide "Bronnen")
├── .github/workflows/
│   └── pages.yml           # build + deploy
└── README.md
```
Één slide-file per hoofdstuk zodat diffs per hoofdstuk leesbaar zijn (consistent met `CLAUDE.md`-werkafspraak).

## Validatie-en-bronnen-discipline

- Voor elke claim die in de deck landt: brondocumentatie in `sources.md` met link, datum en quote.
- Onzekere of voorlopig-geformuleerde claims worden in de slide als *"inschatting"* of *"volgens onze ervaring"* gemarkeerd, niet als feit.
- Bij eerste pass: expliciet valideren van:
  - Capaciteitstarief-mechaniek Fluvius (maandpiek + glijdend gemiddelde?).
  - Afschaffing terugdraaiende teller: datum, uitzonderingen, overgangsregelingen.
  - Reactietijden kern/gas/batterij (indicatieve ordegroottes).
  - Grootte van Belgische/Europese batterijparken anno 2026.
  - Werkelijke opbrengst van VPP-deelname voor particulieren (Elia, CREG).
  - Brandveiligheidscijfers LFP vs NMC (branche-statistieken).
  - Regionale verschillen Wa/Br versus Vlaanderen (CWaPE, Brugel).
- Kennisstand assistent = januari 2026; voor alles van 2026 live verifiëren bij schrijven.

## Open punten na design-review

- Logo-upgrade: wanneer SVG beschikbaar komt, placeholder vervangen.
- Anonieme klant-CSV: Kevin levert aan voor een realistisch ROI-scenario in de tool-slide. Tot dan: fictief realistisch profiel.
- Repo-naam in `smartpeak-be` org: voorstel `ems-presentatie`. Bevestigen bij Kevin vóór aanmaak.

## Wat niet in deze spec zit

- Exacte slide-teksten en illustraties (komt in implementatiefase).
- Uitgewerkte speaker notes per slide (komt in implementatiefase).
- Bronverzameling (komt in implementatiefase, met expliciete verificatie).
- Eventuele latere ingekorte 1-op-1 versie (apart project, uit dezelfde bron).
