"use client";

import { Maximize2 } from "lucide-react";

interface EditorControlsProps {
  scale: number;
  hasPhoto: boolean;
  photoDisabled?: boolean;
  onScaleChange: (scale: number) => void;
  onFitIntoFrame: () => void;
  minScale: number;
  maxScale: number;
}

export function EditorControls({
  scale,
  hasPhoto,
  photoDisabled = false,
  onScaleChange,
  onFitIntoFrame,
  minScale,
  maxScale,
}: EditorControlsProps) {
  const scalePercent = Math.round(scale * 100);
  const active = hasPhoto && !photoDisabled;
  const progress = Math.max(
    0,
    Math.min(100, ((scale - minScale) / (maxScale - minScale)) * 100)
  );

  return (
    <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-white/60">Photo size</p>
          <p className="text-[11px] text-white/30">
            {active ? "Drag to reposition. Scroll or pinch to zoom." : "Upload a photo to adjust it inside the frame."}
          </p>
        </div>
        <button
          type="button"
          onClick={onFitIntoFrame}
          disabled={!active}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Fit into frame
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/35">Resize</span>
          <span className="text-[11px] font-mono text-white/35">{scalePercent}%</span>
        </div>
        <input
          type="range"
          min={minScale * 100}
          max={maxScale * 100}
          step={1}
          value={scalePercent}
          onChange={(e) => onScaleChange(Number(e.target.value) / 100)}
          disabled={!active}
          aria-label="Photo zoom"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed disabled:opacity-35"
          style={{
            background: `linear-gradient(to right, rgb(139 92 246) 0%, rgb(139 92 246) ${progress}%, rgba(255,255,255,0.10) ${progress}%, rgba(255,255,255,0.10) 100%)`,
          }}
        />
      </div>
    </div>
  );
}
