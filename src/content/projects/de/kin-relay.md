---
title: Kin Relay
description: 'Eine Plattform zur Pflegekoordination, in der Angehörige und professionelle Pflegekräfte den Tag derselben Person in eine typisierte Dokumentation eintragen: 6 Kategorien, 65 Subtypen und eine Schweregradskala, die ein Audit übersteht.'
order: 4
featured: false
year: 2025
role: Gründer & Principal Engineer
client: Stratos One
technologies:
  - Next.js
  - React
  - TypeScript
  - Supabase
  - PostgreSQL
  - Expo
  - next-intl
  - Zod
  - Leaflet
sectors:
  - Gesundheitswesen
  - Eigene Produkte
logo: /logos/kinrelay.svg
cover: cover-kin-relay.webp
highlights:
  - value: '65'
    label: Typisierte Aktivitäts-Subtypen
    consequence: Ein Sturz, ein ausgefallener Besuch und ein Blutzuckerwert sind eigene Einträge statt dreier Freitextnotizen.
  - value: '11'
    label: Oberflächensprachen
    consequence: Pflegekräfte und Angehörige lesen dieselbe Dokumentation in ihrer Sprache, auch auf Arabisch, Türkisch und Ukrainisch.
  - value: '5'
    label: Mitgliedsrollen
    consequence: Ein lesender Angehöriger, eine angestellte Pflegekraft und eine Dienstleitung sehen denselben Kreis mit unterschiedlicher Befugnis.
outcome: Freitext-Pflegenotizen ersetzt durch eine typisierte, mehrsprachige Dokumentation, in der jedes Ereignis Kategorie, Schweregrad und Verfasser trägt, sodass eine Übergabe zwischen Angehörigen und ambulantem Dienst keine Information mehr verliert.
tradeoff: Pflegeereignisse als eine Tabelle mit sechs kategoriespezifischen Subtyp-Spalten modelliert statt als sechs getrennte Tabellen, dünn besetzte Spalten in Kauf genommen für eine einzige abfragbare Zeitleiste pro Person.
status: Veröffentlicht
engagement:
  duration: 'Seit 2025'
  teamSize: Alleiniger Gründer
  scope: Postgres-Schema, Supabase-Zugriffsregeln, Next.js-Webanwendung, Expo-App und Übersetzungsfläche in elf Sprachen
  relationship: independent
decisionQuote:
  text: 'Freitext ist das Schnellste beim Schreiben und das Teuerste beim Lesen; eine Pflegedokumentation wird einmal geschrieben und unter Druck gelesen.'
github: null
liveDemo: null
video: null
draft: false
---

## Das Problem

Die Pflege einer Person wird fast nie von einer einzigen Partei geleistet. Ein Elternteil, ein Geschwister, ein ambulanter Dienst und eine angestellte Pflegekraft erscheinen in derselben Woche, und jede Seite notiert das Geschehene dort, wo die anderen es nicht sehen: ein WhatsApp-Verlauf, ein Papierordner im Flur, das interne System eines Trägers.

Der Fehlerfall ist nicht dramatisch. Niemand verliert einen Eintrag. Es passiert, dass eine Pflegekraft kommt, ohne vom Sturz am Dienstag zu wissen, oder dass die Familie von einer Medikamentenumstellung drei Tage zu spät erfährt, und die Information, die das verhindert hätte, existierte die ganze Zeit in einem Format, das niemand durchsuchen konnte.

Freitext ist das Schnellste beim Schreiben und das Teuerste beim Lesen; eine Pflegedokumentation wird einmal geschrieben und unter Druck gelesen.

## Rahmenbedingungen, die das Schema geprägt haben

- **Mehrere Organisationen, eine Person.** Ein Familienkreis, eine Senioren-WG und ein ambulanter Dienst haben wirklich unterschiedliche Strukturen, deshalb ist der Kreistyp explizit modelliert: `family`, `senior_wg`, `ambulant_service`.
- **Befugnis ist nicht binär.** Fünf Rollen, owner, manager, carer, family, viewer, weil „darf diese Person Medikamente bearbeiten" und „darf diese Person die Notizen von gestern lesen" verschiedene Fragen sind.
- **Lesende teilen nicht zwangsläufig die Sprache der Schreibenden.** Pflegearbeit in Deutschland ist von Haus aus mehrsprachig. Die Oberfläche erscheint in elf Sprachen, und eine pflegebedürftige Person führt ihre Hauptsprache als Datum mit, nicht als UI-Einstellung.
- **Ein Teil davon ist klinisch.** Ein Blutzuckerwert und ein Schlaganfallverdacht sind nicht dieselbe Art Notiz wie ein Spaziergang im Park, und die Dokumentation muss den Unterschied kennen, ohne dass die eintragende Person einen Absatz schreiben muss.

## Eine Zeitleiste, sechs Kategorien

Die zentrale Entscheidung war, jedes protokollierte Ereignis als Zeile in einer einzigen `activities`-Tabelle zu führen, kategorisiert in sechs Arten: Sicherheit, Gesundheitsbeobachtung, ATL, Umgebung, Dienstleistung und Teilhabe, mit je einer kategoriespezifischen Subtyp-Spalte.

Das ergibt 65 typisierte Subtypen: 11 Sicherheitsereignisse (Sturz, Medikationsfehler, Gefährdungsmeldung, Beinahe-Ereignis), 22 Gesundheitsbeobachtungen (Brustschmerz, Schlaganfallzeichen, Blutzuckerwert, Hautschädigung), 14 Aktivitäten des täglichen Lebens, 3 Umgebungsgefahren, 5 Dienstleistungsvorfälle und 10 Teilhabeaktivitäten vom Lesen bis zum Spaziergang.

Die Alternative waren sechs getrennte Tabellen, eine je Kategorie. Auf dem Papier das sauberere Schema, als Produkt deutlich schlechter: Die häufigste Frage überhaupt, *was ist dieser Person diese Woche passiert*, wäre zu einer Sechs-Wege-Union in jeder Abfrage, jeder Ansicht und jedem Export geworden. Ich habe dünn besetzte Spalten einem Fan-out-Join vorgezogen, weil die Zeitleiste das Feature ist.

Neben der Kategorie stehen zwei orthogonale Skalen, weil sie für alle gelten: `harm_severity` reicht von `no_harm_prevented` über `no_harm_unprevented`, `low`, `moderate`, `severe` bis `death`, und `assistance_level` hält fest, ob die Person selbstständig, beaufsichtigt, teilweise oder vollständig unterstützt war. Der Schweregrad ist bewusst von der Kategorie getrennt: ein Sturz kann ein Beinahe-Ereignis sein, und ein Medikationsfehler kann tödlich enden.

## Eine Taxonomie migrieren, ohne die Historie zu brechen

Die ATL-Subtypen tragen zwei überlappende Generationen von Werten. Der ursprüngliche Satz (`mobility_transfer`, `nutrition_meal`, `sleep_rest`) erwies sich im echten Betrieb als zu grob, ein feinerer ersetzte ihn: `transfer`, `ambulation_walk`, `bathing_hygiene`, `dressing_grooming`, `feeding` sowie getrennte Einträge für Blasen- und Darmkontinenz.

Die alten Werte sind im Typ weiterhin gültig. Das ist kein Versehen: sie zu löschen hätte jede bereits geschriebene Zeile entwertet, und eine Pflegedokumentation, die ihre eigene Geschichte umschreibt, ist schlimmer als eine mit einem leicht unordentlichen Enum. Neue Einträge nutzen die feinere Taxonomie; alte Zeilen bedeuten weiter, was sie bedeuteten, als sie geschrieben wurden.

## Wo es läuft

Die Webanwendung ist Next.js 15 mit React 19, `next-intl` für die elf Sprachen, Zod für die Eingabevalidierung und Leaflet für die Pflegekarte, die Pflegekräfte und Pflegebedürftige geografisch verortet. Supabase liefert Postgres, Authentifizierung und die Zugriffsregeln, die das Rollenmodell durchsetzen. Die mobile App ist Expo, veröffentlicht in Version 1.0.1 unter `com.stratos.kinrelay`, und teilt ihren Anmeldebildschirm mit dem übrigen Stratos-One-Studio.

Beide Oberflächen lesen dieselben Tabellen. Es gibt kein separates Mobile-Schema und keine Mobile-only-Felder, eine Entscheidung, die etwas mobile Ergonomie kostet und die Garantie kauft, dass die Dokumentation die Dokumentation ist, egal wo man sie geöffnet hat.

## Was ich anders machen würde

Ich hätte das Exportformat vor der dritten Kategorie entworfen, nicht nach der sechsten. Ein Teil des Werts einer Pflegedokumentation liegt darin, sie einer Ärztin, einer Versicherung oder einem Gericht übergeben zu können, und eine stabile externe Repräsentation nachträglich auf eine bereits einmal migrierte Taxonomie zu setzen ist deutlich schwerer, als sie vorab zu definieren.
