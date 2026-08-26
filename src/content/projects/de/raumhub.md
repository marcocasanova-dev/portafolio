---
title: RaumHub
description: Ein Marktplatz für vermietbaren Lagerraum in Deutschland, Kartensuche, ein Einstell-Assistent und Stripe-Abos, die in Supabase Edge Functions abgewickelt werden statt auf dem Telefon.
order: 1.7
featured: false
year: 2025
role: Gründer & Principal Engineer
client: Stratos One
technologies:
  - Expo
  - React Native
  - TypeScript
  - Supabase
  - Deno
  - Stripe
  - PostgreSQL
  - Next.js
sectors:
  - Commerce & Mobile
  - Eigene Produkte
logo: /logos/raumhub.png
highlights:
  - value: v1.2.1
    label: Für Android veröffentlicht
    consequence: Ein Produktions-AAB, über EAS gebaut und im Play Store eingereicht, kein interner Build.
  - value: 'Serverseitig'
    label: Zahlungshoheit
    consequence: Checkout und Kündigung laufen in Edge Functions, der Mobile-Client hält nie ein Stripe-Secret.
  - value: 'Null'
    label: Kamera-Berechtigungen
    consequence: Anzeigenfotos kommen aus dem Dateiauswahldialog, die App fragt also nie nach einer Berechtigung, die sie nicht begründen kann.
outcome: Einen zweiseitigen Lagerraum-Marktplatz in den Play Store gebracht, auf dem Anbieter Raum über einen Assistenten einstellen und Mieter per Stripe-Abo zahlen, mit serverseitiger Zahlungshoheit und einem Android-Berechtigungssatz, der auf das reduziert ist, was das Produkt wirklich nutzt.
tradeoff: Checkout und Kündigung in Supabase Edge Functions verlagert, statt Stripe aus der App aufzurufen, ein zusätzlicher Netzwerk-Hop und eine Deno-Laufzeit zur Pflege gegen die Gewissheit, nie ein Zahlungs-Secret in einer Binary auszuliefern, die Nutzer entpacken können.
status: Veröffentlicht
engagement:
  duration: 'Seit September 2025'
  teamSize: Alleiniger Gründer
  scope: Marktplatz-Schema, Stripe-Integration, Expo-App, Kartensuche, EAS-Release-Pipeline und Play-Store-Compliance
  relationship: independent
decisionQuote:
  text: 'Eine Berechtigung, die man einem Prüfer nicht in einem Satz begründen kann, sollte man nicht anfordern, sie zu entfernen war billiger, als sie zu verteidigen.'
github: null
liveDemo: null
video: null
draft: true
---

## Das Produkt

RaumHub ist ein Marktplatz für Lagerraum. Auf der einen Seite stellen Menschen einen ungenutzten Keller, eine Garage oder ein freies Zimmer ein; auf der anderen finden Menschen mit Platzbedarf etwas in ihrer Nähe und mieten es monatsweise. Es läuft in deutschen Städten, weshalb der Adressfluss eine feste Städteliste statt Freitext nutzt, ein Marktplatz, in dem die Hälfte der Anzeigen „München" sagt und die andere „Munich", lässt sich nicht durchsuchen.

Die App hat zwei Hälften. **Explore** ist Stöbern, Filtern, Suchen und eine Kartenansicht. **My Hubs** ist Anzeigenverwaltung und ein Assistent zum Anlegen neuer Räume. Die Anmeldung läuft über Supabase, mit optionalem „Gerät merken", damit ein Anbieter, der eine Buchung prüft, sich nicht jedes Mal neu authentifizieren muss.

## Wo das Geld abgerechnet wird

Die Entscheidung, die die Architektur geprägt hat: Die mobile App hat keine Zahlungshoheit.

Checkout und Kündigung sind zwei Supabase Edge Functions auf Deno, `create-hub-checkout`, die eine Hub-ID und eine Monatszahl entgegennimmt und eine Stripe-Checkout-Session zurückgibt, und `cancel-subscription`. Beide prüfen das Bearer-Token des Aufrufers über einen Client mit Anon-Key, bevor sie irgendetwas mit dem Service-Role-Client tun, und beide versehen jede Anfrage mit einer erzeugten `requestId`, die in die Logs fließt und im Antwortkörper zurückkommt.

Die Alternative wäre gewesen, Stripe mit einem Publishable Key direkt aus der App aufzurufen und den Client die Sessions bauen zu lassen. Weniger bewegliche Teile, eine Laufzeit weniger. Ich habe das verworfen, weil eine mobile Binary keine vertrauenswürdige Umgebung ist: Jeder kann ein APK entpacken, und der Mietpreis eines Lagerraums ist genau die Art Wert, die nicht dort zusammengesetzt werden sollte, wo Nutzer hinkommen. Der zusätzliche Hop kostet Latenz auf einem Screen. Ein Fehler dort kostet Geld, das wirklich weg ist.

Den Anon-Client vom Service-Role-Client innerhalb der Function zu trennen, zählt aus demselben Grund. Der Anon-Client stellt fest, *wer fragt*; der Service-Role-Client erledigt die privilegierte Arbeit. Beide zu einem Admin-Client zusammenzuziehen hätte die Function vereinfacht, und jeden Bug darin in einen Privilege-Escalation-Bug verwandelt.

## Die Berechtigung, die ich entfernt habe

RaumHub nutzte ursprünglich `expo-image-picker`, damit Anbieter einen Raum direkt beim Anlegen der Anzeige fotografieren konnten. Das ist die naheliegende Umsetzung, und sie braucht die Android-Berechtigung `CAMERA`.

Google Play prüft sensible Berechtigungen genau, und die App erhebt bereits Standortdaten, was für sich genommen eine öffentlich gehostete Datenschutzerklärung verlangt. Vor einer Prüfung, die beides hinterfragen würde, habe ich mir angesehen, was die Kamera tatsächlich einbringt: Anbieter fotografieren einen Raum ganz überwiegend zuerst und stellen ihn später ein. Die Kamera im Flow bediente also einen Minderheitsfall zum Preis der alarmierendsten Berechtigungsabfrage der App.

Eine Berechtigung, die man einem Prüfer nicht in einem Satz begründen kann, sollte man nicht anfordern, sie zu entfernen war billiger, als sie zu verteidigen.

Der Assistent nutzt jetzt `expo-document-picker`, der ohne jede Kamerafreigabe aus der Fotobibliothek liest. Das Manifest fordert groben und feinen Standort sowie externen Speicher an, sonst nichts. Die Datenschutzerklärung wird über GitHub Pages veröffentlicht, damit die Play Console eine stabile öffentliche URL hat. Der Preis ist ein etwas längerer Weg für Anbieter, die vor Ort fotografieren wollen; der Gewinn ist eine Installationsabfrage, die Fremde nicht nach Kamerazugriff fragt, bevor sie überhaupt etwas eingestellt haben.

## Release-Engineering

Der Android-Build läuft über EAS mit zwei Profilen: `preview` erzeugt ein seitlich installierbares APK für interne Tests, `production` das AAB für Play. Version 1.2.1 ist das aktuelle Release.

Die App lebt im pnpm-Workspace von Stratos One, das Metro nicht von Haus aus versteht, der Bundler von React Native will ein gehoistetes `node_modules`, pnpm gibt ihm Symlinks. Eine `metro.config.js` erweitert `@expo/metro-config` um explizite `watchFolders` und Resolver-Overrides, und sie muss auch während der EAS-Builds funktionieren, nicht nur lokal, weil der Bundle-Schritt dort ebenfalls läuft.

Ein Teil dieser Pipeline ist ein `migrate-picture-keys`-Skript. Anzeigenbilder liegen unter einem Schlüssel im Storage, und als sich dieses Schlüsselschema änderte, mussten die bestehenden Anzeigen umziehen, ohne dass Anbieter neu hochladen. Das ist unglamourös, und es ist der Unterschied, ob eine Schemaänderung ein Deploy ist oder eine Entschuldigung.

## Was ich anders machen würde

Ich hätte den Stripe-Webhook-Handler gleichzeitig mit der Checkout-Function geschrieben. Eine Session zu erzeugen ist die einfache Hälfte; abzugleichen, was Stripe *glaubt*, dass passiert ist, mit dem, was die Datenbank festgehalten hat, ist der Punkt, an dem eine Zahlungsintegration tatsächlich Vertrauen verdient, und beide Hälften in einem Zug zu bauen ist deutlich leichter, als die Lücke später zu rekonstruieren.
