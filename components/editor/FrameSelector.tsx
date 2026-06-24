"use client";

import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { Frame } from "@/types";
import { drawComposite, getCanvasDisplaySize, loadImage, toCanvasArea } from "@/lib/canvas";
import { cn } from "@/lib/utils";

interface FrameSelectorProps {
  frames: Frame[];
  selectedFrameId: string | null;
  onSelectFrame: (frame: Frame) => void;
  variant?: "sidebar" | "banner";
  previewPhotoSrc?: string | null;
}

export function FrameSelectorInner({
  frames,
  selectedFrameId,
  onSelectFrame,
  variant = "sidebar",
  previewPhotoSrc,
}: FrameSelectorProps) {
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const isBanner = variant === "banner";
  const thumbSize = isBanner ? "" : "";

  useEffect(() => {
    if (!previewPhotoSrc) {
      const id = window.setTimeout(() => setPreviews({}), 0);
      return () => window.clearTimeout(id);
    }

    let cancelled = false;
    const photoSrc = previewPhotoSrc;
    async function buildPreviews() {
      try {
        const photo = await loadImage(photoSrc);
        const entries = await Promise.all(
          frames.map(async (frame) => {
            if (frame.photoArea === null) return [frame.id, frame.imageUrl] as const;
            const frameImage = await loadImage(frame.imageUrl);
            const display = getCanvasDisplaySize(frame.aspectRatio);
            const canvas = document.createElement("canvas");
            canvas.width = 280;
            canvas.height = Math.round(280 * (display.height / display.width));
            const area = toCanvasArea(frame.photoArea, frame.aspectRatio);
            const isPortrait = photo.naturalHeight > photo.naturalWidth;
            const scale = isPortrait
              ? area.width / photo.naturalWidth
              : Math.max(area.width / photo.naturalWidth, area.height / photo.naturalHeight);
            drawComposite(canvas, {
              photo,
              frame: frameImage,
              transform: { x: 0, y: isPortrait ? photo.naturalHeight * scale * 0.13 : 0, scale, rotation: 0 },
              canvasWidth: canvas.width,
              canvasHeight: canvas.height,
              aspectRatio: frame.aspectRatio,
              photoArea: frame.photoArea,
            });
            return [frame.id, canvas.toDataURL("image/png", 0.85)] as const;
          })
        );
        if (!cancelled) setPreviews(Object.fromEntries(entries));
      } catch {
        if (!cancelled) setPreviews({});
      }
    }

    buildPreviews();
    return () => { cancelled = true; };
  }, [frames, previewPhotoSrc]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <div
          className={cn(
            "grid gap-2.5",
            isBanner ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-2" : "grid-cols-2"
          )}
        >
          {frames.map((frame) => {
            const isSelected = selectedFrameId === frame.id;
            return (
              <motion.button
                key={frame.id}
                type="button"
                onClick={() => onSelectFrame(frame)}
                className={cn("relative flex flex-col gap-1.5 items-center min-w-0", thumbSize)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                aria-label={frame.name}
                aria-pressed={isSelected}
                title={frame.description ?? frame.name}
              >
                <div
                  className={cn(
                    "w-full rounded-xl overflow-hidden border-2 transition-all relative",
                    isSelected
                      ? "border-violet-500 ring-2 ring-violet-500/40"
                      : "border-white/10 hover:border-white/25"
                  )}
                  style={{
                    aspectRatio: frame.aspectRatio === "16:9" ? "16 / 9" : frame.aspectRatio === "4:5" ? "4 / 5" : "1 / 1",
                  }}
                >
                  <div className="absolute inset-0 bg-[#111118]" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previews[frame.id] ?? frame.imageUrl}
                    alt={frame.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  )}
                  {frame.category === "preset" && (
                    <div className="absolute bottom-0.5 right-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-yellow-400 drop-shadow" />
                    </div>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] text-center leading-tight w-full truncate transition-colors",
                    isSelected ? "text-violet-400 font-medium" : "text-white/35"
                  )}
                >
                  {frame.name}
                </span>
              </motion.button>
            );
          })}

        </div>
      </div>

      {selectedFrameId && (
        <motion.div
          key={selectedFrameId}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"
        >
          {(() => {
            const frame = frames.find((f) => f.id === selectedFrameId);
            if (!frame) return null;
            return (
              <div className="flex items-start gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: frame.color ?? "#7c3aed" }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white/70">{frame.name}</p>
                  {frame.description && (
                    <p className="text-[10px] text-white/30 leading-snug mt-0.5">{frame.description}</p>
                  )}
                  {!frame.description && (
                    <p className="text-[10px] text-white/30 capitalize">Ready-made</p>
                  )}
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}

export const FrameSelector = memo(FrameSelectorInner);
