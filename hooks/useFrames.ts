"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { Frame, BrandingConfig } from "@/types";
import { buildPresetFrames } from "@/lib/frames";
import { generateCustomFrame, getCustomFramePhotoArea } from "@/lib/custom-frame";

const STORAGE_KEY = "event-studio-frames";

type StoredFrame = Omit<Frame, "imageUrl"> & { imageUrl?: string };

function hydrateFrame(frame: StoredFrame): Frame {
  if (!frame.customConfig) {
    return frame as Frame;
  }

  return {
    ...frame,
    event: frame.customConfig.eventName || frame.event,
    imageUrl: generateCustomFrame(frame.customConfig),
    photoArea: getCustomFramePhotoArea(frame.customConfig.layout),
    color: frame.customConfig.primaryColor,
  };
}

function serializeFrame(frame: Frame): StoredFrame {
  if (!frame.customConfig) return frame;

  const stored: StoredFrame = { ...frame };
  delete stored.imageUrl;
  return stored;
}

function loadCustomFrames(): Frame[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredFrame[]).map(hydrateFrame) : [];
  } catch {
    return [];
  }
}

function saveCustomFrames(frames: Frame[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(frames.map(serializeFrame)));
    return true;
  } catch {
    return false;
  }
}

export function useFrames(branding?: BrandingConfig) {
  const [customFrames, setCustomFrames] = useState<Frame[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setCustomFrames(loadCustomFrames());
      setIsLoaded(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  // Frames use inline SVG — rebuild whenever any branding field changes so the
  // live preview always reflects the latest event details.
  const presetFrames = useMemo(
    () => buildPresetFrames(branding),
    [branding]
  );

  const allFrames = useMemo(
    () => [...presetFrames, ...customFrames],
    [presetFrames, customFrames]
  );

  const addFrame = useCallback((data: Omit<Frame, "id" | "createdAt" | "category">): Frame | null => {
    const newFrame: Frame = {
      ...data,
      id: uuidv4(),
      category: "custom",
      createdAt: new Date().toISOString(),
    };
    let saved = false;
    setCustomFrames((prev) => {
      const updated = [newFrame, ...prev];
      saved = saveCustomFrames(updated);
      return saved ? updated : prev;
    });
    return saved ? newFrame : null;
  }, []);

  const deleteFrame = useCallback((id: string): boolean => {
    let saved = false;
    setCustomFrames((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      saved = saveCustomFrames(updated);
      return saved ? updated : prev;
    });
    return saved;
  }, []);

  return {
    allFrames,
    presetFrames,
    customFrames,
    isLoaded,
    addFrame,
    deleteFrame,
  };
}
