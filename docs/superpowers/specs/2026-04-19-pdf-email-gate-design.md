# PDF Email-Gate — Design

**Datum:** 2026-04-19
**Status:** goedgekeurd 2026-04-19, direct naar implementatie.

## Kernidee

Bezoekers van een SmartPeak-infoavond scannen aan het eind een QR-code. Die wijst niet meer rechtstreeks naar de handout-PDF, maar naar een landing-pagina waar ze hun email opgeven. Ze krijgen daarna (a) de PDF direct op scherm als download én (b) een bevestigingsmail met dezelfde link. Ondertussen komt een notificatie met hun lead-gegevens binnen op `info@smartpeak.be`.

De opzet is bewust mail-only. Geen database, geen SaaS-dashboard, geen eigen backend. De mailbox is de lead-lijst.

## Beslissingen uit de brainstorm

- **Mail-only opslag.** Geen Firebase, geen Mailchimp. Notificaties belanden in `info@smartpeak.be` en worden daar beheerd zoals elke andere inbox. Migratie naar een echte tool blijft later mogelijk zonder weggooi.
- **Delivery = download + mail.** Bevestigingspagina toont een download-link die de PDF meteen start. Bezoeker krijgt ook een mail met dezelfde link, als back-up en voor latere referentie.
- **Velden = email (verplicht) + voornaam (optioneel) + opt-in (niet standaard aangevinkt).** Voornaam is optioneel om friction laag te houden. Opt-in scheidt "gewone PDF-downloader" van "mag gemailed worden voor updates". Dat onderscheid is wettelijk nodig als SmartPeak ooit een nieuwsbrief wil.
- **Eén QR voor alle infoavonden.** Geen event-tracking per locatie of datum.
- **Mail-backend = Formsubmit.co.** Gratis, geen account, geen API-key. Autoresponse en honeypot ingebouwd, redirect na submit via `_next`.
- **Geen "Door te verzenden ga je akkoord"-zin onder het formulier.** De privacy-notitie is wel bereikbaar via een kleine footer-link.

## Architectuur

Alles in de bestaande `smartpeak-be/ems-presentatie`-repo. Geen aparte deploy.

- **`/handout/index.html`** — landing-pagina met formulier. Zelfde SmartPeak-styling als de deck (dezelfde kleurenset, Inter-font, marine/amber), maar zonder Reveal.js.
- **`/handout/bedankt.html`** — bevestigingspagina. Start automatisch de PDF-download via `<meta http-equiv="refresh">`, toont ook een directe download-knop als fallback.
- **`/privacy/index.html`** — korte privacy-notitie. Discreet gelinkt in de footer van de landing- en bedankt-pagina.
- **`/handout.pdf`** — ongewijzigd. Blijft gegenereerd door de bestaande CI via Puppeteer.
- **`css/handout.css`** — standalone stylesheet voor de nieuwe pagina's. Herbruikt CSS-variabelen uit `reveal-overrides.css` maar zonder Reveal-afhankelijkheid.
- **`assets/qr-handout.svg`** — regeneren zodat hij naar `https://smartpeak-be.github.io/ems-presentatie/handout/` wijst in plaats van naar `.pdf`.

## Data-flow

1. Bezoeker scant de QR op slide 10.2 → browser opent `.../handout/`.
2. Landing-pagina laadt. Formulier heeft:
   - `email` (verplicht, HTML5 `type="email"`)
   - `voornaam` (optioneel)
   - `marketing_optin` (checkbox, uit by default)
   - `_honey` (verborgen honeypot-veld)
   - `_next` (redirect-URL → `/handout/bedankt.html`)
   - `_subject` ("Nieuwe handout-download, EMS-infoavond")
   - `_template` = `table` voor een nette lay-out in de notificatie-mail
   - `_autoresponse` met tekst "Bedankt voor je bezoek aan de SmartPeak-infoavond. Hier is de handout: https://smartpeak-be.github.io/ems-presentatie/handout.pdf"
3. Form POST naar `https://formsubmit.co/info@smartpeak.be`.
4. Formsubmit.co:
   - stuurt notificatie naar `info@smartpeak.be` (tabel-view),
   - stuurt auto-reply naar bezoekers-email met de PDF-link,
   - redirect de browser naar `/handout/bedankt.html`.
5. Bedankt-pagina triggert PDF-download automatisch, toont fallback-knop.

Eénmalige setup: de eerste submit vereist dat `info@smartpeak.be` bij Formsubmit.co geactiveerd wordt via een bevestigingsmail. Dat is een eenmalige manuele klik door Kevin.

## Error handling

- *Ongeldig of leeg email-veld* → HTML5 `required` + `type="email"` valideren in de browser. Formsubmit.co doet een tweede check.
- *Honeypot gevuld* → Formsubmit.co negeert submissie stil.
- *Formsubmit.co onbereikbaar* → footer-regel op landing: "Lukt het niet? Mail `info@smartpeak.be` en we sturen je de handout zelf door."
- *Auto-reply landt in spam* → bedankt-pagina toont download-knop naast de melding, PDF is dus onafhankelijk van de mail bereikbaar.

## Privacy

Korte notitie op `/privacy/`:
- Verantwoordelijke: SmartPeak. Sub-verwerker: Formsubmit.co (mail-doorstuurservice).
- Verwerkte data: email, voornaam (indien opgegeven), tijdstempel, opt-in-status, beperkt IP-adres-log bij Formsubmit.
- Doel: (a) handout-PDF bezorgen, (b) bij opt-in, occasioneel SmartPeak-updates sturen.
- Retentie: zolang in inbox `info@smartpeak.be`, volgt bestaand inbox-beleid.
- Recht op verwijdering: bezoeker mailt naar `info@smartpeak.be`, manueel wissen.
- Geen verdere derde partijen.

## Testing

Handmatig voor de eerste validatie:
- Vul formulier in met testmail → (1) Kevin krijgt notificatie in `info@smartpeak.be`, (2) testmail krijgt auto-reply met PDF-link, (3) browser redirect naar bedankt-pagina, (4) PDF-download start automatisch.
- Leeg formulier → browser-validatie blokkeert.
- Ongeldig email-formaat → browser-validatie blokkeert.
- Honeypot: programmatisch invullen (dev-tools), submit → Formsubmit negeert, geen notificatie binnen.
- Mobile test: iOS Safari + Android Chrome, telefoon-toetsenbord op `type="email"` veld = email-layout.

## Wat niet in deze spec zit

- Migratie naar een echte lead-tool (Mailchimp, HubSpot, Firebase). Komt later als volume het vraagt.
- Per-event tracking (QR per infoavond). Bewust uitgesteld.
- Dubbele opt-in verificatie (bezoeker klikt op bevestigingslink in de auto-reply). Niet nodig bij dit lage volume.
- Rate-limiting. Formsubmit.co doet dit intern.
