"use client";

import { useState, useCallback } from "react";
import { EditorTransform } from "@/types";

const DEFAULT_TRANSFORM: EditorTransform = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
};

const MIN_SCALE = 0.1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.1;
const ROTATE_STEP = 90;

export function usePhotoEditor() {
  const [transform, setTransform] = useState<EditorTransform>(DEFAULT_TRANSFORM);
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  const updateTransform = useCallback((updates: Partial<EditorTransform>) => {
    setTransform((prev) => ({
      ...prev,
      ...updates,
      scale: updates.scale !== undefined
        ? Math.min(MAX_SCALE, Math.max(MIN_SCALE, updates.scale))
        : prev.scale,
    }));
  }, []);

  const zoomIn = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(MAX_SCALE, prev.scale + ZOOM_STEP),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(MIN_SCALE, prev.scale - ZOOM_STEP),
    }));
  }, []);

  const rotateClockwise = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      rotation: (prev.rotation + ROTATE_STEP) % 360,
    }));
  }, []);

  const rotateCounterClockwise = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      rotation: (prev.rotation - ROTATE_STEP + 360) % 360,
    }));
  }, []);

  const autoCenter = useCallback(() => {
    setTransform((prev) => ({ ...prev, x: 0, y: 0 }));
  }, []);

  const autoFit = useCallback(
    (photoWidth: number, photoHeight: number, canvasWidth: number, canvasHeight: number) => {
      const scaleX = canvasWidth / photoWidth;
      const scaleY = canvasHeight / photoHeight;
      const fitScale = Math.max(scaleX, scaleY);
      setTransform((prev) => ({ ...prev, x: 0, y: 0, scale: fitScale }));
    },
    []
  );

  const autoFitContain = useCallback(
    (photoWidth: number, photoHeight: number, canvasWidth: number, canvasHeight: number) => {
      const scaleX = canvasWidth / photoWidth;
      const scaleY = canvasHeight / photoHeight;
      const fitScale = Math.min(scaleX, scaleY);
      setTransform((prev) => ({ ...prev, x: 0, y: 0, scale: fitScale }));
    },
    []
  );


  const loadPhoto = useCallback((src: string) => {
    setPhotoSrc(src);
    setTransform(DEFAULT_TRANSFORM);
  }, []);

  const clearPhoto = useCallback(() => {
    setPhotoSrc(null);
    setTransform(DEFAULT_TRANSFORM);
  }, []);

  return {
    transform,
    photoSrc,
    updateTransform,
    zoomIn,
    zoomOut,
    rotateClockwise,
    rotateCounterClockwise,
    autoCenter,
    autoFit,
    autoFitContain,
    loadPhoto,
    clearPhoto,
    minScale: MIN_SCALE,
    maxScale: MAX_SCALE,
  };
}
