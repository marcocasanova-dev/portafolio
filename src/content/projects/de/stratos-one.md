---
title: Stratos One
description: Ein Produktstudio als ein einziges Monorepo, gemeinsame Auth, Konfiguration, UI und Utilities unter sechs Apps, damit ein neues Produkt mit einem funktionierenden Login startet statt mit einem leeren Ordner.
order: 0.5
featured: false
year: 2025
role: Gründer & Principal Engineer
client: Stratos One
technologies:
  - Turborepo
  - pnpm
  - Expo
  - React Native
  - Next.js
  - TypeScript
  - Supabase
  - Flutter
sectors:
  - Plattform
  - Mobile
  - SaaS
logo: /logos/stratos-one.svg
highlights:
  - value: '4'
    label: Gemeinsame Pakete
    consequence: Auth, Konfiguration, Design-System und Utilities werden einmal geschrieben und von jeder App genutzt.
  - value: '2'
    label: Ausgelieferte Produkte
    consequence: Kin Relay und RaumHub erreichten versionierte Releases auf derselben Grundlage.
  - value: 1 Login
    label: App-übergreifend wiederverwendet
    consequence: Ein neues Produkt erbt einen funktionierenden Anmeldebildschirm, statt Session-Handling neu zu bauen.
outcome: Aus sechs getrennten App-Ideen wurde eine Codebasis, in der Authentifizierung, Theming und Konfiguration einmal gelöst sind, das zweite Produkt ging live, ohne das Fundament des ersten neu zu schreiben.
tradeoff: Ich habe ein pnpm-Workspace mit eigenem Metro-Resolver gewählt statt unabhängiger Repositories pro App und dafür eine schwierigere Mobile-Bundler-Konfiguration in Kauf genommen, um einen einzigen Upgrade-Pfad über alle Apps zu bekommen.
status: Aktive Entwicklung
engagement:
  duration: 'Seit September 2025'
  teamSize: Alleiniger Gründer
  scope: Monorepo-Architektur, gemeinsame Pakete, Supabase-Backends, Release-Engineering und Store-Einreichung
decisionQuote:
  text: 'Das Teure am zweiten Produkt ist nie die Idee; es ist die Entdeckung, dass das erste seinen Login, sein Theming und seine Konfiguration in sich selbst versteckt hat.'
github: null
liveDemo: null
video: null
draft: false
---

## Warum ein Studio und keine App

Stratos One entstand aus einem Muster, auf das ich immer wieder stieß. Jede neue Produktidee verbrachte ihre ersten zwei Wochen mit derselben Arbeit: Authentifizierung verkabeln, entscheiden, wo die Konfiguration lebt, ein Design-System bauen, das mehr als drei Screens überlebt, und eine Release-Pipeline aufsetzen, die tatsächlich einen Store erreicht.

Nichts davon ist das Produkt. Alles davon ist nötig, bevor das Produkt existieren kann.

Das Teure am zweiten Produkt ist nie die Idee; es ist die Entdeckung, dass das erste seinen Login, sein Theming und seine Konfiguration in sich selbst versteckt hat. Stratos One ist deshalb andersherum aufgebaut: Das gemeinsame Fundament ist das eigentliche Artefakt, und jede App ist eine dünne Marken- und Domänenschicht darüber.

## Was tatsächlich geteilt wird

Vier Pakete tragen die Last, und jede App bindet sie per Workspace-Referenz ein statt per Kopie:

- **`core-auth`**, Supabase-Session-Handling plus eine `LoginScreen`-Komponente, die Markenfarben, Logos und Callbacks als Props entgegennimmt. Kin Relay sperrt sein gesamtes Dashboard dahinter; RaumHub nutzt dieselbe Komponente mit anderer Palette.
- **`core-ui`**, das Design-System, mit einer Theme-Datei pro Marke. `kinRelayTheme` ist eine dunkle Fläche in Indigo und Cyan, `raumHubTheme` eine helle in Grün. Die Komponenten wissen nicht, welche Marke sie gerade rendern.
- **`core-config`**, wo Umgebungs- und Flavour-Konfiguration aufgelöst wird, damit keine App zur Laufzeit Zugangsdaten aus einer mitgelieferten Datei liest.
- **`core-utils`**, die Helfer für Formatierung, Validierung und Result-Handling, die sonst pro App neu erfunden werden.

Sechs Apps sitzen darauf: Kin Relay, RaumHub, DreamNest, GreenWG, Stratos Search und TidyUp, jede mit einer Expo-Mobile-App und einem Next.js-Web-Gegenstück. Zwei davon, Kin Relay und RaumHub, haben versionierte Releases erreicht. Der Rest ist auf demselben Fundament gerüstet, und genau das ist der Punkt: Das Gerüst ist bereits eine funktionierende App-Hülle.

## Die Rahmenbedingung, die den Build geprägt hat

Nativen Code über ein pnpm-Workspace zu teilen, ist nicht umsonst. Metro, der Bundler von React Native, erwartet ein flaches, gehoistetes `node_modules`; pnpm gibt ihm bewusst einen Store aus Symlinks.

Die ehrlichen Optionen waren: pnpm aufgeben, die gemeinsamen Pakete in jede App kopieren, oder Metro beibringen, ein Workspace aufzulösen. Ich habe die dritte genommen. Jede Mobile-App trägt eine `metro.config.js`, die `@expo/metro-config` um explizite `watchFolders` und Resolver-Overrides erweitert, und die Root-`package.json` pinnt `react`, `react-dom` und `react-native` über `overrides`, damit keine App still auf eine andere React-Version abdriftet.

Der Preis ist real: Die Bundler-Konfiguration ist das am wenigsten portable Wissen im Repo und muss jedes Expo-SDK-Upgrade überleben. Dafür bekomme ich, dass ein SDK-Sprung, ein Supabase-Client-Update oder eine Änderung an einem Design-Token einmal passiert und überall ankommt.

## Getrennte Backends mit Absicht

Die Apps teilen Code, aber keine Daten. Kin Relay und RaumHub zeigen auf **unterschiedliche Supabase-Projekte**, und die Konfiguration wird pro App und pro Flavour aufgelöst statt aus einer gemeinsamen Umgebung.

Das war Absicht. Ein Pflegeprodukt, das Gesundheitsbeobachtungen verarbeitet, und ein Lagerraum-Marktplatz, der Zahlungen abwickelt, haben in Bedrohungsmodell, Aufbewahrungspflichten und Zugriffsregeln fast nichts gemeinsam. Eine geteilte Datenbank hätte zwei Produkte gekoppelt, deren einzige echte Verbindung ist, dass ich beide geschrieben habe. Eine Login-*Komponente* zu teilen ist Hebelwirkung; einen Login-*Tenant* zu teilen wäre eine Belastung gewesen.

## Die Flutter-Frage

Es gibt ein zweites Monorepo, einen Flutter-Port von Kin Relay und RaumHub, aufgebaut als einzelnes pub-Workspace mit `melos`, Riverpod-Providern, Konfiguration zur Compile-Zeit über `--dart-define-from-file` und Architecture Decision Records unter `docs/adr/`.

Ich habe ihn gebaut, weil die Expo-Apps die Produktfrage beantwortet, aber eine technische offen gelassen haben: Wie viel am Argument des gemeinsamen Fundaments hängt am Monorepo und wie viel an React Native selbst. Dieselben zwei Produkte auf eine andere Toolchain zu portieren, mit denselben Paketgrenzen, `stratos_core`, `stratos_config`, `stratos_ui`, `stratos_auth`, ist die einzige Antwort darauf, die nicht auf Spekulation beruht.

## Was ich anders machen würde

Ich hätte die Metro-Workspace-Konfiguration vom ersten Tag an als gemeinsames Paket geschrieben, statt jede App eine fast identische Kopie tragen zu lassen. Es ist das einzige Stück im Repo, das die eigene Prämisse verletzt, und dasjenige, das bei einem SDK-Upgrade am ehesten bricht, also genau in dem Moment, in dem man am wenigsten vier leicht unterschiedliche Bundler-Konfigurationen debuggen will.
