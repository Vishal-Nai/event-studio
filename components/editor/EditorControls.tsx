"use client";

import { ZoomIn, ZoomOut, RotateCcw, RotateCw, Maximize2, Minimize2, Crosshair, Trash2, Upload } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface EditorControlsProps {
  scale: number;
  rotation: number;
  hasPhoto: boolean;
  photoDisabled?: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateCW: () => void;
  onRotateCCW: () => void;
  onAutoCenter: () => void;
  onAutoFit: () => void;
  onAutoFitContain: () => void;
  onClearPhoto: () => void;
  onUploadPhoto: () => void;
  onScaleChange: (scale: number) => void;
  minScale: number;
  maxScale: number;
}

interface ControlButtonProps {
  onClick: () => void;
  disabled?: boolean;
  tooltip: string;
  label: string;
  children: React.ReactNode;
  variant?: "default" | "danger";
}

function ControlButton({ onClick, disabled, tooltip, label, children, variant = "default" }: ControlButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              "h-10 rounded-xl flex items-center justify-center gap-2 transition-all text-sm",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              variant === "danger"
                ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                : "text-white/60 hover:bg-white/[0.08] hover:text-white"
            )}
          />
        }
      >
        {children}
        <span className="text-xs font-medium">{label}</span>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export function EditorControls({
  scale,
  rotation,
  hasPhoto,
  photoDisabled = false,
  onZoomIn,
  onZoomOut,
  onRotateCW,
  onRotateCCW,
  onAutoCenter,
  onAutoFit,
  onAutoFitContain,
  onClearPhoto,
  onUploadPhoto,
  onScaleChange,
  minScale,
  maxScale,
}: EditorControlsProps) {
  const scalePercent = Math.round(scale * 100);
  const controlsDisabled = !hasPhoto || photoDisabled;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white/50">Photo size</span>
          <span className="text-xs font-mono text-white/40">{scalePercent}%</span>
        </div>
        <input
          type="range"
          min={minScale * 100}
          max={maxScale * 100}
          step={1}
          value={scalePercent}
          onChange={(e) => onScaleChange(Number(e.target.value) / 100)}
          disabled={controlsDisabled}
          aria-label="Photo zoom"
          className="w-full h-1.5 appearance-none rounded-full cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, rgb(139 92 246) 0%, rgb(139 92 246) ${((scalePercent - minScale * 100) / ((maxScale - minScale) * 100)) * 100}%, rgba(255,255,255,0.1) ${((scalePercent - minScale * 100) / ((maxScale - minScale) * 100)) * 100}%, rgba(255,255,255,0.1) 100%)`,
          }}
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      <div className="grid grid-cols-2 gap-2">
        <ControlButton onClick={onZoomIn} disabled={controlsDisabled} tooltip="Make photo bigger" label="Bigger">
          <ZoomIn className="w-4 h-4" />
        </ControlButton>
        <ControlButton onClick={onZoomOut} disabled={controlsDisabled} tooltip="Make photo smaller" label="Smaller">
          <ZoomOut className="w-4 h-4" />
        </ControlButton>
        <ControlButton onClick={onRotateCCW} disabled={controlsDisabled} tooltip="Rotate left" label="Left">
          <RotateCcw className="w-4 h-4" />
        </ControlButton>
        <ControlButton onClick={onRotateCW} disabled={controlsDisabled} tooltip="Rotate right" label="Right">
          <RotateCw className="w-4 h-4" />
        </ControlButton>
        <ControlButton onClick={onAutoCenter} disabled={controlsDisabled} tooltip="Center photo" label="Center">
          <Crosshair className="w-4 h-4" />
        </ControlButton>
        <ControlButton onClick={onAutoFit} disabled={controlsDisabled} tooltip="Fill the style" label="Fill">
          <Maximize2 className="w-4 h-4" />
        </ControlButton>
        <ControlButton onClick={onAutoFitContain} disabled={controlsDisabled} tooltip="Fit whole photo" label="Fit">
          <Minimize2 className="w-4 h-4" />
        </ControlButton>
        <ControlButton onClick={onUploadPhoto} disabled={photoDisabled} tooltip="Choose another photo" label="Change">
          <Upload className="w-4 h-4" />
        </ControlButton>
        <ControlButton onClick={onClearPhoto} disabled={controlsDisabled} tooltip="Remove photo" label="Remove" variant="danger">
          <Trash2 className="w-4 h-4" />
        </ControlButton>
      </div>

      {hasPhoto && rotation !== 0 && !photoDisabled && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          <RotateCw className="w-3.5 h-3.5 text-white/30" />
          <span className="text-xs text-white/40">Rotation: {rotation}°</span>
        </div>
      )}
    </div>
  );
}
