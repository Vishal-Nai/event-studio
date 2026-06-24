import { EditorTransform, ASPECT_RATIO_DIMENSIONS, AspectRatio, PhotoArea } from "@/types";

/**
 * Logical display size (CSS pixels). All EditorTransform values live in this
 * coordinate space. The canvas buffer may be larger (2× for DPR), but the
 * drawComposite function accepts transforms in this space and scales
 * internally.
 */
export const CANVAS_DISPLAY = 560;

export interface CanvasLayer {
  photo: HTMLImageElement | null;
  frame: HTMLImageElement | null;
  transform: EditorTransform;
  canvasWidth: number;
  canvasHeight: number;
  photoArea?: PhotoArea | null;
}

/**
 * Convert a photo-area from 1080-space to CANVAS_DISPLAY (560) space.
 * Returns the full canvas area when area is null/undefined.
 */
export function toCanvasArea(area: PhotoArea | null | undefined): PhotoArea {
  if (!area) return { x: 0, y: 0, width: CANVAS_DISPLAY, height: CANVAS_DISPLAY };
  const s = CANVAS_DISPLAY / 1080;
  return {
    x: area.x * s,
    y: area.y * s,
    width: area.width * s,
    height: area.height * s,
  };
}

/**
 * Draw photo + frame overlay on a canvas.
 * Transforms are expressed in CANVAS_DISPLAY (560) coordinate space.
 * The function scales them to the actual canvas buffer resolution.
 */
export function drawComposite(canvas: HTMLCanvasElement, layer: CanvasLayer): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { photo, frame, transform, canvasWidth, canvasHeight, photoArea } = layer;

  // Scale from CANVAS_DISPLAY (transform space) → actual canvas buffer pixels
  const dpr = canvasWidth / CANVAS_DISPLAY;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // photoArea === null means text-only frames (e.g. Save the Date) — skip photo layer
  if (photo && photoArea !== null) {
    // Convert photo-area to display space, then apply DPR for buffer pixels
    const display = toCanvasArea(photoArea);
    const tx = (display.x + display.width  / 2 + transform.x) * dpr;
    const ty = (display.y + display.height / 2 + transform.y) * dpr;
    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(transform.scale * dpr, transform.scale * dpr);
    ctx.drawImage(photo, -photo.naturalWidth / 2, -photo.naturalHeight / 2);
    ctx.restore();
  }

  // Frame is always drawn at full buffer resolution (it IS the poster design)
  if (frame) {
    ctx.drawImage(frame, 0, 0, canvasWidth, canvasHeight);
  }
}

export async function exportCanvas(
  photo: HTMLImageElement | null,
  frame: HTMLImageElement | null,
  transform: EditorTransform,
  aspectRatio: AspectRatio,
  photoArea?: PhotoArea | null
): Promise<string> {
  const { width, height } = ASPECT_RATIO_DIMENSIONS[aspectRatio];
  const out = document.createElement("canvas");
  out.width = width;
  out.height = height;
  drawComposite(out, {
    photo,
    frame,
    transform,
    canvasWidth: width,
    canvasHeight: height,
    photoArea,
  });
  return out.toDataURL("image/png", 1.0);
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
