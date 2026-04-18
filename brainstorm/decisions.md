# Brainstorm — beslissingen & content-input

Lopende registratie van beslissingen tijdens brainstorm. Spec volgt later in `docs/superpowers/specs/`.

## Publiek & setting

- **Doelgroep:** primair particulieren (koopbeslissing), daarna B2B-prospects, daarna algemene geïnteresseerden in EMS.
- **Voorkennis:** mix van leken en prosumers — basis meenemen zonder prosumers te verliezen.
- **Setting:** infoavond / klantendag (plenair, zaal). Latere ingekorte 1-op-1 variant uit dezelfde bron.
- **Duur:** richtlijn 30–45 min (flexibel, volgt uit inhoud).
- **Taal:** Nederlands.
- **Gewest:** Vlaanderen primair, één nuance-slide voor Wallonië/Brussel.

## Doel & positionering

- **Dubbele doelstelling:** sensibilisering (expertise overdragen) + impliciete klantenwerving.
- **Kernboodschap:** *"Je gaat naar huis met genoeg kennis om zelf de juiste keuze te maken — en om herkennen wanneer iemand anders die keuze voor jou probeert te maken."*
- **Positioneringsregel:** expertise blijkt uit de inhoud, nooit expliciet. Geen "waarom SmartPeak?"-slide. Conclusie dat SmartPeak te vertrouwen is, moet publiek zelf trekken.
- **Stijl-element:** expliciet benoemen wanneer iets vereenvoudigd is en waar meer nuance bestaat. Terugkerend motief.

## Valkuilen in de markt (rode draad door de deck)

1. Oversizing — installaties die de installateur verrijken, niet de klant
2. ROI op best-case — algemene data ipv klantprofiel, altijd rooskleurig
3. Vendor lock-in + vage data — meerwaarde blijft onmeetbaar met opzet
4. Kleine lettertjes — dekken de te-positieve verkoopspraat af
5. Slechte installaties — installateurs die het product niet kennen
6. Beloftes over VPP/netdiensten die nog niet waargemaakt worden (toegevoegd vanuit EMS-scope beslissing)

## Verhaalstructuur

Hybride b+c: **klantenreis als ruggengraat, valkuil-moment bij elk station.**

## EMS-scope

- **Definitie:** in-woning + aggregator/VPP, met eerlijke afbakening dat VPP nog beperkt bewezen is voor particulieren in BE.
- **Componenten in scope:** slimme meter + capaciteitstarief, PV + injectie, thuisbatterij, EMS-brein, dynamische tarieven, laadpaal + EV, warmtepomp + boiler (inhoudelijk wel, SmartPeak installeert ze niet).
- **Home Assistant:** enkel high-level vermelding als voorbeeld voor meer controle/uitbreidbaarheid.
- **Technische diepte:** functioneel "slim brein", zonder formele protocollen-slide. Waar relevant (AC/DC) mag wel technische diepte.

## Thuisbatterij — inhoudelijke keuzes

### Use-cases (alle vier)
- Zelfconsumptie
- Piekscheren / capaciteitstarief
- Arbitrage op dynamisch tarief
- Back-up

### Chemie
- Kort aanhalen, LFP vs NMC.
- Nadruk op **brandveiligheid** en preventiemiddelen die moderne batterijen standaard bevatten.

### AC vs DC — belangrijk differentiator
- Verschillen + voordelen expliciet.
- **Types:**
  - Vaste/geïntegreerde systemen: één batterij + omvormer (vb. Marstek).
  - Modulaire "blok"-systemen (vb. Zendure).
- **Verlies door omvorming** (AC/DC) als criterium.
- **DC-charging voor EV** (vb. Sungrow): hoge snelheid zónder belasting aan AC-zijde, dus geen capaciteitstarief-impact.
- **Vehicle-to-Grid** ondersteuning in nieuwere systemen — wat het is, wat het betekent.

### Sizing
- In directe relatie tot ROI.
- Maar: **meer dan kostprijs** speelt bij EMS:
  - Ecologische waarde van eigen productie.
  - Minder afhankelijkheid = minder impact van marktprijsschommelingen.
- Dit zet de "oversizing"-valkuil in een bredere context.

### Off-grid / back-up nuance
- **Off-grid** uitleggen: wat betekent het écht.
- **Back-up** in de markt losjes gebruikt:
  - Vaak: één stopcontact dat door blijft werken.
  - Niet automatisch: hele woning overnemen bij netuitval.
  - Er zíjn wel opties voor volledige back-up — benoemen.

### Veiligheid & garantie
- Brandveiligheid (aansluitend op chemie).
- Garantievoorwaarden — cycli, DoD, degradatie, kleine-lettertjes-valkuil.

## Tooling / formaat

- **Bronformaat:** web-slides (static) deploybaar naar GitHub Pages.
- **Leveringsformaat:** browser-presentatie, PDF-export als back-up.
- **Interactiviteit:** SmartPeak ROI-tool geïntegreerd via iframe op dedicated slide.
  - URL: https://smartpeak-be.github.io/battery-roi-tool/
  - Vóór de tool: slide met de vijf belangrijkste assumpties (tarieven, capaciteitstarief, cycli, BTW, keuring).
  - Na de tool: slide "dit neem je mee naar huis om een aanbieding tegen het licht te houden".
  - Voorbereide gedeelde-resultaten-URL zodat live-upload niet nodig is.
- **Visuele stijl (voorlopig):** sober, witte achtergrond, één primaire accentkleur, sans-serif, vectoricons. Geen foto's van installaties (te reclame-achtig).
- **Deploy:** GitHub Pages in `smartpeak-be` org (admin-toegang via Blox-It bevestigd). Repo-naam TBD, bv. `smartpeak-be/ems-presentatie`.

## SmartPeak-scope (ter referentie tijdens inhoud)

Zie memory `project_smartpeak_scope.md`. Kort:
- Kern: thuisbatterijen, installatie + advies.
- Ook: laadpalen, omvormer-vervanging, PV in uitzonderlijke gevallen (platte daken, via onderaanneming op vraag).
- Niet: warmtepompen.
- Geen eigen EMS-platform; default software van hardware, Home Assistant op vraag.
- Nazorg: eerste maanden gratis opvolging, periodieke sanity checks uit eigen interesse (geen garantie). Bewust géén nazorg-abonnement om ROI voor klant niet te belasten.

## Inhoudelijk-praktisch

- **Dynamische-tariefleveranciers:** bij naam noemen (Engie Drive, Bolt, Tibo, Luminus, OCTA+, Mega, ...). Disclaimer dat aanbod wijzigt.
- **Subsidies/premies:** terloops vermelden dát ze bestaan, geen concrete cijfers in de deck (herbruikbaarheid). Speaker notes mag actuele pointers bevatten.
- **Cijferbronnen:** publieke bronnen (VREG, Fluvius, Elia, FOD Economie) voor marktdata; eigen geanonimiseerde klantdata voor ROI-voorbeelden.
- **Cases/testimonials:** GDPR-veilig — fictief maar realistisch klantprofiel. Later upgrade met anonieme CSV van echte klant.
- **Presentatoren:** Kevin + collega, wisselend (soms samen, soms apart). Speaker notes nodig in de slides, bondig-maar-volledig, bruikbaar door beiden.
- **Bestaande content:** geen — vanaf nul.
- **Technische diepte (nuance):** geen aparte protocollen-slide, wél technische diepte waar ze direct relevant is voor de klant (AC/DC, V2G, verliezen).

## Design-laag (finaal)

- **Framework:** Reveal.js, static build, deploy naar GitHub Pages in `smartpeak-be` org.
- **Navigatie:** PowerPoint-stijl — pijltjes, spacebar, ESC (= Reveal overview mode). Reveal-default.
- **Slide-stijl:** sober, kort-en-krachtig, weinig tekst. Visueel werk: iconen, tekeningen, diagrammen. Notes doen het zware werk.
- **Valkuilen:** cumulatieve valkuil-slide per hoofdstuk waar relevant (dus niet per sub-onderdeel). Niet elke slide heeft een valkuil.
- **Handouts:** QR-code op afsluit-slide → PDF-download.
- **Logo:** site-logo is een JPEG (WhatsApp-afbeelding). Opnemen als placeholder, upgrade zodra een SVG beschikbaar is.
- **Kleur:** site gebruikt WordPress-defaults (geen merk-kleur). Voorstel: donker-marine primair, amber als attentie-accent, soft green als "duurzaam/goed"-signaal. Tekst donker-zwart op wit.
- **Font:** Inter (self-hosted, GDPR-vriendelijk).
- **Bronnen:** kleine bronvermelding onderaan slide waar een claim valt + volledige bronnenslide aan einde van deck.
- **Validatie:** elke statement via externe bronnen verifiëren vóór hij in een slide landt. Correcties op Kevins initiële input expliciet flaggen (cf. capaciteitstarief-nuance).
- **Hoofdstuk 1 fiets-analogie:** individuele fietser (niet peloton/tandem). Constante kracht + vlak + windstil = constante snelheid. Helling omhoog/tegenwind → meer kracht; helling omlaag/rugwind → minder of remmen. Op voorhand harder trappen = te snel = frequentie stijgt.
- **Rode draad "markt egaliseert zichzelf":** geïntroduceerd in hoofdstuk 1 (grote batterijparken), teruggehaald in hoofdstuk 2 (dynamisch), hoofdstuk 4 (arbitrage), hoofdstuk 7 (VPP).
- **Rode draad "peakshaving vs zelfconsumptie":** expliciete trade-off-slide in hoofdstuk 4. Capaciteitstarief-mechanisme (exacte Fluvius-regel) verifiëren.
