"use client";

import { useRef, useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Eye, Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { usePhotoEditor } from "@/hooks/usePhotoEditor";
import { useFrames } from "@/hooks/useFrames";
import { useBranding } from "@/hooks/useBranding";
import {
  drawComposite,
  getPortraitFocusOffset,
  loadImage,
  toCanvasArea,
  exportCanvas,
} from "@/lib/canvas";
import { validateImageFile, readFileAsDataUrl } from "@/lib/image-utils";
import { downloadDataUrl } from "@/lib/share";
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

  const {
    config: branding,
    updateConfig: updateBranding,
    resetConfig: resetBranding,
  } = useBranding();
  const { allFrames, isLoaded } = useFrames(branding);

  const {
    transform,
    photoSrc,
    updateTransform,
    autoFit,
    autoFitContain,
    loadPhoto,
    minScale,
    maxScale,
  } = usePhotoEditor();

  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(
    frameParam ?? null,
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorPreviewRef = useRef<HTMLDivElement>(null);
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
  const requiresPhoto =
    selectedFrame != null && selectedFrame.photoArea !== null;
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
        aspectRatio,
        photoArea: selectedFrame?.photoArea,
      });
    });
  }, [aspectRatio, transform, selectedFrame?.photoArea]);
  const renderRef = useRef(render);

  useEffect(() => {
    renderRef.current = render;
  }, [render]);

  useEffect(() => {
    render();
  }, [render]);

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
        setSelectedFrameId(allFrames[0]?.id ?? null);
      }
    }, 0);

    return () => window.clearTimeout(id);
  }, [frameParam, isLoaded, allFrames]);

  useEffect(() => {
    if (!selectedFrame?.imageUrl) {
      frameImgRef.current = null;
      renderRef.current();
      return;
    }
    const loadId = ++frameLoadIdRef.current;
    loadImage(selectedFrame.imageUrl)
      .then((img) => {
        if (loadId !== frameLoadIdRef.current) return;
        frameImgRef.current = img;
        renderRef.current();
      })
      .catch(() => {
        if (loadId !== frameLoadIdRef.current) return;
        toast.error("Failed to load frame preview.");
      });
  }, [selectedFrame?.imageUrl]);

  useEffect(() => {
    if (!photoSrc) {
      photoImgRef.current = null;
      renderRef.current();
      return;
    }
    const loadId = ++photoLoadIdRef.current;
    loadImage(photoSrc)
      .then((img) => {
        if (loadId !== photoLoadIdRef.current) return;
        photoImgRef.current = img;
        const area = toCanvasArea(selectedFrame?.photoArea, aspectRatio);
        const isPortrait = img.naturalHeight > img.naturalWidth;
        if (isPortrait && selectedFrame?.photoArea !== null) {
          const scale = area.width / img.naturalWidth;
          updateTransform({
            x: 0,
            y: getPortraitFocusOffset(img.naturalHeight, scale, area.height),
            scale,
          });
        } else {
          autoFit(img.naturalWidth, img.naturalHeight, area.width, area.height);
        }
        renderRef.current();
      })
      .catch(() => {
        if (loadId !== photoLoadIdRef.current) return;
        toast.error("Failed to load photo. Try a different image.");
      });
  }, [
    photoSrc,
    selectedFrame?.id,
    selectedFrame?.photoArea,
    aspectRatio,
    autoFit,
    updateTransform,
  ]);

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
    [loadPhoto],
  );

  const handleSelectFrame = useCallback((frame: Frame) => {
    userOverrodeSelectionRef.current = true;
    setSelectedFrameId(frame.id || null);
    window.requestAnimationFrame(() => {
      editorPreviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const handleUploadPhoto = useCallback(() => {
    uploadInputRef.current?.click();
  }, []);

  const handleFitIntoFrame = useCallback(() => {
    const photo = photoImgRef.current;
    if (!photo) return;
    const area = toCanvasArea(selectedFrame?.photoArea, aspectRatio);
    autoFitContain(
      photo.naturalWidth,
      photo.naturalHeight,
      area.width,
      area.height,
    );
  }, [aspectRatio, autoFitContain, selectedFrame?.photoArea]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processImageFile(file);
      e.target.value = "";
    },
    [processImageFile],
  );

  const handleExport = useCallback(async (): Promise<string> => {
    return exportCanvas(
      photoImgRef.current,
      frameImgRef.current,
      transform,
      aspectRatio,
      selectedFrame?.photoArea,
    );
  }, [transform, aspectRatio, selectedFrame?.photoArea]);

  const handlePreview = useCallback(async () => {
    if (!selectedFrame) {
      toast.error("Choose a frame first");
      return;
    }
    if (requiresPhoto && !photoImgRef.current) {
      toast.error("Upload your photo first");
      return;
    }

    setIsPreviewing(true);
    try {
      const dataUrl = await handleExport();
      setPreviewImage(dataUrl);
    } catch {
      toast.error("Could not generate preview.");
    } finally {
      setIsPreviewing(false);
    }
  }, [handleExport, requiresPhoto, selectedFrame]);

  const handleDownloadPreview = useCallback(() => {
    if (!previewImage) return;
    downloadDataUrl(
      previewImage,
      `${(branding.eventName || "event-post").toLowerCase().replace(/^\//, "").replace(/\s+/g, "-")}-preview.png`,
    );
  }, [branding.eventName, previewImage]);

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
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {isDragActive && (
        <div className="fixed inset-0 z-50 bg-violet-500/10 border-4 border-violet-500 flex items-center justify-center pointer-events-none">
          <div className="glass-card rounded-2xl px-8 py-6 text-center">
            <Upload className="w-10 h-10 text-violet-400 mx-auto mb-3" />
            <p className="text-white font-semibold text-lg">
              Drop your photo here
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div>
            <p className="text-sm font-semibold text-violet-400 tracking-widest uppercase mb-1">
              Make a post
            </p>
            <h1 className="text-2xl sm:text-4xl font-bold text-white">
              Start with your best photo
            </h1>
            <p className="text-white/45 text-sm mt-2 max-w-2xl">
              Upload once, try different event styles, then save a ready-to-post
              image for LinkedIn, X, or WhatsApp.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_260px] gap-5 items-start">
          {/* Left column: choose style + adjust */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-5 order-2 xl:order-1"
          >
            <div className="glass-card rounded-3xl p-4 sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest">
                    Step 2
                  </p>
                  <h2 className="text-base font-semibold text-white">
                    Choose a fixed frame
                  </h2>
                </div>
              </div>
              <FrameSelector
                variant="banner"
                frames={allFrames}
                selectedFrameId={selectedFrameId}
                onSelectFrame={handleSelectFrame}
                previewPhotoSrc={photoSrc}
              />
            </div>
          </motion.div>

          {/* Center column: photo */}
          <motion.div
            ref={editorPreviewRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-3xl p-4 sm:p-6 order-1 xl:order-2"
          >
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest">
                  Step 1
                </p>
                <h2 className="text-lg font-semibold text-white">
                  Add your photo
                </h2>
                <p className="text-sm text-white/40">
                  Click the preview or drop a photo anywhere on this page.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleUploadPhoto}
                  disabled={selectedFrame?.photoArea === null}
                  className="flex w-fit items-center gap-2 rounded-full bg-violet-500/15 border border-violet-400/25 px-3 py-1.5 text-xs font-semibold text-violet-100 transition-colors hover:bg-violet-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {photoSrc ? "Change photo" : "Upload photo"}
                </button>
                {photoSrc && (
                  <button
                    type="button"
                    onClick={handlePreview}
                    disabled={
                      isPreviewing ||
                      !selectedFrame ||
                      (requiresPhoto && !photoSrc)
                    }
                    className="flex w-fit items-center gap-2 rounded-full glass border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/65 transition-colors hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {isPreviewing ? "Preparing..." : "Preview"}
                  </button>
                )}
              </div>
            </div>
            <PhotoCanvas
              photoSrc={photoSrc}
              transform={transform}
              aspectRatio={aspectRatio}
              photoArea={selectedFrame?.photoArea}
              photoDisabled={selectedFrame?.photoArea === null}
              onTransformChange={updateTransform}
              onRequestUpload={handleUploadPhoto}
              canvasRef={canvasRef}
            />
            <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              {selectedFrame?.photoArea === null && (
                <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-white/45 leading-relaxed">
                  This frame is text-only. You can save it without a photo.
                </div>
              )}
              <EditorControls
                scale={transform.scale}
                hasPhoto={!!photoSrc}
                photoDisabled={selectedFrame?.photoArea === null}
                onScaleChange={(scale) => updateTransform({ scale })}
                onFitIntoFrame={handleFitIntoFrame}
                minScale={minScale}
                maxScale={maxScale}
              />
              <div className="mt-4 border-t border-white/[0.06] pt-4">
                <BrandingPanel
                  config={branding}
                  onChange={updateBranding}
                  onReset={resetBranding}
                />
              </div>
            </div>
          </motion.div>

          {/* Right column: save & post */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-3xl p-5 order-3 xl:sticky xl:top-24"
          >
            <div className="mb-4">
              <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest">
                Step 3
              </p>
              <h2 className="text-base font-semibold text-white">
                Save and post
              </h2>
            </div>
            <SharePanel
              eventDetails={branding}
              onExport={handleExport}
              hasPhoto={!!photoSrc}
              hasFrame={!!selectedFrame}
              requiresPhoto={requiresPhoto}
            />
          </motion.div>
        </div>
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-6xl rounded-3xl border border-white/10 bg-[#08090d] p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-300">
                  Preview
                </p>
                <h2 className="text-sm font-semibold text-white">
                  Final generated image
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPreview}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"
                  aria-label="Close preview"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Generated event post preview"
              className="max-h-[78vh] w-full rounded-2xl border border-white/10 object-contain"
            />
          </div>
        </div>
      )}
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
