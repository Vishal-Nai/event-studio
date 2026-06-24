export interface Frame {
  id: string;
  name: string;
  event: string;
  imageUrl: string;
  category: "preset";
  aspectRatio: "1:1" | "4:5" | "16:9";
  createdAt: string;
  description?: string;
  tags?: string[];
  color?: string;
  styleId?: FrameStyleId;
  branding?: BrandingConfig;
  photoArea?: PhotoArea | null;
}

export interface EditorTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface Caption {
  text: string;
  hashtags: string[];
}


export type AspectRatio = "1:1" | "4:5" | "16:9";

export interface PhotoArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BrandingPosition {
  x: number;
  y: number;
}

export const ASPECT_RATIO_DIMENSIONS: Record<AspectRatio, { width: number; height: number }> = {
  "1:1": { width: 1080, height: 1080 },
  "4:5": { width: 1080, height: 1350 },
  "16:9": { width: 1920, height: 1080 },
};

// ─── Branding Config ────────────────────────────────────────────────────────

export interface BrandingConfig {
  eventName: string;
  tagline: string;
  logoText: string;
  brandingPosition?: BrandingPosition;
  date: string;
  location: string;
  accentColor: string;
  secondaryColor: string;
  website: string;
  statusText?: string;
  hashtags?: string;
  backgroundStyle?: "city" | "grid" | "minimal" | "code";
}

export const DEFAULT_BRANDING: BrandingConfig = {
  eventName: "Cursor India",
  tagline: "AI coding agent for building ambitious software",
  logoText: "Cursor",
  date: "July 2026",
  location: "India",
  accentColor: "#050505",
  secondaryColor: "#7c3aed",
  website: "cursor.com",
  statusText: "Cursor India",
  hashtags: "#CursorIndia, #CursorAI, #DevCommunity, #BuildWithCursor, #AICoding",
  backgroundStyle: "city",
};

export const FRAME_STYLE_IDS = [
  "hackathon-1",
  "hackathon-2",
  "hackathon-3",
  "hackathon-4",
  "hackathon-5",
  "meetup-1",
  "meetup-2",
  "meetup-3",
  "meetup-4",
  "meetup-5",
  "cafe-1",
  "cafe-2",
  "cafe-3",
  "cafe-4",
  "cafe-5",
  "announcement-1",
  "announcement-2",
  "announcement-3",
  "announcement-4",
  "announcement-5",
  "thank-you-1",
  "thank-you-2",
  "thank-you-3",
  "thank-you-4",
  "thank-you-5",
] as const;

export type FrameStyleId = typeof FRAME_STYLE_IDS[number];

export interface FrameStyle {
  id: FrameStyleId;
  name: string;
  description: string;
}

export const FRAME_STYLES: FrameStyle[] = [
  { id: "hackathon-1", name: "Hackathon Build", description: "Fixed Cursor hackathon frame." },
  { id: "hackathon-2", name: "Hackathon Code", description: "Fixed Cursor hackathon frame." },
  { id: "hackathon-3", name: "Hackathon Impact", description: "Fixed Cursor hackathon frame." },
  { id: "hackathon-4", name: "Hackathon Ship", description: "Fixed Cursor hackathon frame." },
  { id: "hackathon-5", name: "Hackathon Start", description: "Fixed Cursor hackathon frame." },
  { id: "meetup-1", name: "Meetup Connect", description: "Fixed Cursor meetup frame." },
  { id: "meetup-2", name: "Meetup Projects", description: "Fixed Cursor meetup frame." },
  { id: "meetup-3", name: "Meetup Grow", description: "Fixed Cursor meetup frame." },
  { id: "meetup-4", name: "Meetup Ideas", description: "Fixed Cursor meetup frame." },
  { id: "meetup-5", name: "Meetup Future", description: "Fixed Cursor meetup frame." },
  { id: "cafe-1", name: "Cafe Community", description: "Fixed Cafe Cursor frame." },
  { id: "cafe-2", name: "Cafe Conversations", description: "Fixed Cafe Cursor frame." },
  { id: "cafe-3", name: "Cafe Ship Code", description: "Fixed Cafe Cursor frame." },
  { id: "cafe-4", name: "Cafe Builders", description: "Fixed Cafe Cursor frame." },
  { id: "cafe-5", name: "Cafe Connections", description: "Fixed Cafe Cursor frame." },
  { id: "announcement-1", name: "Announcement Big", description: "Fixed Cursor announcement frame." },
  { id: "announcement-2", name: "Announcement Soon", description: "Fixed Cursor announcement frame." },
  { id: "announcement-3", name: "Announcement New", description: "Fixed Cursor announcement frame." },
  { id: "announcement-4", name: "Announcement Ready", description: "Fixed Cursor announcement frame." },
  { id: "announcement-5", name: "Announcement Details", description: "Fixed Cursor announcement frame." },
  { id: "thank-you-1", name: "Thank You Heart", description: "Fixed Cursor thank-you frame." },
  { id: "thank-you-2", name: "Thank You Waves", description: "Fixed Cursor thank-you frame." },
  { id: "thank-you-3", name: "Thank You Memorable", description: "Fixed Cursor thank-you frame." },
  { id: "thank-you-4", name: "Thank You Next", description: "Fixed Cursor thank-you frame." },
  { id: "thank-you-5", name: "Thank You Community", description: "Fixed Cursor thank-you frame." },
];
