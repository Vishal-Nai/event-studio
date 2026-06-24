"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Share2,
  AlertCircle,
} from "lucide-react";

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { generateCaptions, formatCaptionForShare } from "@/lib/captions";
import { BrandingConfig } from "@/types";
import {
  buildLinkedInShareUrl,
  buildTwitterShareUrl,
  downloadDataUrl,
  copyImageToClipboard,
  openInNewTab,
} from "@/lib/share";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SharePanelProps {
  eventDetails: BrandingConfig;
  onExport: () => Promise<string>;
  hasPhoto: boolean;
  hasFrame: boolean;
  requiresPhoto?: boolean;
}

export function SharePanel({
  eventDetails,
  onExport,
  hasPhoto,
  hasFrame,
  requiresPhoto = true,
}: SharePanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [captionsOpen, setCaptionsOpen] = useState(true);
  const captions = useMemo(() => generateCaptions(eventDetails), [eventDetails]);
  const [selectedCaptionIdx, setSelectedCaptionIdx] = useState(0);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const safeCaptionIdx = selectedCaptionIdx % captions.length;

  const canExport = hasFrame && (requiresPhoto ? hasPhoto : true);
  const imageFileName = eventDetails.eventName
    ? `${eventDetails.eventName.toLowerCase().replace(/^\//, "").replace(/\s+/g, "-")}-photo.png`
    : "event-photo.png";

  const getExportedImage = useCallback(async (): Promise<string | null> => {
    if (!hasFrame) {
      toast.error("Choose a style before saving");
      return null;
    }
    if (requiresPhoto && !hasPhoto) {
      toast.error("Upload your photo first");
      return null;
    }
    setIsExporting(true);
    try {
      return await onExport();
    } catch {
      toast.error("Export failed. Please try again.");
      return null;
    } finally {
      setIsExporting(false);
    }
  }, [hasFrame, requiresPhoto, hasPhoto, onExport]);

  const handleDownload = async () => {
    const dataUrl = await getExportedImage();
    if (!dataUrl) return;
    downloadDataUrl(dataUrl, imageFileName);
    toast.success("Image saved!");
  };

  const handleCopyImage = async () => {
    const dataUrl = await getExportedImage();
    if (!dataUrl) return;
    try {
      await copyImageToClipboard(dataUrl);
      toast.success("Image copied!");
    } catch {
      toast.error("Copy not supported in this browser. Try downloading instead.");
    }
  };

  const handleLinkedIn = async () => {
    const dataUrl = await getExportedImage();
    if (!dataUrl) return;
    const caption = captions[safeCaptionIdx];
    const text = formatCaptionForShare(caption);
    downloadDataUrl(dataUrl, imageFileName);
    await copyCaptionForFallback(text);
    toast.info("Image saved and caption copied. Add the image to the LinkedIn post that opens.");
    setTimeout(() => {
      openInNewTab(buildLinkedInShareUrl());
    }, 800);
  };

  const handleTwitter = async () => {
    const dataUrl = await getExportedImage();
    if (!dataUrl) return;
    const caption = captions[safeCaptionIdx];
    const text = formatCaptionForShare(caption);
    downloadDataUrl(dataUrl, imageFileName);
    await copyCaptionForFallback(text);
    toast.info("Image saved and caption copied. Add the image to the X post that opens.");
    setTimeout(() => {
      openInNewTab(buildTwitterShareUrl(caption.text, caption.hashtags));
    }, 800);
  };

  const copyCaptionForFallback = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // The social compose fallback still opens even if clipboard permission is denied.
    }
  };

  const handleCopyCaption = async () => {
    const caption = captions[safeCaptionIdx];
    const text = formatCaptionForShare(caption);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCaption(true);
      toast.success("Caption copied!");
      setTimeout(() => setCopiedCaption(false), 2000);
    } catch {
      toast.error("Could not copy caption. Try selecting the text manually.");
    }
  };

  const nextCaption = () => {
    setSelectedCaptionIdx((i) => (i + 1) % captions.length);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
          <Share2 className="w-3 h-3" />
          Save & post
        </span>

        {!hasFrame && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-300/70">Choose a style before saving</p>
          </div>
        )}

        {hasFrame && requiresPhoto && !hasPhoto && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-300/70">Upload your photo to save this post</p>
          </div>
        )}

        <Button
          onClick={handleDownload}
          disabled={isExporting || !canExport}
          className="w-full bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white font-semibold shadow-lg shadow-violet-500/15 disabled:opacity-40"
        >
          {isExporting ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Save image
            </span>
          )}
        </Button>

        <Button
          onClick={handleCopyImage}
          disabled={isExporting || !canExport}
          variant="outline"
          className="w-full glass border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06] disabled:opacity-40"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy image
        </Button>

        <Separator className="bg-white/[0.06]" />

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleLinkedIn}
            disabled={isExporting || !canExport}
            className={cn(
              "flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-sm font-medium",
              "border-[#0077b5]/30 bg-[#0077b5]/10 text-[#0a8fcc] hover:bg-[#0077b5]/20 hover:border-[#0077b5]/50",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
          >
            <LinkedInIcon />
            LinkedIn
          </button>
          <button
            type="button"
            onClick={handleTwitter}
            disabled={isExporting || !canExport}
            className={cn(
              "flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-sm font-medium",
              "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
          >
            <XIcon />
            X / Twitter
          </button>
        </div>

        <p className="text-[10px] text-white/25 text-center leading-relaxed">
          We save the image, copy the caption, then open the selected platform.
        </p>
      </div>

      <Separator className="bg-white/[0.06]" />

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setCaptionsOpen(!captionsOpen)}
          aria-expanded={captionsOpen}
          className="w-full flex items-center justify-between text-xs font-semibold text-white/50 uppercase tracking-widest hover:text-white/70 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Suggested caption
          </span>
          {captionsOpen
            ? <ChevronUp className="w-3.5 h-3.5" />
            : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <AnimatePresence>
          {captionsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-1">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                  <p className="text-xs text-white/70 leading-relaxed">{captions[safeCaptionIdx].text}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {captions[safeCaptionIdx].hashtags.map((tag) => (
                      <span key={tag} className="text-[10px] text-violet-400 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCaption}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                      copiedCaption
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "glass border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.07]"
                    )}
                  >
                    {copiedCaption ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCaption ? "Copied!" : "Copy caption"}
                  </button>
                  <button
                    type="button"
                    onClick={nextCaption}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium glass border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.07] transition-all"
                    title="Next caption"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Next
                  </button>
                </div>

                <div className="flex gap-1.5 justify-center">
                  {captions.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedCaptionIdx(i)}
                      aria-label={`Caption ${i + 1} of ${captions.length}`}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all",
                        i === safeCaptionIdx
                          ? "bg-violet-400 scale-125"
                          : "bg-white/20 hover:bg-white/40"
                      )}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
