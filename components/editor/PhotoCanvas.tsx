"use client";

import { useRef, useCallback, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { EditorTransform } from "@/types";
import { cn } from "@/lib/utils";

interface PhotoCanvasProps {
  photoSrc: string | null;
  transform: EditorTransform;
  photoDisabled?: boolean;
  onTransformChange: (transform: Partial<EditorTransform>) => void;
  onRequestUpload: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const CANVAS_SIZE = 560;
const CANVAS_BUFFER = CANVAS_SIZE * 2;

export function PhotoCanvas({
  photoSrc,
  transform,
  photoDisabled = false,
  onTransformChange,
  onRequestUpload,
  canvasRef,
}: PhotoCanvasProps) {
  const [isDragging, setIsDragging] = useState(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastPinchDistRef = useRef<number | null>(null);
  const lastPinchScaleRef = useRef<number>(1);

  const canInteract = !!photoSrc && !photoDisabled;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canInteract) return;
    setIsDragging(true);
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }, [canInteract]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      onTransformChange({ x: transform.x + dx, y: transform.y + dy });
    },
    [isDragging, onTransformChange, transform.x, transform.y]
  );

  const stopDrag = useCallback(() => { setIsDragging(false); }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!canInteract) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.06 : 0.06;
      onTransformChange({ scale: Math.max(0.1, Math.min(5, transform.scale + delta)) });
    },
    [canInteract, onTransformChange, transform.scale]
  );

  const getDistance = (t1: React.Touch, t2: React.Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!canInteract) return;
      if (e.touches.length === 1) {
        setIsDragging(true);
        lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        setIsDragging(false);
        lastPinchDistRef.current = getDistance(e.touches[0], e.touches[1]);
        lastPinchScaleRef.current = transform.scale;
      }
    },
    [canInteract, transform.scale]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!canInteract) return;
      e.preventDefault();
      if (e.touches.length === 1 && isDragging) {
        const dx = e.touches[0].clientX - lastPosRef.current.x;
        const dy = e.touches[0].clientY - lastPosRef.current.y;
        lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        onTransformChange({ x: transform.x + dx, y: transform.y + dy });
      } else if (e.touches.length === 2 && lastPinchDistRef.current !== null) {
        const dist = getDistance(e.touches[0], e.touches[1]);
        const ratio = dist / lastPinchDistRef.current;
        onTransformChange({ scale: Math.max(0.1, Math.min(5, lastPinchScaleRef.current * ratio)) });
      }
    },
    [canInteract, isDragging, onTransformChange, transform.x, transform.y]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    lastPinchDistRef.current = null;
  }, []);

  const handleEmptyClick = useCallback(() => {
    if (!photoSrc && !photoDisabled) onRequestUpload();
  }, [photoSrc, photoDisabled, onRequestUpload]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden border border-white/10 transition-all select-none",
          !photoSrc && !photoDisabled && "cursor-pointer",
          canInteract && (isDragging ? "cursor-grabbing" : "cursor-grab")
        )}
        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, maxWidth: "100%" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onWheel={handleWheel}
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
          width={CANVAS_BUFFER}
          height={CANVAS_BUFFER}
          className="absolute inset-0 w-full h-full"
          style={{ imageRendering: "auto" }}
        />

        {photoDisabled && !photoSrc && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 pointer-events-none">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/[0.05]">
              <ImageIcon className="w-7 h-7 text-white/25" />
            </div>
            <div className="text-center px-4">
              <p className="text-sm font-medium text-white/55">This style does not need a photo</p>
              <p className="text-xs text-white/30 mt-1">Save it as-is or change the event details below</p>
            </div>
          </div>
        )}

        {!photoSrc && !photoDisabled && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 pointer-events-none px-6">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-violet-500/12 border border-violet-400/20 shadow-lg shadow-violet-500/10">
              <Upload className="w-8 h-8 text-violet-300" />
            </div>
            <div className="text-center max-w-xs">
              <p className="text-lg font-semibold text-white">Upload your photo</p>
              <p className="text-sm text-white/45 mt-2">Click here or drag a photo onto the page. Your photo stays on this device.</p>
              <p className="text-[11px] text-white/25 mt-3">JPG, PNG, or WebP</p>
            </div>
          </div>
        )}

      </div>

      {photoSrc && !photoDisabled && (
        <p className="text-xs text-white/25">
          Drag to move your photo · Pinch or use the buttons to resize
        </p>
      )}
    </div>
  );
}
