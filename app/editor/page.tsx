"use client";

import { useRef, useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Layers, Plus, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { usePhotoEditor } from "@/hooks/usePhotoEditor";
import { useFrames } from "@/hooks/useFrames";
import { useBranding } from "@/hooks/useBranding";
import { drawComposite, loadImage, toCanvasArea, exportCanvas } from "@/lib/canvas";
import { validateImageFile, readFileAsDataUrl } from "@/lib/image-utils";
import { Frame, AspectRatio } from "@/types";

import { PhotoCanvas } from "@/components/editor/PhotoCanvas";
import { EditorControls } from "@/components/editor/EditorControls";
import { FrameSelector } from "@/components/editor/FrameSelector";
import { SharePanel } from "@/components/editor/SharePanel";
import { BrandingPanel } from "@/components/editor/BrandingPanel";
import { toast } from "sonner";

function EditorContent() {
  const searchParams = useSearchParams();
  const frameParam = searchParams.get("frame");

  const { config: branding, updateConfig: updateBranding, resetConfig: resetBranding } = useBranding();
  const { allFrames, isLoaded } = useFrames(branding);

  const {
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
    minScale,
    maxScale,
  } = usePhotoEditor();

  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(frameParam ?? null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoImgRef = useRef<HTMLImageElement | null>(null);
  const frameImgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number>(0);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const photoLoadIdRef = useRef(0);
  const frameLoadIdRef = useRef(0);
  const userOverrodeSelectionRef = useRef(false);
  const prevFrameParamRef = useRef(frameParam);
  const invalidFrameToastRef = useRef(false);

  const selectedFrame = allFrames.find((f) => f.id === selectedFrameId) ?? null;
  const aspectRatio: AspectRatio = selectedFrame?.aspectRatio ?? "1:1";
  const requiresPhoto = selectedFrame != null && selectedFrame.photoArea !== null;

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      drawComposite(canvas, {
        photo: photoImgRef.current,
        frame: frameImgRef.current,
        transform,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        photoArea: selectedFrame?.photoArea,
      });
    });
  }, [transform, selectedFrame?.photoArea]);

  useEffect(() => { render(); }, [render]);

  // New navigation via ?frame= param resets manual override
  useEffect(() => {
    if (frameParam !== prevFrameParamRef.current) {
      prevFrameParamRef.current = frameParam;
      userOverrodeSelectionRef.current = false;
      invalidFrameToastRef.current = false;
    }
  }, [frameParam]);

  // Sync selection from URL unless user picked/cleared a frame manually
  useEffect(() => {
    if (!isLoaded || userOverrodeSelectionRef.current) return;

    const id = window.setTimeout(() => {
      if (frameParam && allFrames.some((f) => f.id === frameParam)) {
        setSelectedFrameId(frameParam);
        return;
      }

      if (frameParam && !invalidFrameToastRef.current) {
        invalidFrameToastRef.current = true;
        toast.error("Frame not found — pick one from the gallery.");
        setSelectedFrameId(null);
        return;
      }

      if (!frameParam) {
        setSelectedFrameId(null);
      }
    }, 0);

    return () => window.clearTimeout(id);
  }, [frameParam, isLoaded, allFrames]);

  useEffect(() => {
    if (!selectedFrame?.imageUrl) {
      frameImgRef.current = null;
      render();
      return;
    }
    const loadId = ++frameLoadIdRef.current;
    loadImage(selectedFrame.imageUrl)
      .then((img) => {
        if (loadId !== frameLoadIdRef.current) return;
        frameImgRef.current = img;
        render();
      })
      .catch(() => {
        if (loadId !== frameLoadIdRef.current) return;
        toast.error("Failed to load frame preview.");
      });
  }, [selectedFrame?.imageUrl, render]);

  useEffect(() => {
    if (!photoSrc) {
      photoImgRef.current = null;
      render();
      return;
    }
    const loadId = ++photoLoadIdRef.current;
    loadImage(photoSrc)
      .then((img) => {
        if (loadId !== photoLoadIdRef.current) return;
        photoImgRef.current = img;
        const area = toCanvasArea(selectedFrame?.photoArea);
        autoFit(img.naturalWidth, img.naturalHeight, area.width, area.height);
        render();
      })
      .catch(() => {
        if (loadId !== photoLoadIdRef.current) return;
        toast.error("Failed to load photo. Try a different image.");
      });
  }, [photoSrc, selectedFrame?.photoArea, autoFit, render]);

  const processImageFile = useCallback(
    async (file: File) => {
      const error = validateImageFile(file);
      if (error) {
        toast.error(error);
        return;
      }
      try {
        const dataUrl = await readFileAsDataUrl(file);
        loadPhoto(dataUrl);
      } catch {
        toast.error("Could not read image file.");
      }
    },
    [loadPhoto]
  );

  const handleAutoFitButton = useCallback(() => {
    const photo = photoImgRef.current;
    if (!photo) return;
    const area = toCanvasArea(selectedFrame?.photoArea);
    autoFit(photo.naturalWidth, photo.naturalHeight, area.width, area.height);
  }, [autoFit, selectedFrame?.photoArea]);

  const handleAutoFitContain = useCallback(() => {
    const photo = photoImgRef.current;
    if (!photo) return;
    const area = toCanvasArea(selectedFrame?.photoArea);
    autoFitContain(photo.naturalWidth, photo.naturalHeight, area.width, area.height);
  }, [autoFitContain, selectedFrame?.photoArea]);

  const handleSelectFrame = useCallback((frame: Frame) => {
    userOverrodeSelectionRef.current = true;
    setSelectedFrameId(frame.id || null);
  }, []);

  const handleClearFrame = useCallback(() => {
    userOverrodeSelectionRef.current = true;
    setSelectedFrameId(null);
  }, []);

  const handleUploadPhoto = useCallback(() => { uploadInputRef.current?.click(); }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processImageFile(file);
      e.target.value = "";
    },
    [processImageFile]
  );

  const handleExport = useCallback(async (): Promise<string> => {
    return exportCanvas(
      photoImgRef.current,
      frameImgRef.current,
      transform,
      aspectRatio,
      selectedFrame?.photoArea
    );
  }, [transform, aspectRatio, selectedFrame?.photoArea]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      const file = files[0];
      if (file) processImageFile(file);
    },
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    noClick: true,
    multiple: false,
    disabled: selectedFrame?.photoArea === null,
  });

  return (
    <div className="min-h-screen px-4 py-8" {...getRootProps()}>
      <input {...getInputProps()} />
      <input ref={uploadInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />

      {isDragActive && (
        <div className="fixed inset-0 z-50 bg-violet-500/10 border-4 border-violet-500 flex items-center justify-center pointer-events-none">
          <div className="glass-card rounded-2xl px-8 py-6 text-center">
            <Upload className="w-10 h-10 text-violet-400 mx-auto mb-3" />
            <p className="text-white font-semibold text-lg">Drop your photo here</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-violet-400 tracking-widest uppercase mb-1">Make a post</p>
            <h1 className="text-2xl sm:text-4xl font-bold text-white">Start with your best photo</h1>
            <p className="text-white/45 text-sm mt-2 max-w-2xl">
              Upload once, try different event styles, then save a ready-to-post image for LinkedIn, X, or WhatsApp.
            </p>
          </div>
          <Link
            href="/frames?create=1"
            className="inline-flex w-fit items-center gap-1.5 rounded-xl glass border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            <Plus className="w-4 h-4" />
            Create a new style
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)_320px] gap-5 items-start">
          {/* Left column: choose style + adjust */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-5 order-2 lg:order-1"
          >
            <div className="glass-card rounded-3xl p-4 sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest">Step 2</p>
                  <h2 className="text-base font-semibold text-white">Try a style</h2>
                </div>
                <Link
                  href="/frames"
                  className="text-xs font-semibold text-violet-300 transition-colors hover:text-violet-200 whitespace-nowrap"
                >
                  Browse all
                </Link>
              </div>
              <FrameSelector
                variant="banner"
                frames={allFrames}
                selectedFrameId={selectedFrameId}
                onSelectFrame={handleSelectFrame}
                onClearFrame={handleClearFrame}
              />
            </div>

            <div className="glass-card rounded-3xl p-4 sm:p-5">
              <div className="mb-4">
                <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest">Step 3</p>
                <h2 className="text-base font-semibold text-white">Make it fit</h2>
              </div>

              {selectedFrame?.photoArea === null && (
                <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-white/45 leading-relaxed">
                  This style is text-only, so you can save it without uploading a photo.
                </div>
              )}

              <EditorControls
                scale={transform.scale}
                rotation={transform.rotation}
                hasPhoto={!!photoSrc}
                photoDisabled={selectedFrame?.photoArea === null}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onRotateCW={rotateClockwise}
                onRotateCCW={rotateCounterClockwise}
                onAutoCenter={autoCenter}
                onAutoFit={handleAutoFitButton}
                onAutoFitContain={handleAutoFitContain}
                onClearPhoto={clearPhoto}
                onUploadPhoto={handleUploadPhoto}
                onScaleChange={(s) => updateTransform({ scale: s })}
                minScale={minScale}
                maxScale={maxScale}
              />
            </div>

            <div className="glass-card rounded-3xl p-4 sm:p-5">
              <BrandingPanel
                config={branding}
                onChange={updateBranding}
                onReset={resetBranding}
              />
            </div>
          </motion.div>

          {/* Center column: photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-3xl p-4 sm:p-6 order-1 lg:order-2"
          >
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest">Step 1</p>
                <h2 className="text-lg font-semibold text-white">Add your photo</h2>
                <p className="text-sm text-white/40">Click the preview or drop a photo anywhere on this page.</p>
              </div>
              {selectedFrame && (
                <div className="flex w-fit items-center gap-2 rounded-full glass border border-white/10 px-3 py-1.5">
                  <Layers className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-xs text-white/65">{selectedFrame.name}</span>
                </div>
              )}
            </div>
            <PhotoCanvas
              photoSrc={photoSrc}
              transform={transform}
              photoDisabled={selectedFrame?.photoArea === null}
              onTransformChange={updateTransform}
              onRequestUpload={handleUploadPhoto}
              canvasRef={canvasRef}
            />
          </motion.div>

          {/* Right column: save & post */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-3xl p-5 order-3 lg:sticky lg:top-24"
          >
            <div className="mb-4">
              <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest">Step 4</p>
              <h2 className="text-base font-semibold text-white">Save and post</h2>
            </div>
            <SharePanel
              eventName={selectedFrame?.event ?? branding.eventName}
              onExport={handleExport}
              hasPhoto={!!photoSrc}
              hasFrame={!!selectedFrame}
              requiresPhoto={requiresPhoto}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white/40 text-sm">Loading editor...</div>
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
