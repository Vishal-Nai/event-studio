import { EditorTransform, ASPECT_RATIO_DIMENSIONS, AspectRatio, PhotoArea } from "@/types";

/**
 * Logical display size (CSS pixels). All EditorTransform values live in this
 * coordinate space. The canvas buffer may be larger (2× for DPR), but the
 * drawComposite function accepts transforms in this space and scales
 * internally.
 */
export const CANVAS_DISPLAY = 720;

export function getCanvasDisplaySize(aspectRatio: AspectRatio = "1:1"): { width: number; height: number } {
  const { width, height } = ASPECT_RATIO_DIMENSIONS[aspectRatio];
  return {
    width: CANVAS_DISPLAY,
    height: CANVAS_DISPLAY * (height / width),
  };
}

export interface CanvasLayer {
  photo: HTMLImageElement | null;
  frame: HTMLImageElement | null;
  transform: EditorTransform;
  canvasWidth: number;
  canvasHeight: number;
  aspectRatio?: AspectRatio;
  photoArea?: PhotoArea | null;
}

/**
 * Convert a photo-area from source frame space to CANVAS_DISPLAY space.
 * Returns the full canvas area when area is null/undefined.
 */
export function toCanvasArea(area: PhotoArea | null | undefined, aspectRatio: AspectRatio = "1:1"): PhotoArea {
  const source = ASPECT_RATIO_DIMENSIONS[aspectRatio];
  const display = getCanvasDisplaySize(aspectRatio);
  if (!area) return { x: 0, y: 0, width: display.width, height: display.height };
  const s = display.width / source.width;
  return {
    x: area.x * s,
    y: area.y * s,
    width: area.width * s,
    height: area.height * s,
  };
}

export function getPortraitFocusOffset(photoHeight: number, scale: number, areaHeight: number): number {
  const renderedHeight = photoHeight * scale;
  const maxSafeOffset = Math.max(0, (renderedHeight - areaHeight) / 2);
  const preferredOffset = Math.min(areaHeight * 0.055, renderedHeight * 0.045);
  return Math.min(preferredOffset, maxSafeOffset * 0.7);
}

/**
 * Draw photo + frame overlay on a canvas.
 * Transforms are expressed in CANVAS_DISPLAY coordinate space.
 * The function scales them to the actual canvas buffer resolution.
 */
export function drawComposite(canvas: HTMLCanvasElement, layer: CanvasLayer): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { photo, frame, transform, canvasWidth, canvasHeight, aspectRatio = "1:1", photoArea } = layer;

  // Scale from display-size transform space to actual canvas buffer pixels.
  const display = getCanvasDisplaySize(aspectRatio);
  const dpr = canvasWidth / display.width;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // photoArea === null means text-only frames — skip photo layer.
  if (photo && photoArea !== null) {
    const area = toCanvasArea(photoArea, aspectRatio);
    const clipX = area.x * dpr;
    const clipY = area.y * dpr;
    const clipW = area.width * dpr;
    const clipH = area.height * dpr;

    ctx.save();
    ctx.beginPath();
    ctx.rect(clipX, clipY, clipW, clipH);
    ctx.clip();

    // Fill the whole fixed photo window with a soft version of the upload.
    // This keeps portrait photos social-ready without stretching the subject.
    const coverScale = Math.max(clipW / photo.naturalWidth, clipH / photo.naturalHeight);
    ctx.save();
    ctx.filter = "blur(18px)";
    ctx.globalAlpha = 0.68;
    ctx.translate(clipX + clipW / 2, clipY + clipH / 2);
    ctx.scale(coverScale, coverScale);
    ctx.drawImage(photo, -photo.naturalWidth / 2, -photo.naturalHeight / 2);
    ctx.restore();

    ctx.fillStyle = "rgba(0,0,0,0.10)";
    ctx.fillRect(clipX, clipY, clipW, clipH);

    const tx = (area.x + area.width / 2 + transform.x) * dpr;
    const ty = (area.y + area.height / 2 + transform.y) * dpr;
    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(transform.scale * dpr, transform.scale * dpr);
    ctx.drawImage(photo, -photo.naturalWidth / 2, -photo.naturalHeight / 2);
    ctx.restore();
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
    aspectRatio,
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
