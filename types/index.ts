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
  accentColor: string;
  secondaryColor: string;
  backgroundStyle?: "city" | "grid" | "minimal" | "code";
}

export const DEFAULT_BRANDING: BrandingConfig = {
  eventName: "Cursor India",
  tagline: "AI coding agent for building ambitious software",
  logoText: "Cursor",
  accentColor: "#050505",
  secondaryColor: "#7c3aed",
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
  "announcement-4",
  "thank-you-1",
  "thank-you-2",
] as const;

export type FrameStyleId = typeof FRAME_STYLE_IDS[number];
