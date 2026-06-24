import { BrandingConfig, DEFAULT_BRANDING, Frame, FrameStyleId, PhotoArea } from "@/types";
import { cursorLogoSvg } from "@/lib/cursor-logo-svg";
export type { AspectRatio } from "@/types";

const W = 1920;
const H = 1080;

type EventKind = "hackathon" | "meetup" | "cafe" | "announcement" | "thank-you";
type LayoutKind = "hero" | "wide" | "angled" | "bracket" | "minimal";
type DecorKind = "grid" | "cube" | "waves" | "dots" | "city" | "chat" | "coffee" | "megaphone" | "spark" | "heart" | "minimal";

interface FrameTemplate {
  id: FrameStyleId;
  name: string;
  eventKind: EventKind;
  layout: LayoutKind;
  decor: DecorKind;
  title: string;
  subtitle: string;
  status?: string;
  slot: PhotoArea | null;
  tags: string[];
  description: string;
}

const PHOTO_AREAS: Record<FrameStyleId, PhotoArea | null> = {
  "hackathon-1": { x: 720, y: 255, width: 1050, height: 620 },
  "hackathon-2": { x: 300, y: 335, width: 1450, height: 520 },
  "hackathon-3": { x: 300, y: 335, width: 1440, height: 520 },
  "hackathon-4": { x: 220, y: 335, width: 1480, height: 520 },
  "hackathon-5": { x: 360, y: 320, width: 1360, height: 560 },
  "meetup-1": { x: 100, y: 340, width: 1570, height: 520 },
  "meetup-2": { x: 100, y: 340, width: 1580, height: 500 },
  "meetup-3": { x: 100, y: 340, width: 1510, height: 500 },
  "meetup-4": { x: 100, y: 340, width: 1360, height: 500 },
  "meetup-5": { x: 100, y: 340, width: 1510, height: 500 },
  "cafe-1": { x: 890, y: 115, width: 740, height: 810 },
  "cafe-2": { x: 440, y: 340, width: 1230, height: 480 },
  "cafe-3": { x: 170, y: 340, width: 1430, height: 500 },
  "cafe-4": { x: 100, y: 430, width: 1450, height: 460 },
  "cafe-5": { x: 820, y: 130, width: 790, height: 800 },
  "announcement-1": null,
  "announcement-2": null,
  "announcement-3": null,
  "announcement-4": { x: 100, y: 500, width: 1460, height: 410 },
  "announcement-5": null,
  "thank-you-1": null,
  "thank-you-2": null,
  "thank-you-3": null,
  "thank-you-4": null,
  "thank-you-5": null,
};

const TEMPLATES: FrameTemplate[] = [
  {
    id: "hackathon-1",
    name: "Hackathon Build",
    eventKind: "hackathon",
    layout: "hero",
    decor: "grid",
    title: "HACKATHON",
    subtitle: "Build fast. Ship smarter. With Cursor.",
    status: "I'M BUILDING THE FUTURE AT",
    slot: PHOTO_AREAS["hackathon-1"],
    tags: ["hackathon", "build", "cursor"],
    description: "Bold text-forward hackathon frame with fixed Cursor layout.",
  },
  {
    id: "hackathon-2",
    name: "Hackathon Code",
    eventKind: "hackathon",
    layout: "angled",
    decor: "cube",
    title: "HACKATHON",
    subtitle: "Code. Create. Collaborate.",
    slot: PHOTO_AREAS["hackathon-2"],
    tags: ["hackathon", "code", "team"],
    description: "Hackathon frame with large angled photo area.",
  },
  {
    id: "hackathon-3",
    name: "Hackathon Impact",
    eventKind: "hackathon",
    layout: "angled",
    decor: "dots",
    title: "HACKATHON",
    subtitle: "Turning ideas into impact",
    slot: PHOTO_AREAS["hackathon-3"],
    tags: ["hackathon", "ideas", "impact"],
    description: "Hackathon frame with dotted lower-right energy.",
  },
  {
    id: "hackathon-4",
    name: "Hackathon Ship",
    eventKind: "hackathon",
    layout: "bracket",
    decor: "dots",
    title: "HACKATHON",
    subtitle: "Build · Innovate · Ship",
    slot: PHOTO_AREAS["hackathon-4"],
    tags: ["hackathon", "ship", "launch"],
    description: "Centered hackathon frame with fixed bracket title lockup.",
  },
  {
    id: "hackathon-5",
    name: "Hackathon Start",
    eventKind: "hackathon",
    layout: "minimal",
    decor: "minimal",
    title: "HACKATHON",
    subtitle: "Good ideas start here. Great products ship here.",
    slot: PHOTO_AREAS["hackathon-5"],
    tags: ["hackathon", "product", "ideas"],
    description: "Minimal hackathon frame with clean central photo slot.",
  },
  {
    id: "meetup-1",
    name: "Meetup Connect",
    eventKind: "meetup",
    layout: "angled",
    decor: "chat",
    title: "MEETUP",
    subtitle: "Learn. Connect. Build.",
    slot: PHOTO_AREAS["meetup-1"],
    tags: ["meetup", "community", "network"],
    description: "Meetup frame with fixed chat and people accents.",
  },
  {
    id: "meetup-2",
    name: "Meetup Projects",
    eventKind: "meetup",
    layout: "wide",
    decor: "waves",
    title: "MEETUP",
    subtitle: "Real people. Real projects. Real impact.",
    slot: PHOTO_AREAS["meetup-2"],
    tags: ["meetup", "projects", "community"],
    description: "Meetup frame with flowing wave detail.",
  },
  {
    id: "meetup-3",
    name: "Meetup Grow",
    eventKind: "meetup",
    layout: "wide",
    decor: "city",
    title: "MEETUP",
    subtitle: "Code together. Grow together.",
    slot: PHOTO_AREAS["meetup-3"],
    tags: ["meetup", "code", "growth"],
    description: "Meetup frame with fixed skyline accent.",
  },
  {
    id: "meetup-4",
    name: "Meetup Ideas",
    eventKind: "meetup",
    layout: "wide",
    decor: "chat",
    title: "MEETUP",
    subtitle: "Share ideas. Get inspired.",
    slot: PHOTO_AREAS["meetup-4"],
    tags: ["meetup", "ideas", "inspire"],
    description: "Meetup frame with chat icon and dot field.",
  },
  {
    id: "meetup-5",
    name: "Meetup Future",
    eventKind: "meetup",
    layout: "wide",
    decor: "waves",
    title: "MEETUP",
    subtitle: "Building the future, one meetup at a time.",
    slot: PHOTO_AREAS["meetup-5"],
    tags: ["meetup", "future", "community"],
    description: "Meetup frame with fixed waves and lower hashtag.",
  },
  {
    id: "cafe-1",
    name: "Cafe Community",
    eventKind: "cafe",
    layout: "minimal",
    decor: "coffee",
    title: "CAFE CURSOR",
    subtitle: "Code. Coffee. Community.",
    slot: PHOTO_AREAS["cafe-1"],
    tags: ["cafe", "coffee", "community"],
    description: "Cafe Cursor frame with right photo card and cup icon.",
  },
  {
    id: "cafe-2",
    name: "Cafe Conversations",
    eventKind: "cafe",
    layout: "wide",
    decor: "coffee",
    title: "CAFE CURSOR",
    subtitle: "Good conversations. Better code.",
    slot: PHOTO_AREAS["cafe-2"],
    tags: ["cafe", "conversations", "code"],
    description: "Cafe Cursor frame with coffee beans and wide photo slot.",
  },
  {
    id: "cafe-3",
    name: "Cafe Ship Code",
    eventKind: "cafe",
    layout: "wide",
    decor: "coffee",
    title: "CAFE CURSOR",
    subtitle: "Sip coffee. Ship code.",
    slot: PHOTO_AREAS["cafe-3"],
    tags: ["cafe", "ship", "code"],
    description: "Cafe Cursor frame with fixed cup accent.",
  },
  {
    id: "cafe-4",
    name: "Cafe Builders",
    eventKind: "cafe",
    layout: "wide",
    decor: "minimal",
    title: "CAFE CURSOR",
    subtitle: "Where builders meet over coffee",
    slot: PHOTO_AREAS["cafe-4"],
    tags: ["cafe", "builders", "coffee"],
    description: "Cafe Cursor frame with hanging light detail.",
  },
  {
    id: "cafe-5",
    name: "Cafe Connections",
    eventKind: "cafe",
    layout: "minimal",
    decor: "coffee",
    title: "CAFE CURSOR",
    subtitle: "Ideas brew here. Connections grow here.",
    slot: PHOTO_AREAS["cafe-5"],
    tags: ["cafe", "ideas", "connections"],
    description: "Cafe Cursor frame with right card and cup illustration.",
  },
  {
    id: "announcement-1",
    name: "Announcement Big",
    eventKind: "announcement",
    layout: "minimal",
    decor: "megaphone",
    title: "ANNOUNCEMENT",
    subtitle: "Big things are coming. Stay tuned!",
    slot: PHOTO_AREAS["announcement-1"],
    tags: ["announcement", "launch", "news"],
    description: "Text-only announcement frame with fixed megaphone detail.",
  },
  {
    id: "announcement-2",
    name: "Announcement Soon",
    eventKind: "announcement",
    layout: "minimal",
    decor: "dots",
    title: "ANNOUNCEMENT",
    subtitle: "Something exciting is on the way.",
    slot: PHOTO_AREAS["announcement-2"],
    tags: ["announcement", "soon", "teaser"],
    description: "Announcement teaser frame with fixed dot field.",
  },
  {
    id: "announcement-3",
    name: "Announcement New",
    eventKind: "announcement",
    layout: "minimal",
    decor: "spark",
    title: "ANNOUNCEMENT",
    subtitle: "New event. New experiences. New connections.",
    slot: PHOTO_AREAS["announcement-3"],
    tags: ["announcement", "event", "connections"],
    description: "Announcement frame with arrow-style motion detail.",
  },
  {
    id: "announcement-4",
    name: "Announcement Ready",
    eventKind: "announcement",
    layout: "wide",
    decor: "minimal",
    title: "ANNOUNCEMENT",
    subtitle: "Get ready to build, learn & connect.",
    slot: PHOTO_AREAS["announcement-4"],
    tags: ["announcement", "build", "connect"],
    description: "Announcement frame with fixed lower content slot.",
  },
  {
    id: "announcement-5",
    name: "Announcement Details",
    eventKind: "announcement",
    layout: "minimal",
    decor: "spark",
    title: "ANNOUNCEMENT",
    subtitle: "More details coming soon!",
    slot: PHOTO_AREAS["announcement-5"],
    tags: ["announcement", "details", "soon"],
    description: "Minimal announcement frame with sparkle accents.",
  },
  {
    id: "thank-you-1",
    name: "Thank You Heart",
    eventKind: "thank-you",
    layout: "minimal",
    decor: "heart",
    title: "THANK YOU!",
    subtitle: "Thanks to everyone who joined and made it amazing.",
    slot: PHOTO_AREAS["thank-you-1"],
    tags: ["thank-you", "community", "recap"],
    description: "Thank-you frame with heart detail.",
  },
  {
    id: "thank-you-2",
    name: "Thank You Waves",
    eventKind: "thank-you",
    layout: "minimal",
    decor: "waves",
    title: "THANK YOU!",
    subtitle: "Grateful for the energy, ideas and connections.",
    slot: PHOTO_AREAS["thank-you-2"],
    tags: ["thank-you", "gratitude", "community"],
    description: "Thank-you frame with fixed wave pattern.",
  },
  {
    id: "thank-you-3",
    name: "Thank You Memorable",
    eventKind: "thank-you",
    layout: "minimal",
    decor: "heart",
    title: "THANK YOU!",
    subtitle: "You made it memorable!",
    slot: PHOTO_AREAS["thank-you-3"],
    tags: ["thank-you", "memorable", "event"],
    description: "Thank-you frame with fixed heart badge.",
  },
  {
    id: "thank-you-4",
    name: "Thank You Next",
    eventKind: "thank-you",
    layout: "minimal",
    decor: "spark",
    title: "THANK YOU!",
    subtitle: "Until next time. Keep building!",
    slot: PHOTO_AREAS["thank-you-4"],
    tags: ["thank-you", "builders", "next"],
    description: "Thank-you frame with clean star accent.",
  },
  {
    id: "thank-you-5",
    name: "Thank You Community",
    eventKind: "thank-you",
    layout: "minimal",
    decor: "waves",
    title: "THANK YOU!",
    subtitle: "Community. Code. Connection. That's Cursor.",
    slot: PHOTO_AREAS["thank-you-5"],
    tags: ["thank-you", "cursor", "community"],
    description: "Thank-you frame with fixed wave fade.",
  },
];

function enc(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function x(v: string | undefined, fallback = ""): string {
  return (v ?? fallback)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fitText(value: string, maxWidth: number, averageGlyph = 0.58): string {
  const estimated = value.length * averageGlyph;
  return estimated > maxWidth ? ` textLength="${maxWidth}" lengthAdjust="spacingAndGlyphs"` : "";
}

function fittedFontSize(value: string, baseSize: number, maxWidth: number, minSize = 38): number {
  const estimatedWidth = value.length * baseSize * 0.64;
  if (estimatedWidth <= maxWidth) return baseSize;
  return Math.max(minSize, Math.floor((maxWidth / Math.max(value.length, 1)) / 0.64));
}

function textTouchesPhotoY(area: PhotoArea | null, y: number, fontSize: number): boolean {
  if (!area) return false;
  const top = y - fontSize;
  const bottom = y + fontSize * 0.35;
  return bottom >= area.y && top <= area.y + area.height;
}

function safeTextWidth(area: PhotoArea | null, x0: number, y: number, fontSize: number, fallback: number): number {
  if (!area || x0 >= area.x || !textTouchesPhotoY(area, y, fontSize)) return fallback;
  return Math.max(120, Math.min(fallback, area.x - x0 - 70));
}

function wrapText(value: string, maxWidth: number, fontSize: number, maxLines = 3): string[] {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const maxChars = Math.max(8, Math.floor(maxWidth / (fontSize * 0.68)));
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }

    if (current) lines.push(current);
    current = word;

    if (lines.length === maxLines - 1) break;
  }

  if (current && lines.length < maxLines) lines.push(current);

  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/\.+$/, "")}...`;
  }

  return lines;
}

function multilineText({
  value,
  x0,
  y,
  maxWidth,
  fontSize,
  weight,
  fill,
  letterSpacing = 0,
  anchor = "start",
  maxLines = 3,
}: {
  value: string;
  x0: number;
  y: number;
  maxWidth: number;
  fontSize: number;
  weight: number;
  fill: string;
  letterSpacing?: number;
  anchor?: "start" | "middle" | "end";
  maxLines?: number;
}): string {
  const lines = wrapText(value, maxWidth, fontSize, maxLines);
  const lineHeight = fontSize * 1.18;
  const tspans = lines
    .map((line, index) => `<tspan x="${x0}" dy="${index === 0 ? 0 : lineHeight}">${x(line)}</tspan>`)
    .join("");
  const anchorAttr = anchor === "start" ? "" : ` text-anchor="${anchor}"`;
  const spacingAttr = letterSpacing ? ` letter-spacing="${letterSpacing}"` : "";
  return `<text x="${x0}" y="${y}"${anchorAttr} font-family="'Geist','Inter',Arial,sans-serif" font-size="${fontSize}" font-weight="${weight}"${spacingAttr} fill="${fill}">${tspans}</text>`;
}

function contentTitle(b: BrandingConfig, fallback: string): string {
  const value = b.eventName.trim();
  if (!value) return fallback;
  return value.replace(/^\//, "");
}

function contentSubtitle(b: BrandingConfig, fallback: string): string {
  const value = b.tagline.trim();
  if (!value) return fallback;
  return value;
}

function tagFor(kind: EventKind): string {
  switch (kind) {
    case "hackathon":
      return "#CursorHackathon";
    case "meetup":
      return "#CursorMeetup";
    case "cafe":
      return "#CafeCursor";
    case "announcement":
      return "#Cursor";
    case "thank-you":
      return "#Cursor";
  }
}

function bgColor(): string {
  return "#050505";
}

function secondaryColor(): string {
  return "#111827";
}

function panelBg(area: PhotoArea | null, fill: string): string {
  if (!area) return `<rect x="0" y="0" width="${W}" height="${H}" fill="${fill}"/>`;
  const { x: ax, y: ay, width: aw, height: ah } = area;
  return `<rect x="0" y="0" width="${W}" height="${ay}" fill="${fill}"/>
  <rect x="0" y="${ay}" width="${ax}" height="${ah}" fill="${fill}"/>
  <rect x="${ax + aw}" y="${ay}" width="${W - ax - aw}" height="${ah}" fill="${fill}"/>
  <rect x="0" y="${ay + ah}" width="${W}" height="${H - ay - ah}" fill="${fill}"/>`;
}

function logo(): string {
  return cursorLogoSvg(92, 72, 38, { anchor: "top-left", opacity: 0.96 });
}

function slotBorder(area: PhotoArea | null, layout: LayoutKind): string {
  if (!area) return "";
  const cut = layout === "angled" ? `L${area.x + area.width - 120},${area.y + area.height} L${area.x},${area.y + area.height}` : `L${area.x},${area.y + area.height}`;
  const path = layout === "angled"
    ? `M${area.x},${area.y} L${area.x + area.width - 70},${area.y} L${area.x + area.width},${area.y + 70} ${cut} Z`
    : `M${area.x},${area.y} L${area.x + area.width},${area.y} L${area.x + area.width},${area.y + area.height} ${cut} Z`;
  return `<path d="${path}" fill="none" stroke="rgba(255,255,255,0.86)" stroke-width="2.4" vector-effect="non-scaling-stroke"/>`;
}

function dotField(x0: number, y0: number, cols = 12, rows = 8, gap = 22): string {
  const dots = Array.from({ length: cols * rows }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return `<circle cx="${x0 + col * gap}" cy="${y0 + row * gap}" r="2.2"/>`;
  }).join("");
  return `<g fill="white" opacity="0.32">${dots}</g>`;
}

function gridDecor(): string {
  return `<g fill="none" stroke="white" opacity="0.12" stroke-width="1">
    <path d="M1180 80 L1870 80 L1870 1000"/>
    <path d="M1250 135 L1870 135 M1320 190 L1870 190 M1390 245 L1870 245 M1460 300 L1870 300"/>
    <path d="M1260 80 L1260 410 M1340 80 L1340 520 M1420 80 L1420 630 M1500 80 L1500 745 M1580 80 L1580 850"/>
    <path d="M160 980 C300 860 480 790 720 775"/>
  </g>`;
}

function cubeDecor(): string {
  return `<g fill="none" stroke="white" opacity="0.36" stroke-width="2">
    <path d="M1540 720 L1700 640 L1860 720 L1700 805 Z"/>
    <path d="M1540 720 L1540 885 L1700 975 L1700 805"/>
    <path d="M1860 720 L1860 885 L1700 975"/>
    <path d="M1620 680 L1780 765 M1620 925 L1620 760 M1780 925 L1780 760"/>
  </g>`;
}

function wavesDecor(y = 830): string {
  return `<g fill="none" stroke="white" opacity="0.32" stroke-width="1.5">
    ${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${y + i * 18} C260 ${y - 70 + i * 12}, 420 ${y + 70 + i * 6}, 760 ${y + i * 16} S1240 ${y - 40 + i * 10}, 1560 ${y + i * 14}" />`).join("")}
  </g>`;
}

function cityDecor(): string {
  return `<g fill="none" stroke="white" opacity="0.34" stroke-width="2">
    <path d="M1190 875 L1190 790 L1245 790 L1245 740 L1280 740 L1280 700 L1320 700 L1320 760 L1375 760 L1375 820 L1425 820 L1425 735 L1480 735 L1480 680 L1520 680 L1520 875"/>
    <path d="M1090 875 L1605 875"/>
  </g>`;
}

function chatDecor(): string {
  return `<g fill="none" stroke="white" opacity="0.5" stroke-width="2.5">
    <rect x="1550" y="260" width="130" height="92" rx="18"/>
    <path d="M1590 352 L1565 392 L1630 352"/>
    <rect x="1700" y="380" width="105" height="74" rx="15"/>
    <path d="M1735 454 L1718 486 L1764 454"/>
    <circle cx="1590" cy="305" r="5"/><circle cx="1620" cy="305" r="5"/><circle cx="1650" cy="305" r="5"/>
  </g>`;
}

function coffeeDecor(): string {
  return `<g fill="none" stroke="white" opacity="0.68" stroke-width="3">
    <path d="M142 820 H315 V910 C315 954 284 980 230 980 H185 C152 980 126 950 126 910 V820"/>
    <path d="M315 848 H360 C397 848 398 916 315 916"/>
    <path d="M165 760 C132 715 205 704 172 650 M232 760 C199 715 272 704 239 650"/>
  </g>`;
}

function megaphoneDecor(): string {
  return `<g fill="none" stroke="white" opacity="0.68" stroke-width="3">
    <path d="M145 760 L335 670 L335 850 L145 800 Z"/>
    <path d="M145 760 L95 785 L95 830 L145 800"/>
    <path d="M190 820 L230 940"/>
    <path d="M365 675 C440 710 440 812 365 848"/>
    <path d="M390 615 L455 565 M410 915 L470 980"/>
  </g>`;
}

function sparkDecor(x0 = 1595, y0 = 760): string {
  return `<g fill="none" stroke="white" opacity="0.62" stroke-width="3">
    <path d="M${x0} ${y0 - 110} L${x0 + 28} ${y0 - 28} L${x0 + 110} ${y0} L${x0 + 28} ${y0 + 28} L${x0} ${y0 + 110} L${x0 - 28} ${y0 + 28} L${x0 - 110} ${y0} L${x0 - 28} ${y0 - 28} Z"/>
    <path d="M${x0 + 190} ${y0 - 190} L${x0 + 205} ${y0 - 145} L${x0 + 250} ${y0 - 130} L${x0 + 205} ${y0 - 115} L${x0 + 190} ${y0 - 70} L${x0 + 175} ${y0 - 115} L${x0 + 130} ${y0 - 130} L${x0 + 175} ${y0 - 145} Z"/>
  </g>`;
}

function heartDecor(): string {
  return `<g fill="none" stroke="white" opacity="0.65" stroke-width="3">
    <path d="M160 780 C90 710 115 610 205 610 C250 610 282 636 300 670 C318 636 350 610 395 610 C485 610 510 710 440 780 L300 925 Z"/>
  </g>`;
}

function decor(kind: DecorKind): string {
  switch (kind) {
    case "grid":
      return gridDecor();
    case "cube":
      return cubeDecor();
    case "waves":
      return wavesDecor();
    case "dots":
      return `${dotField(1580, 750, 13, 9, 22)}${dotField(120, 790, 8, 6, 20)}`;
    case "city":
      return cityDecor();
    case "chat":
      return chatDecor();
    case "coffee":
      return coffeeDecor();
    case "megaphone":
      return megaphoneDecor();
    case "spark":
      return sparkDecor();
    case "heart":
      return heartDecor();
    case "minimal":
      return "";
  }
}

function bracketTitle(title: string): string {
  const size = fittedFontSize(title, 56, 900, 30);
  const isLong = title.length > 18;
  if (isLong) {
    return `<text x="${W / 2}" y="215" text-anchor="middle" font-family="'Geist','Inter',Arial,sans-serif" font-size="${size}" font-weight="820" letter-spacing="5" fill="white">${x(title).toUpperCase()}</text>`;
  }
  const braceSize = isLong ? 72 : 100;
  return `<text x="510" y="220" text-anchor="middle" font-family="'Geist','Inter',Arial,sans-serif" font-size="${braceSize}" font-weight="520" fill="rgba(255,255,255,0.88)">{</text>
  <text x="${W / 2}" y="215" text-anchor="middle" font-family="'Geist','Inter',Arial,sans-serif" font-size="${size}" font-weight="820" letter-spacing="5" fill="white">${x(title).toUpperCase()}</text>
  <text x="1410" y="220" text-anchor="middle" font-family="'Geist','Inter',Arial,sans-serif" font-size="${braceSize}" font-weight="520" fill="rgba(255,255,255,0.88)">}</text>`;
}

function renderTemplate(t: FrameTemplate, b: BrandingConfig): string {
  const bg = bgColor();
  const sec = secondaryColor();
  const title = contentTitle(b, t.title);
  const subtitle = contentSubtitle(b, t.subtitle);
  const tag = tagFor(t.eventKind);
  const isBracket = t.layout === "bracket";
  const isHero = t.layout === "hero";
  const titleX = isBracket ? W / 2 : 95;
  const titleY = isHero ? 585 : 205;
  const titleSize = isHero ? 82 : t.eventKind === "announcement" || t.eventKind === "thank-you" ? 50 : 64;
  const subtitleY = isHero ? 730 : t.eventKind === "announcement" || t.eventKind === "thank-you" ? 315 : 270;
  const titleMaxWidth = isHero ? 560 : t.eventKind === "announcement" || t.eventKind === "thank-you" ? 760 : 860;
  const subtitleMaxWidth = isBracket ? 560 : isHero ? 540 : 760;
  const titleFontSize = fittedFontSize(title, titleSize, titleMaxWidth, isHero ? 42 : 38);
  const titleSafeWidth = safeTextWidth(t.slot, titleX, titleY, titleFontSize, titleMaxWidth);
  const titleLines = wrapText(title.toUpperCase(), titleSafeWidth, titleFontSize, isHero ? 3 : 2);
  const subtitleFontSize = isHero ? 29 : 24;
  const titleBlockBottom = titleY + (titleLines.length - 1) * titleFontSize * 1.18;
  const adjustedSubtitleY = isBracket ? subtitleY : Math.max(subtitleY, titleBlockBottom + subtitleFontSize + 18);
  const subtitleSafeWidth = safeTextWidth(t.slot, isBracket ? W / 2 : 98, adjustedSubtitleY, subtitleFontSize, subtitleMaxWidth);
  const statusY = titleY - 135;
  const statusSafeWidth = safeTextWidth(t.slot, titleX, statusY, 38, 500);

  return enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="72%" cy="20%" r="72%">
      <stop offset="0%" stop-color="${sec}" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="edge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.16"/>
    </linearGradient>
  </defs>
  ${panelBg(t.slot, bg)}
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#glow)" opacity="0.35"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="url(#edge)" stroke-width="1.5"/>
  ${logo()}
  ${decor(t.decor)}
  ${slotBorder(t.slot, t.layout)}
  ${isBracket ? bracketTitle(title) : `
  ${t.status ? multilineText({ value: t.status.toUpperCase(), x0: titleX, y: statusY, maxWidth: statusSafeWidth, fontSize: 38, weight: 760, letterSpacing: 1.5, fill: "white", maxLines: 2 }) : ""}
  ${multilineText({ value: title.toUpperCase(), x0: titleX, y: titleY, maxWidth: titleSafeWidth, fontSize: titleFontSize, weight: 830, letterSpacing: 4, fill: "white", maxLines: isHero ? 3 : 2 })}`}
  ${isBracket
    ? `<text x="${W / 2}" y="278" text-anchor="middle" font-family="'Geist','Inter',Arial,sans-serif" font-size="24" font-weight="520" fill="rgba(255,255,255,0.82)"${fitText(subtitle, subtitleMaxWidth, 14)}>${x(subtitle)}</text>`
    : multilineText({ value: subtitle, x0: 98, y: adjustedSubtitleY, maxWidth: subtitleSafeWidth, fontSize: subtitleFontSize, weight: 520, fill: "rgba(255,255,255,0.82)", maxLines: 3 })}
  ${b.date && b.date !== DEFAULT_BRANDING.date ? `<text x="98" y="955" font-family="'Geist','Inter',Arial,sans-serif" font-size="22" font-weight="600" fill="rgba(255,255,255,0.58)"${fitText(`${b.date}${b.location ? ` · ${b.location}` : ""}`, 760, 13)}>${x(b.date)}${b.location ? ` · ${x(b.location)}` : ""}</text>` : ""}
  <text x="${W - 98}" y="985" text-anchor="end" font-family="'Geist','Inter',Arial,sans-serif" font-size="18" font-weight="700" fill="rgba(255,255,255,0.88)">${x(tag)}</text>
</svg>`);
}

type FrameGenerator = (b: BrandingConfig) => string;

const GENERATORS = Object.fromEntries(
  TEMPLATES.map((template) => [template.id, (branding: BrandingConfig) => renderTemplate(template, branding)])
) as Record<FrameStyleId, FrameGenerator>;

export function defaultBrandingPosition(): { x: number; y: number } {
  return { x: 92, y: 72 };
}

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
  return TEMPLATES.map((template) => ({
    id: `preset-${template.id}`,
    name: template.name,
    event: template.title,
    imageUrl: renderTemplate(template, branding),
    category: "preset",
    aspectRatio: "16:9",
    createdAt: "2026-01-01T00:00:00.000Z",
    description: template.description,
    tags: template.tags,
    color: "#ffffff",
    styleId: template.id,
    photoArea: template.slot,
  }));
}

export const FRAME_COLORS = [
  "#050505", "#09090c", "#111111",
  "#1a1a24", "#242424", "#2a1f44",
  "#4d9ef6", "#a78bfa", "#2563eb",
  "#7c3aed", "#059669", "#e11d48",
];
