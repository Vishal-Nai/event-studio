"use client";

import { useMemo } from "react";
import { BrandingConfig } from "@/types";
import { buildPresetFrames } from "@/lib/frames";

export function useFrames(branding?: BrandingConfig) {
  // Frames use inline SVG — rebuild whenever any branding field changes so the
  // live preview always reflects the latest event details.
  const presetFrames = useMemo(
    () => buildPresetFrames(branding),
    [branding]
  );

  return {
    allFrames: presetFrames,
    presetFrames,
    isLoaded: true,
  };
}
