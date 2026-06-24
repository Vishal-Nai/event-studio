"use client";

import { useRef, useCallback, useEffect } from "react";
import { Upload } from "lucide-react";
import { AspectRatio, EditorTransform, PhotoArea } from "@/types";
import { CANVAS_DISPLAY, getCanvasDisplaySize, toCanvasArea } from "@/lib/canvas";
import { cn } from "@/lib/utils";

interface PhotoCanvasProps {
  photoSrc: string | null;
  transform: EditorTransform;
  aspectRatio?: AspectRatio;
  photoArea?: PhotoArea | null;
  photoDisabled?: boolean;
  onTransformChange: (transform: Partial<EditorTransform>) => void;
  onRequestUpload: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function PhotoCanvas({
  photoSrc,
  transform,
  aspectRatio = "1:1",
  photoArea,
  photoDisabled = false,
  onTransformChange,
  onRequestUpload,
  canvasRef,
}: PhotoCanvasProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastPinchDistRef = useRef<number | null>(null);
  const lastPinchScaleRef = useRef<number>(1);
  const displaySize = getCanvasDisplaySize(aspectRatio);
  const uploadArea = toCanvasArea(photoArea, aspectRatio);
  const canvasBuffer = {
    width: displaySize.width * 2,
    height: displaySize.height * 2,
  };

  const canInteract = !!photoSrc && !photoDisabled;

  const toCanvasDelta = useCallback((dx: number, dy: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    const ratio = rect?.width ? CANVAS_DISPLAY / rect.width : 1;
    return { dx: dx * ratio, dy: dy * ratio };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canInteract) return;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }, [canInteract]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (e.buttons !== 1 || !canInteract) return;
      const { dx, dy } = toCanvasDelta(e.clientX - lastPosRef.current.x, e.clientY - lastPosRef.current.y);
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      onTransformChange({ x: transform.x + dx, y: transform.y + dy });
    },
    [canInteract, onTransformChange, toCanvasDelta, transform.x, transform.y]
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el || !canInteract) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? -0.06 : 0.06;
      onTransformChange({ scale: Math.max(0.1, Math.min(5, transform.scale + delta)) });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [canInteract, onTransformChange, transform.scale]);

  const getDistance = (t1: React.Touch, t2: React.Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        if (!canInteract) return;
        lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        if (!canInteract) return;
        lastPinchDistRef.current = getDistance(e.touches[0], e.touches[1]);
        lastPinchScaleRef.current = transform.scale;
      }
    },
    [canInteract, transform.scale]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!canInteract) return;
      if (e.touches.length === 1) {
        const { dx, dy } = toCanvasDelta(e.touches[0].clientX - lastPosRef.current.x, e.touches[0].clientY - lastPosRef.current.y);
        lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        onTransformChange({ x: transform.x + dx, y: transform.y + dy });
      } else if (e.touches.length === 2 && lastPinchDistRef.current !== null) {
        const dist = getDistance(e.touches[0], e.touches[1]);
        const ratio = dist / lastPinchDistRef.current;
        onTransformChange({ scale: Math.max(0.1, Math.min(5, lastPinchScaleRef.current * ratio)) });
      }
    },
    [canInteract, onTransformChange, toCanvasDelta, transform.x, transform.y]
  );

  const handleTouchEnd = useCallback(() => {
    lastPinchDistRef.current = null;
  }, []);

  const handleEmptyClick = useCallback(() => {
    if (!photoSrc && !photoDisabled) onRequestUpload();
  }, [photoSrc, photoDisabled, onRequestUpload]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={stageRef}
        className={cn(
          "relative rounded-2xl overflow-hidden border border-white/10 transition-all select-none",
          !photoSrc && !photoDisabled && "cursor-pointer",
          canInteract && "cursor-grab active:cursor-grabbing"
        )}
        style={{
          width: displaySize.width,
          maxWidth: "100%",
          aspectRatio: `${displaySize.width} / ${displaySize.height}`,
          touchAction: canInteract ? "none" : "auto",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleEmptyClick}
        role="img"
        aria-label="Photo preview canvas"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #1a1a2e 25%, transparent 25%),
              linear-gradient(-45deg, #1a1a2e 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #1a1a2e 75%),
              linear-gradient(-45deg, transparent 75%, #1a1a2e 75%)
            `,
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0",
            backgroundColor: "#16213e",
          }}
        />

        <canvas
          ref={canvasRef}
          width={canvasBuffer.width}
          height={canvasBuffer.height}
          className="absolute inset-0 w-full h-full"
          style={{ imageRendering: "auto" }}
        />

        {!photoSrc && !photoDisabled && (
          <div
            className="absolute z-10 flex items-center justify-center pointer-events-none px-4"
            style={{
              left: `${(uploadArea.x / displaySize.width) * 100}%`,
              top: `${(uploadArea.y / displaySize.height) * 100}%`,
              width: `${(uploadArea.width / displaySize.width) * 100}%`,
              height: `${(uploadArea.height / displaySize.height) * 100}%`,
            }}
          >
            <div className="flex max-w-[260px] flex-col items-center justify-center gap-2 rounded-2xl border border-violet-300/25 bg-black/45 px-5 py-4 text-center shadow-lg shadow-violet-500/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-violet-500/15 border border-violet-400/25">
                <Upload className="w-5 h-5 text-violet-200" />
              </div>
              <p className="text-sm font-semibold text-white">Upload photo</p>
              <p className="text-[11px] text-white/45 leading-snug">Click preview or use the upload button above</p>
            </div>
          </div>
        )}

      </div>

      {photoSrc && !photoDisabled && (
        <p className="text-xs text-white/25">
          Drag photo to move it inside the fixed frame
        </p>
      )}
    </div>
  );
}
