---
title: RaumHub
description: A marketplace for rentable storage space in Germany, map discovery, a listing wizard, and Stripe subscriptions settled in Supabase Edge Functions rather than on the phone.
order: 1.7
featured: false
year: 2025
role: Founder & Principal Engineer
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
  - Marketplace
  - Mobile
  - E-commerce
logo: /logos/raumhub.png
highlights:
  - value: v1.2.1
    label: Released to Android
    consequence: A production AAB built through EAS and submitted to the Play Store, not an internal build.
  - value: 'Server-side'
    label: Payment authority
    consequence: Checkout and cancellation run in Edge Functions, so the mobile client never holds a Stripe secret.
  - value: 'Zero'
    label: Camera permissions
    consequence: Listing photos come from the document picker, so the app never asks for a permission it cannot justify.
outcome: Shipped a two-sided storage marketplace to the Play Store where hosts list space through a wizard and renters pay by Stripe subscription, with payment authority kept server-side and the Android permission set cut to only what the product actually uses.
tradeoff: Moved checkout and cancellation into Supabase Edge Functions instead of calling Stripe from the app, accepting an extra network hop and a Deno runtime to maintain in exchange for never shipping a payment secret inside a binary users can unpack.
status: Released
engagement:
  duration: 'Since September 2025'
  teamSize: Solo founder
  scope: Marketplace schema, Stripe integration, Expo app, map discovery, EAS release pipeline, and Play Store compliance
decisionQuote:
  text: 'A permission you cannot justify in one sentence to a reviewer is a permission you should not be requesting, and removing it was cheaper than defending it.'
github: null
liveDemo: null
video: null
draft: false
---

## The product

RaumHub is a marketplace for storage space. On one side, people with an unused cellar, garage, or spare room list it; on the other, people who need space find it near them and rent it by the month. It runs in German cities, which is why the address flow uses a fixed city list rather than free-text entry, a marketplace where half the listings say "München" and half say "Munich" cannot be searched.

The app has two halves. **Explore** is browse, filter, search, and a map view. **My Hubs** is listing management and a creation wizard for new spaces. Sign-in runs through Supabase, with an optional "remember this device" so hosts checking on a booking are not re-authenticating every time.

## Where the money is settled

The decision that shaped the architecture is that the mobile app has no payment authority.

Checkout and cancellation are two Supabase Edge Functions running on Deno, `create-hub-checkout`, which takes a hub id and a month count and returns a Stripe Checkout session, and `cancel-subscription`. Both verify the caller's bearer token through an anon-key client before doing anything with the service-role client, and both stamp every request with a generated `requestId` that flows into the logs and back out in the response body.

The alternative was to call Stripe from the app with a publishable key and let the client construct sessions. It is fewer moving parts and one less runtime to maintain. I rejected it because a mobile binary is not a trusted environment: anyone can unpack an APK, and the price of a hub rental is exactly the kind of value that should not be assembled anywhere the user can reach. The extra hop costs latency on one screen. Getting it wrong costs money that is genuinely gone.

Splitting the anon client from the service-role client inside the function matters for the same reason. The anon client establishes *who is asking*; the service-role client does the privileged work. Collapsing them into one admin client would have made the function simpler and turned every bug in it into a privilege-escalation bug.

## The permission I removed

RaumHub originally used `expo-image-picker` so hosts could photograph a space directly while creating a listing. That is the obvious implementation, and it requires the Android `CAMERA` permission.

Google Play scrutinises sensitive permissions, and the app already collects location, which independently requires a publicly hosted privacy policy. Facing a review that would question both, I looked at what the camera actually bought: hosts overwhelmingly photograph a space first and list it later, so the in-flow camera was serving a minority path at the cost of the app's most alarming permission prompt.

A permission you cannot justify in one sentence to a reviewer is a permission you should not be requesting, and removing it was cheaper than defending it.

The wizard now uses `expo-document-picker`, which reads from the photo library without any camera grant. The manifest requests coarse and fine location plus external storage, and nothing else. The privacy policy is published through GitHub Pages so the Play Console has a stable public URL to point at. The cost is a slightly longer path for a host who wants to shoot photos on the spot; the benefit is an install prompt that does not ask a stranger for camera access before they have listed anything.

## Release engineering

The Android build runs through EAS with two profiles: `preview` produces a sideloadable APK for internal testing, `production` produces the AAB that goes to Play. Version 1.2.1 is the current release.

The app lives inside the Stratos One pnpm workspace, which Metro does not natively understand, React Native's bundler wants a hoisted `node_modules` and pnpm gives it symlinks. A `metro.config.js` extends `@expo/metro-config` with explicit `watchFolders` and resolver overrides, and it has to keep working during EAS builds, not just locally, because the bundle step runs there too.

One piece of that pipeline is a `migrate-picture-keys` script. Listing images are keyed in storage, and when that keying scheme changed, the existing listings needed to move without hosts re-uploading. It is unglamorous, and it is the difference between a schema change being a deploy and being an apology.

## What I would do differently

I would have written the Stripe webhook handler at the same time as the checkout function. Creating a session is the easy half; reconciling what Stripe *believes* happened with what the database recorded is where a payments integration actually earns trust, and building the two halves in one pass is much easier than reconstructing the gap later.
