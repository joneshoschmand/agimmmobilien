# AG Immobilien · Wangerooge

Statische Neugestaltung rund um `ag-inselmakler.de/angebote`.
Hell, sandfarben, mit dem Gold aus dem AG-Logo. Reines HTML/CSS/JS – kein Build, kein Framework.

## Seiten

```
index.html      Start – Hero mit CTAs, Strandkorb-Szene, Teaser der Angebote, Zitat, Kurzvorstellung
angebote.html   Alle fünf Objekte mit Filter, Sonnenlauf und Strandkorb-Marken
insel.html      Warum Wangerooge – Strichzeichnung, Kennzahlen, Insel-Notizen
kontakt.html    Anschrift, Telefon, E-Mail, Anreise
impressum.html  Text 1:1 von ag-inselmakler.de/impressum
datenschutz.html  Datenschutzerklärung, Text 1:1 von ag-inselmakler.de/datenschutz
```

Über uns, Leistungen und Referenzen verweisen weiterhin auf ag-inselmakler.de –
für diese Inhalte gab es keine Vorlage.

## Dateien

```
assets/css/style.css
assets/js/main.js    Scroll-Choreografie, Sonnenlauf, Strandkorb, Filter, Navigation
assets/fonts/        Inter (variabel, selbst gehostet – keine Google-Fonts-Anfrage)
assets/img/          aufbereitete Bilder
assets/img/original/ unveränderte Downloads von der Wix-Seite
```

## Bilder

Die Objekt- und Teamfotos stammen von ag-inselmakler.de. Die Objektfotos lagen
dort mit weißem Rahmen und eingebranntem Wasserzeichen vor; für die Karten wurde
der Bildinhalt freigestellt und auf 1500 px Breite gerechnet. Zwei Fotos wurden
nachträglich beigesteuert (`insel-buhne.jpg`, `strand-seehund.jpg`) – Lizenz und
Nennung sind dort zu prüfen, wo sie herkommen. Alle Originale liegen unverändert
in `assets/img/original/`.

| Datei | Objekt |
|---|---|
| `objekt-leuchtfeuer.jpg` | AG-WA-93-16 · Kompakt. Zentral. Ruhig. |
| `objekt-panorama.jpg` | AG-WA-04-38 · Inselidylle mit Panoramablick |
| `objekt-traumhaus.jpg` | AG-WA-140-01 · Ein Traumhaus auf Wangerooge |
| `objekt-passat.jpg` | AG-WA-08-94 · 50 Schritte bis zum Strand |
| `objekt-ruheoase.jpg` | AG-WA-141-01 · Die Ruheoase auf Wangerooge |
| `insel-buhne.jpg` | Seitenkopf `insel.html` – Sonnenuntergang an der Buhne |
| `strand-seehund.jpg` | Panel am Ende von `angebote.html` – Seehund am Strand |

## Scroll-Effekte

Alles läuft in **einem** rAF-Takt (`frame()` in `main.js`): Parallaxe für Hero-,
Band- und Objektbilder, Einblenden per Sichtbarkeitsprüfung, Fortschrittsbalken,
Kopfzeilen-Zustand, Zähler. Bewusst ohne IntersectionObserver, damit Inhalte nie
in einem unsichtbaren Zustand hängen bleiben. `prefers-reduced-motion` schaltet
sämtliche Bewegung ab; ohne JavaScript ist über `<noscript>` alles sichtbar.

### Sonne über den Inseraten (`angebote.html`)

`.sunscape` trägt eine Sonne samt warmem Lichtschein. `main.js` rechnet aus dem
Scrollfortschritt des Abschnitts einen Sonnenbogen und setzt `--sun-x` und
`--sun-top`. Dieselbe Variable steuert den Schattenwurf der kleinen Strandkörbe
an den Bildecken – der Schatten kippt also mit dem Sonnenstand.
Beim Einblenden läuft zusätzlich ein Lichtstreif über jedes Foto
(`.offer__sweep`), beim Überfahren erneut.

### Strandkorb-Szene (`index.html`)

Die Keyframe-Mechanik stammt aus der anime.js-Vorlage und ist in `main.js` als
kleine Timeline nachgebaut – ohne Bibliothek. **Die Zeitachse läuft nicht von
selbst, sondern am Scrollrad:** wandert die Szene durchs Blickfeld, läuft der
Korb von der linken Mulde im Sand bis zur rechten – flach, in gleicher Höhe,
mit leichtem Anheben und einer Neigung in die Laufrichtung. Wer zurückscrollt,
schickt ihn denselben Weg zurück. Ein weiches Nachziehen
(`ist += (ziel - ist) * 0.055`) nimmt das Tempo raus.

In der Szene stehen außerdem ein Mehrfamilienhaus, das Ortsschild „Wangerooge"
und eine Babyrobbe – alle drei als SVG-Symbole im Sprite oben in `index.html`,
nach Tiefe gestaffelt (Haus hinten und klein, Schild in der Mitte, Robbe vorn
und groß). Der Strandkorb läuft davor durchs Bild.

Drei bewusste Abweichungen von der Vorlage: die volle 360°-Drehung liegt auf
der Sonne statt auf dem Korb – ein sich überschlagender Strandkorb wirkte wie
ein Gag –, der `playbackEase` entfällt, weil das Tempo vom Scrollen kommt, und
die y-Spur hebt nur noch an (nie unter die Standlinie), damit der Korb die
Strecke wirklich quer über den Strand nimmt.

## Lokal ansehen

```bash
python3 -m http.server 8123
```

Danach http://localhost:8123 öffnen. Ein Datei-Öffnen per `file://` funktioniert
ebenfalls, nur die Schrift wird dann je nach Browser blockiert.

## Preise je m²

Die Angabe „ca. … € / m²" unter jedem Preis ist aus Kaufpreis und Wohnfläche
gerechnet und entsprechend als Näherung ausgewiesen – sie stand so nicht auf der
Ursprungsseite.

## Hinweis zur Datenschutzerklärung

Der Text ist wörtlich von ag-inselmakler.de übernommen und beschreibt die dort
laufende Wix-Seite. Diese statische Fassung setzt **weder Cookies noch Tracking**
ein und hat kein Kontaktformular. Sollte sie die bestehende Seite ersetzen,
gehören die Abschnitte zu etracker, Cookie-Consent-Tool, technisch notwendigen
Cookies, Kontaktformular und kostenpflichtigen Leistungen entsprechend
angepasst oder gestrichen – am besten von der Stelle, die den Text erstellt hat
(activeMind AG).
