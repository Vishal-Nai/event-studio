import { BrandingConfig, DEFAULT_BRANDING, Frame, FrameStyleId, PhotoArea } from "@/types";
export type { AspectRatio } from "@/types";

const S = 1080;

/**
 * Photo-area coordinates (1080×1080 space, null = no photo slot).
 * Each frame type has a unique layout — the transparent hole where the
 * user's uploaded photo shows through the SVG overlay.
 */
const PHOTO_AREAS: Record<FrameStyleId, PhotoArea | null> = {
  "minimal-bottom": { x: 282, y: 226, width: 516, height: 612 }, // portrait slot center
  "bold-brand":     { x: 0,   y: 0,   width: 1080, height: 1080 }, // full-bleed
  "corner-badge":   null,                                            // no photo
  "gradient-fade":  { x: 400, y: 0,   width: 680,  height: 1080 }, // right 63% panel
  "classic-border": { x: 0,   y: 0,   width: 1080, height: 680  }, // top 63% panel
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function enc(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function x(v: string | undefined, fallback = ""): string {
  return (v ?? fallback)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function tags(config: BrandingConfig): string[] {
  const raw = config.hashtags ?? "#CursorAI, #DevCommunity, #Techmeetup, #buildinpublic, #aicoding";
  return raw.split(",").map(t => t.trim()).filter(Boolean)
    .map(t => t.startsWith("#") ? t : `#${t}`).slice(0, 8);
}

// ─── Official Cursor 3D hexagon icon (inline SVG, no external asset) ─────────
// Faithful recreation of the Cursor isometric cube mark from the brand sheet.
// Three visible faces: top (bright), right (medium), left (dark) + white arrow.

function hexIcon(cx: number, cy: number, size: number): string {
  const s = size / 40;
  const p = (px: number, py: number) =>
    `${(cx + (px - 20) * s).toFixed(1)},${(cy + (py - 20) * s).toFixed(1)}`;
  return `<g>
    <polygon points="${p(20,3)} ${p(37,12)} ${p(20,21)} ${p(3,12)}" fill="rgba(255,255,255,0.90)"/>
    <polygon points="${p(37,12)} ${p(37,29)} ${p(20,38)} ${p(20,21)}" fill="rgba(255,255,255,0.42)"/>
    <polygon points="${p(3,12)} ${p(20,21)} ${p(20,38)} ${p(3,29)}" fill="rgba(255,255,255,0.18)"/>
    <polygon points="${p(13,16)} ${p(28,7)} ${p(22,22)}" fill="white"/>
  </g>`;
}

/**
 * Cursor icon + "CURSOR" text horizontally (centered at cx, cy).
 * Uses dominant-baseline="central" so the text cap-height is perfectly
 * vertically centered with the icon's visual midpoint.
 */
function cursorLockup(cx: number, cy: number, iconSize: number, textSize: number): string {
  const totalW = iconSize + 10 + textSize * 3.72;
  const ix = cx - totalW / 2 + iconSize / 2;
  const tx = cx - totalW / 2 + iconSize + 10;
  return `${hexIcon(ix, cy, iconSize)}
  <text x="${tx.toFixed(1)}" y="${cy.toFixed(1)}"
    dominant-baseline="central"
    font-family="'Geist','Inter',-apple-system,BlinkMacSystemFont,sans-serif"
    font-size="${textSize}" font-weight="700" letter-spacing="2" fill="white">CURSOR</text>`;
}

/** Dark panels around the transparent photo slot. */
function panelBg(area: PhotoArea | null, fill: string): string {
  if (!area) return `<rect x="0" y="0" width="${S}" height="${S}" fill="${fill}"/>`;
  const { x: ax, y: ay, width: aw, height: ah } = area;
  return `<rect x="0"        y="0"        width="${S}"         height="${ay}"         fill="${fill}"/>
  <rect x="0"        y="${ay}"     width="${ax}"         height="${ah}"         fill="${fill}"/>
  <rect x="${ax+aw}" y="${ay}"     width="${S-ax-aw}"    height="${ah}"         fill="${fill}"/>
  <rect x="0"        y="${ay+ah}"  width="${S}"           height="${S-ay-ah}"    fill="${fill}"/>`;
}

function bgColor(b: BrandingConfig): string {
  return b.accentColor || "#070809";
}

function secondaryColor(b: BrandingConfig): string {
  return b.secondaryColor || "#1e1e2e";
}

/** Faint city skyline silhouette for atmosphere. */
function cityLines(opacity = 0.11): string {
  return `<g opacity="${opacity}" fill="none" stroke="white" stroke-width="1.5">
    <path d="M0,900 L0,840 L55,840 L55,800 L90,800 L90,775 L120,775 L120,800 L155,800 L155,820 L185,820 L185,780 L215,780 L215,840 L250,840 L250,900"/>
    <path d="M830,900 L830,815 L870,815 L870,765 L895,765 L895,730 L925,730 L925,770 L960,770 L960,800 L995,800 L995,810 L1080,810 L1080,900"/>
    <path d="M0,280 L0,180 L70,100 M1080,120 L980,60 M1060,160 L985,110"/>
    <path d="M55,820 L55,800 M90,775 L90,760 M895,730 L895,710 M925,730 L925,700"/>
  </g>`;
}

function gridPattern(opacity = 0.08): string {
  const lines = Array.from({ length: 13 }, (_, i) => {
    const p = i * 90;
    return `<line x1="${p}" y1="0" x2="${p}" y2="${S}"/><line x1="0" y1="${p}" x2="${S}" y2="${p}"/>`;
  }).join("");
  return `<g opacity="${opacity}" stroke="white" stroke-width="0.5" fill="none">${lines}</g>`;
}

function codePattern(opacity = 0.07): string {
  const snippets = [
    "function build() {",
    "  return agent.run();",
    "}",
    "// cursor.com",
    "export default App;",
    "const res = await fetch();",
    "import { use } from 'react';",
  ];
  const left = snippets
    .map((line, i) => `<text x="36" y="${100 + i * 34}" font-family="monospace" font-size="13">${x(line)}</text>`)
    .join("");
  const right = snippets
    .map((line, i) => `<text x="640" y="${180 + i * 34}" font-family="monospace" font-size="13">${x(line)}</text>`)
    .join("");
  return `<g opacity="${opacity}" fill="white">${left}${right}</g>`;
}

function backgroundDetail(b: BrandingConfig, opacity = 0.11): string {
  const style = b.backgroundStyle ?? "city";
  switch (style) {
    case "grid":
      return gridPattern(opacity * 0.9);
    case "code":
      return codePattern(opacity * 0.85);
    case "minimal":
      return "";
  }
  return cityLines(opacity);
}

/** Hashtag pill chips, auto-wrapping into rows. */
function chipRows(tagList: string[], topY: number, maxW = 820): string {
  const rows: string[][] = [[]];
  const ws: number[][] = [[]];
  for (const tag of tagList) {
    const w = tag.length * 11.2 + 28;
    const ri = rows.length - 1;
    const used = ws[ri].reduce((s, v) => s + v + 10, -10);
    if (used + 10 + w > maxW && rows[ri].length > 0) {
      rows.push([tag]); ws.push([w]);
    } else {
      rows[ri].push(tag); ws[ri].push(w);
    }
  }
  return rows.map((row, ri) => {
    const rowW = ws[ri].reduce((s, v) => s + v + 10, -10);
    let px = (S - rowW) / 2;
    const py = topY + ri * 42;
    return row.map((tag, ti) => {
      const w = ws[ri][ti];
      const out = `<rect x="${px.toFixed(1)}" y="${py}" width="${w.toFixed(1)}" height="30" rx="6"
        fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.13)" stroke-width="1"/>
      <text x="${(px + w / 2).toFixed(1)}" y="${py + 20}" text-anchor="middle"
        font-family="'Geist','Inter',-apple-system,sans-serif"
        font-size="15.5" font-weight="600" fill="rgba(255,255,255,0.88)">${x(tag)}</text>`;
      px += w + 10;
      return out;
    }).join("");
  }).join("");
}

// ═════════════════════════════════════════════════════════════════════════════
// FRAME 1 ── "I'm Attending" Community Poster
// Layout: top panel (logo + event title + status) | portrait photo slot |
//         bottom panel (social icons + hashtag chips + CURSOR footer)
// ═════════════════════════════════════════════════════════════════════════════
function frame1_AttendeePoster(b: BrandingConfig): string {
  const area = PHOTO_AREAS["minimal-bottom"]!;
  const bg = bgColor(b);
  const sec = secondaryColor(b);
  return enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    <radialGradient id="attGlow" cx="50%" cy="0%" r="78%">
      <stop offset="0%" stop-color="${sec}" stop-opacity="0.54"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  ${panelBg(area, bg)}
  <rect x="0" y="0" width="${S}" height="${S}" fill="url(#attGlow)"/>
  ${backgroundDetail(b, 0.055)}
  <rect x="44" y="36" width="${S - 88}" height="130" rx="34"
    fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.09)" stroke-width="1"/>
  ${cursorLockup(144, 82, 38, 25)}
  <rect x="${S - 300}" y="58" width="236" height="48" rx="24"
    fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.14)" stroke-width="1"/>
  <text x="${S - 182}" y="89" text-anchor="middle"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="18" font-weight="700" letter-spacing="2" fill="rgba(255,255,255,0.82)">${x(b.statusText, "I'M ATTENDING").toUpperCase()}</text>
  <text x="${S / 2}" y="154" text-anchor="middle"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="42" font-weight="760" letter-spacing="-1.2" fill="white"
    textLength="820" lengthAdjust="spacingAndGlyphs">${x(b.eventName)}</text>
  <rect x="${area.x - 18}" y="${area.y - 18}" width="${area.width + 36}" height="${area.height + 36}" rx="38"
    fill="none" stroke="rgba(255,255,255,0.20)" stroke-width="2"/>
  <rect x="${area.x - 28}" y="${area.y - 28}" width="${area.width + 56}" height="${area.height + 56}" rx="48"
    fill="none" stroke="${sec}" stroke-opacity="0.36" stroke-width="3"/>
  <text x="${S / 2}" y="${area.y + area.height + 64}" text-anchor="middle"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="25" font-weight="600" fill="rgba(255,255,255,0.74)">${x(b.date)} · ${x(b.location)}</text>
  ${chipRows(tags(b).slice(0, 4), area.y + area.height + 96, 760)}
  <text x="${S / 2}" y="${S - 36}" text-anchor="middle"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="18" font-weight="600" letter-spacing="3" fill="rgba(255,255,255,0.30)">${x(b.website, "cursor.com")}</text>
</svg>`);
}

// ═════════════════════════════════════════════════════════════════════════════
// FRAME 2 ── "Photo Overlay" Announcement
// Layout: photo fills entire canvas; gradient strips top + bottom; logo + date
//         badge top-left; event name / status / tagline / meta at bottom.
// ═════════════════════════════════════════════════════════════════════════════
function frame2_PhotoOverlay(b: BrandingConfig): string {
  return enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    <linearGradient id="photoTop" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.68"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="photoBottom" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="44%" stop-color="#000000" stop-opacity="0.62"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.94"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${S}" height="240" fill="url(#photoTop)"/>
  <rect x="0" y="520" width="${S}" height="560" fill="url(#photoBottom)"/>
  <rect x="44" y="42" width="220" height="58" rx="29" fill="rgba(0,0,0,0.36)" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>
  ${cursorLockup(154, 72, 34, 22)}
  <rect x="${S - 304}" y="42" width="260" height="58" rx="29" fill="rgba(0,0,0,0.36)" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>
  <text x="${S - 174}" y="78" text-anchor="middle"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="21" font-weight="600" fill="rgba(255,255,255,0.76)">${x(b.date)}</text>
  <rect x="52" y="760" width="260" height="46" rx="23" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
  <text x="182" y="790" text-anchor="middle"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="17" font-weight="760" letter-spacing="2" fill="rgba(255,255,255,0.86)">${x(b.statusText, "I'M ATTENDING").toUpperCase()}</text>
  <text x="52" y="874"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="66" font-weight="820" letter-spacing="-2.8" fill="white"
    textLength="920" lengthAdjust="spacingAndGlyphs">${x(b.eventName)}</text>
  <text x="54" y="932"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="25" font-weight="400" fill="rgba(255,255,255,0.68)">${x(b.tagline)}</text>
  <text x="54" y="${S - 48}"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="20" font-weight="500" fill="rgba(255,255,255,0.42)">${x(b.location)} · ${x(b.website)}</text>
</svg>`);
}

// ═════════════════════════════════════════════════════════════════════════════
// FRAME 3 ── "Just Announced" Event Announcement Card
// Layout: no photo slot; bold event announcement with Cursor logo centered at
//         top; "JUST ANNOUNCED" badge; large event name; date/location bar;
//         hashtag chips; website footer. Premium corner bracket decorations.
// ═════════════════════════════════════════════════════════════════════════════
function frame3_JustAnnounced(b: BrandingConfig): string {
  const bg = bgColor(b);
  const sec = secondaryColor(b);
  return enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    <radialGradient id="announceGlow" cx="50%" cy="16%" r="72%">
      <stop offset="0%" stop-color="${sec}" stop-opacity="0.82"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="${S}" height="${S}" fill="${bg}"/>
  <rect x="0" y="0" width="${S}" height="${S}" fill="url(#announceGlow)"/>
  ${backgroundDetail(b, 0.045)}
  <rect x="54" y="54" width="${S - 108}" height="${S - 108}" rx="54"
    fill="rgba(255,255,255,0.028)" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>
  ${cursorLockup(S / 2, 128, 46, 32)}
  <rect x="330" y="214" width="420" height="54" rx="27"
    fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.13)" stroke-width="1"/>
  <text x="${S / 2}" y="249" text-anchor="middle"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="18" font-weight="780" letter-spacing="5" fill="rgba(255,255,255,0.72)">JUST ANNOUNCED</text>
  <text x="${S / 2}" y="422" text-anchor="middle"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="88" font-weight="860" letter-spacing="-4" fill="white"
    textLength="900" lengthAdjust="spacingAndGlyphs">${x(b.eventName)}</text>
  <text x="${S / 2}" y="502" text-anchor="middle"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="27" font-weight="400" fill="rgba(255,255,255,0.58)"
    textLength="780" lengthAdjust="spacingAndGlyphs">${x(b.tagline)}</text>
  <rect x="212" y="584" width="656" height="74" rx="22"
    fill="rgba(255,255,255,0.065)" stroke="rgba(255,255,255,0.13)" stroke-width="1"/>
  <text x="${S / 2}" y="630" text-anchor="middle"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="27" font-weight="640" fill="rgba(255,255,255,0.84)">${x(b.date)} · ${x(b.location)}</text>
  ${chipRows(tags(b).slice(0, 4), 732, 760)}
  <text x="${S / 2}" y="${S - 104}" text-anchor="middle"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="20" font-weight="500" fill="rgba(255,255,255,0.34)">${x(b.website)}</text>
</svg>`);
}

// ═════════════════════════════════════════════════════════════════════════════
// FRAME 4 ── "Speaker Card" Professional Side-Panel Card
// Layout: left 37% = rich branding panel (logo, status, event, date, tags,
//         website); right 63% = transparent photo slot, full height.
//         Gradient vertical divider. Left-edge accent bar. Premium look.
// ═════════════════════════════════════════════════════════════════════════════
function frame4_SpeakerCard(b: BrandingConfig): string {
  const area  = PHOTO_AREAS["gradient-fade"]!;
  const pw    = area.x;           // left panel width = 400
  const ml    = 44;               // left margin inside panel
  const uw    = pw - ml - 34;     // usable text width

  return enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    <linearGradient id="speakerPanel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${secondaryColor(b)}" stop-opacity="0.62"/>
      <stop offset="100%" stop-color="${bgColor(b)}" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="speakerFade" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${bgColor(b)}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${bgColor(b)}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${pw}" height="${S}" fill="url(#speakerPanel)"/>
  <rect x="${pw}" y="0" width="190" height="${S}" fill="url(#speakerFade)"/>
  <rect x="0" y="0" width="6" height="${S}" fill="${secondaryColor(b)}" opacity="0.9"/>
  ${cursorLockup(ml + 74, 82, 38, 25)}
  <rect x="${ml}" y="150" width="${uw}" height="1" fill="rgba(255,255,255,0.10)"/>
  <rect x="${ml}" y="202" width="210" height="46" rx="23"
    fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.13)" stroke-width="1"/>
  <text x="${ml + 105}" y="232" text-anchor="middle"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="17" font-weight="760" letter-spacing="2" fill="rgba(255,255,255,0.80)">${x(b.statusText, "SPEAKER").toUpperCase()}</text>
  <text x="${ml}" y="332"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="42" font-weight="830" letter-spacing="-1.4" fill="white"
    textLength="${uw}" lengthAdjust="spacingAndGlyphs">${x(b.eventName)}</text>
  <text x="${ml}" y="388"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="20" font-weight="400" fill="rgba(255,255,255,0.55)"
    textLength="${uw}" lengthAdjust="spacingAndGlyphs">${x(b.tagline)}</text>
  <rect x="${ml}" y="470" width="${uw}" height="112" rx="24"
    fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.11)" stroke-width="1"/>
  <text x="${ml + 24}" y="520"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="26" font-weight="680" fill="rgba(255,255,255,0.86)">${x(b.date)}</text>
  <text x="${ml + 24}" y="556"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="19" fill="rgba(255,255,255,0.50)">${x(b.location)}</text>
  ${chipRows(tags(b).slice(0, 2), 650, 280)}
  <text x="${ml}" y="${S - 56}"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="18" font-weight="500" fill="rgba(255,255,255,0.34)">${x(b.website)}</text>
  <rect x="${area.x + 18}" y="38" width="${area.width - 58}" height="${S - 76}" rx="38"
    fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
</svg>`);
}

// ═════════════════════════════════════════════════════════════════════════════
// FRAME 5 ── "Event Recap" Post-Event Sharing Card
// Layout: full-width photo in top 63%; gradient transition; dark bottom panel
//         with status text, event name, date/location, hashtag chips, Cursor
//         lockup footer. Perfect for post-event LinkedIn / Twitter sharing.
// ═════════════════════════════════════════════════════════════════════════════
function frame5_EventRecap(b: BrandingConfig): string {
  const area = PHOTO_AREAS["classic-border"]!; // { x:0, y:0, w:1080, h:680 }
  const bg   = bgColor(b);

  return enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    <linearGradient id="recapFade" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${bg}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="0.96"/>
    </linearGradient>
  </defs>
  ${panelBg(area, bg)}
  <rect x="0" y="500" width="${S}" height="200" fill="url(#recapFade)"/>
  <rect x="0" y="${area.height}" width="${S}" height="${S - area.height}" fill="${secondaryColor(b)}" opacity="0.18"/>
  <rect x="52" y="${area.height + 42}" width="${S - 104}" height="290" rx="38"
    fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.09)" stroke-width="1"/>
  <rect x="${S / 2 - 120}" y="${area.height + 76}" width="240" height="44" rx="22"
    fill="rgba(255,255,255,0.085)" stroke="rgba(255,255,255,0.13)" stroke-width="1"/>
  <text x="${S / 2}" y="${area.height + 105}" text-anchor="middle"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="16" font-weight="780" letter-spacing="3" fill="rgba(255,255,255,0.78)">${x(b.statusText, "THANK YOU").toUpperCase()}</text>
  <text x="${S / 2}" y="${area.height + 184}" text-anchor="middle"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="54" font-weight="840" letter-spacing="-2.2" fill="white"
    textLength="860" lengthAdjust="spacingAndGlyphs">${x(b.eventName)}</text>
  <text x="${S / 2}" y="${area.height + 238}" text-anchor="middle"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="24" font-weight="520" fill="rgba(255,255,255,0.58)">${x(b.date)} · ${x(b.location)}</text>
  ${chipRows(tags(b).slice(0, 4), area.height + 272, 760)}
  ${cursorLockup(S / 2, S - 42, 28, 20)}
  <text x="${S - 56}" y="${S - 36}" text-anchor="end"
    font-family="'Geist','Inter',-apple-system,sans-serif"
    font-size="17" font-weight="500" fill="rgba(255,255,255,0.28)">${x(b.website)}</text>
</svg>`);
}

// ─── Public API ───────────────────────────────────────────────────────────────

type FrameGenerator = (b: BrandingConfig) => string;

const GENERATORS: Record<FrameStyleId, FrameGenerator> = {
  "minimal-bottom": frame1_AttendeePoster,
  "bold-brand":     frame2_PhotoOverlay,
  "corner-badge":   frame3_JustAnnounced,
  "gradient-fade":  frame4_SpeakerCard,
  "classic-border": frame5_EventRecap,
};

export function getFramePhotoArea(styleId: FrameStyleId): PhotoArea | null {
  return PHOTO_AREAS[styleId];
}

export function generateFrameImage(
  styleId: FrameStyleId,
  branding: BrandingConfig
): string {
  return GENERATORS[styleId](branding);
}

export function buildPresetFrames(
  branding: BrandingConfig = DEFAULT_BRANDING
): Frame[] {
  return [
    {
      id: "preset-minimal-bottom",
      name: "Attendee Portrait",
      event: branding.eventName,
      imageUrl: frame1_AttendeePoster(branding),
      category: "preset",
      aspectRatio: "1:1",
      createdAt: "2026-01-01T00:00:00.000Z",
      description: "Clean portrait style for attendee photos and community posts.",
      tags: ["attending", "portrait", "community"],
      color: "#ffffff",
      styleId: "minimal-bottom",
      photoArea: PHOTO_AREAS["minimal-bottom"],
    },
    {
      id: "preset-bold-brand",
      name: "Hero Photo",
      event: branding.eventName,
      imageUrl: frame2_PhotoOverlay(branding),
      category: "preset",
      aspectRatio: "1:1",
      createdAt: "2026-01-01T00:00:00.000Z",
      description: "Full-photo social post with premium gradient text overlay.",
      tags: ["hero", "photo", "social"],
      color: "#ffffff",
      styleId: "bold-brand",
      photoArea: PHOTO_AREAS["bold-brand"],
    },
    {
      id: "preset-corner-badge",
      name: "Announcement",
      event: branding.eventName,
      imageUrl: frame3_JustAnnounced(branding),
      category: "preset",
      aspectRatio: "1:1",
      createdAt: "2026-01-01T00:00:00.000Z",
      description: "Professional no-photo event announcement card.",
      tags: ["announcement", "launch", "organizer"],
      color: "#ffffff",
      styleId: "corner-badge",
      photoArea: null,
    },
    {
      id: "preset-gradient-fade",
      name: "Speaker Spotlight",
      event: branding.eventName,
      imageUrl: frame4_SpeakerCard(branding),
      category: "preset",
      aspectRatio: "1:1",
      createdAt: "2026-01-01T00:00:00.000Z",
      description: "Editorial side-panel style for speakers and featured guests.",
      tags: ["speaker", "spotlight", "professional"],
      color: "#ffffff",
      styleId: "gradient-fade",
      photoArea: PHOTO_AREAS["gradient-fade"],
    },
    {
      id: "preset-classic-border",
      name: "Event Recap",
      event: branding.eventName,
      imageUrl: frame5_EventRecap(branding),
      category: "preset",
      aspectRatio: "1:1",
      createdAt: "2026-01-01T00:00:00.000Z",
      description: "Polished post-event style with large photo and clean recap panel.",
      tags: ["recap", "thankyou", "post-event"],
      color: "#ffffff",
      styleId: "classic-border",
      photoArea: PHOTO_AREAS["classic-border"],
    },
  ];
}

export const FRAME_COLORS = [
  "#09090c", "#1a1a24", "#1e1e2e",
  "#2a1f44", "#4d9ef6", "#a78bfa",
  "#2563eb", "#7c3aed", "#059669", "#e11d48",
];
