---
name: IRINA
description: A fashion-monthly issue for one Valencia colourist. Cobalt cover stock, gloss-white pages, Didone masthead, reply-card booking.
colors:
  cobalt: "#1b3a9a"
  cobalt-deep: "#132c78"
  paper: "#f6f6f3"
  white: "#ffffff"
  ink: "#121216"
  ink-soft: "#4f4f58"
  ink-faint: "#8b8b94"
  night: "#0f1013"
typography:
  masthead:
    fontFamily: "Bodoni Moda, Prata, Didot, serif"
    fontSize: "fit to container width (JS)"
    fontWeight: 400
    lineHeight: 0.78
    letterSpacing: "-0.012em"
  display:
    fontFamily: "Bodoni Moda, Prata, Didot, serif"
    fontSize: "clamp(2.5rem, 5.2vw, 5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  pull-quote:
    fontFamily: "Bodoni Moda, Prata, Didot, serif"
    fontSize: "clamp(1.9rem, 4.6vw, 4.4rem)"
    fontWeight: 400
    lineHeight: 1.08
  body:
    fontFamily: "Jost, Futura, Avenir Next, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Jost, Futura, Avenir Next, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.16em"
rounded:
  none: "0"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, 4vw, 3rem)"
  section: "clamp(5rem, 11vw, 10rem)"
  max: "88rem"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1.4rem"
  button-primary-hover:
    backgroundColor: "{colors.cobalt-deep}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
  chip:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.85rem"
  chip-selected:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.white}"
---

# Design System: IRINA

## Overview

The site is one issue of a fashion monthly named after the stylist. The cover is cobalt stock with a full-width Didone masthead cut by a portrait. Inside are gloss-white pages: editor's letter, shade index, before/after diptychs, pull quote, service menu, letters (reviews) and colophon. Booking is the magazine's bind-in reply card with a perforated stub. The photography stays warm and untouched. Cobalt is the complement of golden and honey hair, so the work glows against it.

## Colors

### Primary
- **Cobalt** `#1b3a9a`: the committed colour. It owns whole fields (cover, pull-quote spread, booking), primary actions, selected states, the drop cap and the signature. It never appears as a thin accent sprinkled on neutral pages.

### Neutral
- **Paper** `#f6f6f3` and **White** `#ffffff` alternate between spreads.
- **Ink** `#121216` is used for text and secondary actions. **Ink soft** `#4f4f58` is used for body and secondary text.
- **Ink faint** `#8b8b94` is used only for large inactive display text (shade names at 1.5rem and up).
- **Night** `#0f1013` is used for the "beyond the salon" spread and the colophon.

### Named Rules
- **One chroma.** Cobalt is the only hue. Photos carry all other colour.
- **No beige, no brass.** The premium-consumer cream, brass and espresso palette is excluded on purpose.

## Typography

- **Bodoni Moda** (variable, optical size auto) is the voice of everything editorial: masthead, headings, shade names, pull quotes, reviews and figures.
- **Prata** supplies the Cyrillic. It has no italic, so `font-synthesis: none` applies, and in RU emphasis switches to an underline.
- **Jost** (geometric, Futura lineage) carries body copy, controls and small uppercase labels.

### Hierarchy
masthead (fit to width) > display h2 (2.5–5rem) > pull quote (1.9–4.4rem) > h3 italic (1.7–2.4rem) > body (1.0625rem) > label (0.72–0.8rem, uppercase, tracked 0.12–0.24em).

### Named Rules
- **Italic is state.** In the shade index the active name turns italic and cobalt.
- **No kickers.** No label ever sits above a heading. Section identity comes from the heading itself.

## Layout
- A 12-column grid inside `.wrap` (max 88rem, fluid gutter). Sections alternate ground colour and composition family: split portrait and letter, list with sticky plate, horizontal diptych track, full-bleed quote, sticky head with menu list, masonry columns, sticky video with timeline, and the card.
- Mobile collapses to one column. The cover masthead splits into two fitted lines, cover lines overlay the portrait, the shade plate becomes sticky above the list, and a fixed "Book" bar appears once the tip-on card has scrolled away.

## Elevation & Depth
Flat by default. Only paper objects lift: the tip-on card and the reply card, with neutral offset shadows (`0 24px 40px -20px rgba(0,0,0,.45)`).

## Shapes
Square corners for buttons, photos and cards. Pills only for selectable chips, filters and the round carousel buttons.

## Components
### Buttons
Square, uppercase Jost label tracked 0.16em, minimum height 2.9rem, `scale(.97)` on press. Variants: cobalt (primary), ink, line.
### Chips
Pill with a 1px border; they fill cobalt on hover or when selected. Used for cover service chips, booking services and filters (filters fill with ink).
### Inputs / Fields
Underline-only text inputs with a cobalt focus underline and caret. Legends are uppercase Jost labels.
### Navigation
Fixed and transparent over the cover. It becomes solid paper with a blur once the cover has passed, and the small Didone logo fades in. On mobile, a "Menu" button opens a full-screen cobalt contents page.
### Reply Card (signature)
A white card with a paper stub separated by a dashed perforation, with cobalt notches top and bottom. Day chips are square tiles with a large Didone numeral. On send, the stub briefly "tears" (rotation plus shadow, 0.9s), then WhatsApp opens.

## Do's and Don'ts
### Do:
- Show real work at full quality, with shade names exactly as Irina captions them.
- Keep every price in `site/js/config.js`. Show "Precio tras consulta" until a price is filled in.
### Don't:
- Use em or en dashes in copy.
- Use stock imagery, or photos carrying third-party brand logos (for example a Booksy T-shirt).
- Place a drag slider over before/after pairs that are not aligned shots.
