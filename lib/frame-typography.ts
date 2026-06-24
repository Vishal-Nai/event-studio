import { CURSOR_GOTHIC_REGULAR_WOFF2 } from "@/lib/cursor-gothic-font-data";

export const FRAME_DISPLAY_FONT =
  "'CursorGothic'";

export const FRAME_TITLE_WEIGHT = 400;
export const FRAME_BODY_WEIGHT = 400;

// Cursor's display voice is compressed through letterform/tracking, not heavy weight.
export const FRAME_TITLE_TRACKING = -1.6;
export const FRAME_SUBTITLE_TRACKING = -0.2;

export const LOCAL_FONT_FACE_CSS = `
@font-face {
  font-family: 'CursorGothic';
  src: url('data:font/woff2;base64,${CURSOR_GOTHIC_REGULAR_WOFF2}') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: block;
}`.trim();
