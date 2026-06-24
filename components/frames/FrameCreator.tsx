"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, Move } from "lucide-react";
import { useFrames } from "@/hooks/useFrames";
import {
  CustomFrameElement,
  CustomFrameConfig,
  DEFAULT_CUSTOM_CONFIG,
  LAYOUT_META,
  generateCustomFrame,
  getCustomFramePhotoArea,
  type FrameLayout,
} from "@/lib/custom-frame";
import { FRAME_COLORS } from "@/lib/frames";
import { Frame } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const LAYOUTS: FrameLayout[] = [
  "bottom-strip",
  "side-panel",
  "top-strip",
  "corner-badge",
  "full-overlay",
  "text-card",
];

type AddFrame = (data: Omit<Frame, "id" | "createdAt" | "category">) => Frame | null;

interface FrameCreatorProps {
  addFrame?: AddFrame;
  initialConfig?: Partial<CustomFrameConfig>;
  compact?: boolean;
  onCreated?: (frame: Frame) => void;
}

const DRAGGABLE_ELEMENTS: Array<{
  id: CustomFrameElement;
  label: string;
}> = [
  { id: "logo", label: "Logo" },
  { id: "title", label: "Title" },
  { id: "status", label: "Badge" },
];

function defaultPositionFor(layout: FrameLayout, element: CustomFrameElement) {
  const positions: Record<FrameLayout, Record<CustomFrameElement, { x: number; y: number }>> = {
    "bottom-strip": {
      logo: { x: 44, y: 904 },
      title: { x: 44, y: 978 },
      status: { x: 820, y: 908 },
    },
    "side-panel": {
      logo: { x: 40, y: 54 },
      title: { x: 40, y: 170 },
      status: { x: 40, y: 290 },
    },
    "top-strip": {
      logo: { x: 44, y: 48 },
      title: { x: 540, y: 66 },
      status: { x: 820, y: 52 },
    },
    "corner-badge": {
      logo: { x: 690, y: 878 },
      title: { x: 690, y: 956 },
      status: { x: 690, y: 994 },
    },
    "full-overlay": {
      logo: { x: 52, y: 718 },
      title: { x: 52, y: 840 },
      status: { x: 52, y: 750 },
    },
    "text-card": {
      logo: { x: 540, y: 200 },
      title: { x: 540, y: 324 },
      status: { x: 445, y: 530 },
    },
  };
  return positions[layout][element];
}

const SAMPLE_PHOTO =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
  <defs>
    <linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='#1e1a3a'/>
      <stop offset='100%' stop-color='#0d0d18'/>
    </linearGradient>
  </defs>
  <rect width='400' height='400' fill='url(#g)'/>
  <circle cx='200' cy='155' r='52' fill='rgba(255,255,255,0.06)'/>
  <rect x='120' y='230' width='160' height='8' rx='4' fill='rgba(255,255,255,0.04)'/>
  <rect x='150' y='248' width='100' height='6' rx='3' fill='rgba(255,255,255,0.03)'/>
</svg>`
  );

// ─── Reusable sub-components ─────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-9 h-5 rounded-full transition-colors flex-shrink-0",
        checked ? "bg-violet-600" : "bg-white/15"
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-white/55 text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 cursor-pointer">
          <div className="absolute inset-0" style={{ backgroundColor: value }} />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
          }}
          maxLength={7}
          spellCheck={false}
          className="flex-1 min-w-0 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/75 font-mono focus:outline-none focus:border-white/25 transition-colors"
        />
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {FRAME_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            title={c}
            className={cn(
              "w-5 h-5 rounded transition-all",
              value === c
                ? "ring-2 ring-white/50 ring-offset-1 ring-offset-black scale-110"
                : "opacity-55 hover:opacity-85 hover:scale-105"
            )}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
}

function ContentRow({
  label,
  enabled,
  value,
  onToggle,
  onValue,
  placeholder,
  hint,
}: {
  label: string;
  enabled: boolean;
  value: string;
  onToggle: (v: boolean) => void;
  onValue: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-[26px]">
        <Toggle checked={enabled} onChange={onToggle} />
      </div>
      <div className="flex-1 space-y-1 min-w-0">
        <Label
          className={cn(
            "text-xs transition-colors",
            enabled ? "text-white/55" : "text-white/25"
          )}
        >
          {label}
        </Label>
        <Input
          value={value}
          onChange={(e) => onValue(e.target.value)}
          disabled={!enabled}
          placeholder={placeholder}
          className={cn(
            "glass border-white/10 bg-transparent text-white placeholder:text-white/20 focus-visible:ring-violet-500/30 text-sm transition-opacity",
            !enabled && "opacity-30 cursor-not-allowed"
          )}
        />
        {hint && enabled && (
          <p className="text-[10px] text-white/30">{hint}</p>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="text-sm font-semibold text-white/80">{title}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-white/35" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-white/[0.06]">
              <div className="pt-1" />
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function FrameCreator({
  addFrame: addFrameProp,
  initialConfig,
  compact = false,
  onCreated,
}: FrameCreatorProps = {}) {
  const { addFrame: addFrameFromHook } = useFrames();
  const addFrame = addFrameProp ?? addFrameFromHook;
  const previewRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<CustomFrameConfig>({
    ...DEFAULT_CUSTOM_CONFIG,
    ...initialConfig,
  });
  const [frameName, setFrameName] = useState(initialConfig?.eventName ?? "");
  const [draggingElement, setDraggingElement] = useState<CustomFrameElement | null>(null);
  const [saving, setSaving] = useState(false);

  const update = useCallback(
    <K extends keyof CustomFrameConfig>(k: K, v: CustomFrameConfig[K]) =>
      setConfig((prev) => ({ ...prev, [k]: v })),
    []
  );

  const setElementPosition = useCallback(
    (element: CustomFrameElement, clientX: number, clientY: number) => {
      const rect = previewRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.min(1040, Math.max(20, ((clientX - rect.left) / rect.width) * 1080));
      const y = Math.min(1040, Math.max(20, ((clientY - rect.top) / rect.height) * 1080));
      setConfig((prev) => ({
        ...prev,
        positions: {
          ...prev.positions,
          [element]: { x: Math.round(x), y: Math.round(y) },
        },
      }));
    },
    []
  );

  const handlePositionPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingElement) return;
      setElementPosition(draggingElement, e.clientX, e.clientY);
    },
    [draggingElement, setElementPosition]
  );

  const handleLayoutChange = useCallback(
    (layout: FrameLayout) => {
      setConfig((prev) => ({ ...prev, layout, positions: undefined }));
    },
    []
  );

  // Full preview — regenerates on any config change
  const preview = useMemo(() => generateCustomFrame(config), [config]);

  // Layout thumbnails — only regenerate when colors change (not on text edits)
  const layoutThumbs = useMemo(
    () =>
      Object.fromEntries(
        LAYOUTS.map((l) => [l, generateCustomFrame({ ...config, layout: l })])
      ) as Record<FrameLayout, string>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.primaryColor, config.secondaryColor, config.textColor, config.overlayOpacity]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frameName.trim()) {
      toast.error("Please enter a frame name");
      return;
    }
    setSaving(true);
    try {
      const frame = addFrame({
        name: frameName.trim(),
        event: config.eventName || "Custom Style",
        imageUrl: preview,
        aspectRatio: "1:1",
        color: config.primaryColor,
        photoArea: getCustomFramePhotoArea(config.layout),
        description: `Custom ${LAYOUT_META[config.layout].name} frame`,
        tags: ["custom", config.layout],
        customConfig: config,
      });
      if (!frame) {
        toast.error("Could not save this style. Delete older custom styles if your browser storage is full.");
        return;
      }
      toast.success("Frame created and selected!");
      if (onCreated) {
        onCreated(frame);
      } else {
        window.location.href = `/editor?frame=${frame.id}`;
      }
    } catch {
      toast.error("Failed to save frame. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const showOverlayOpacity =
    config.layout === "full-overlay" || config.layout === "corner-badge";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col gap-6 items-start",
        compact ? "lg:flex-row" : "lg:flex-row lg:gap-8"
      )}
    >
      {/* LEFT — Preview + Layout picker */}
      <div className={cn("flex-shrink-0 space-y-5", compact ? "w-full lg:w-[360px]" : "lg:w-[400px] lg:sticky lg:top-6")}>
        {/* Live preview */}
        <div>
          <p className="text-[11px] font-medium text-white/35 uppercase tracking-widest mb-2">
            Preview · Drag Logo, Title, Badge
          </p>
          <div
            ref={previewRef}
            className="relative rounded-2xl overflow-hidden bg-[#0e0e16] border border-white/[0.07] aspect-square shadow-2xl touch-none"
            onPointerMove={handlePositionPointerMove}
            onPointerUp={() => setDraggingElement(null)}
            onPointerLeave={() => setDraggingElement(null)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SAMPLE_PHOTO}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Frame preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {DRAGGABLE_ELEMENTS.map((element) => {
              const point = config.positions?.[element.id] ?? defaultPositionFor(config.layout, element.id);
              const enabled =
                element.id === "logo"
                  ? config.showLogo
                  : element.id === "title"
                    ? config.showEventName
                    : config.showStatus;

              if (!enabled) return null;

              return (
                <button
                  key={element.id}
                  type="button"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDraggingElement(element.id);
                    setElementPosition(element.id, e.clientX, e.clientY);
                  }}
                  className={cn(
                    "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-1 text-[10px] font-semibold shadow-lg backdrop-blur-md transition-colors cursor-grab active:cursor-grabbing",
                    draggingElement === element.id
                      ? "border-violet-300 bg-violet-500/70 text-white"
                      : "border-white/25 bg-black/45 text-white/80 hover:border-violet-300 hover:text-white"
                  )}
                  style={{
                    left: `${(point.x / 1080) * 100}%`,
                    top: `${(point.y / 1080) * 100}%`,
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    <Move className="w-3 h-3" />
                    {element.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-white/32 mt-2">
            Move the labels where they look best on a real post.
          </p>
        </div>

        {/* Layout picker */}
        <div>
          <p className="text-[11px] font-medium text-white/35 uppercase tracking-widest mb-2">
            Choose a starting look
          </p>
          <div className="grid grid-cols-3 gap-2">
            {LAYOUTS.map((l) => {
              const selected = config.layout === l;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => handleLayoutChange(l)}
                  className={cn(
                    "rounded-xl border-2 overflow-hidden transition-all text-left",
                    selected
                      ? "border-violet-500 ring-1 ring-violet-500/30 shadow-lg shadow-violet-500/10"
                      : "border-white/10 hover:border-white/25"
                  )}
                >
                  <div className="aspect-square bg-[#0e0e16] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={SAMPLE_PHOTO}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={layoutThumbs[l]}
                      alt={LAYOUT_META[l].name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {selected && (
                      <div className="absolute inset-0 ring-2 ring-inset ring-violet-500/50 rounded-xl pointer-events-none" />
                    )}
                  </div>
                  <div className="px-2 py-1.5 bg-black/50">
                    <p className="text-[10px] font-semibold text-white/70 truncate">
                      {LAYOUT_META[l].name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-white/30 mt-2">
            {LAYOUT_META[config.layout].description}
          </p>
        </div>
      </div>

      {/* RIGHT — Controls */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Frame name */}
        <Section title="Style name" defaultOpen>
          <div className="space-y-1">
            <Input
              value={frameName}
              onChange={(e) => setFrameName(e.target.value)}
              placeholder="e.g. Dubai Meetup Frame"
              required
              className="glass border-white/10 bg-transparent text-white placeholder:text-white/25 focus-visible:ring-violet-500/30"
            />
            <p className="text-[10px] text-white/30">
              This is how you will find it in My styles.
            </p>
          </div>
        </Section>

        {/* Content */}
        <Section title="Words on your style" defaultOpen>
          <ContentRow
            label="Logo or brand name"
            enabled={config.showLogo}
            value={config.logoText}
            onToggle={(v) => update("showLogo", v)}
            onValue={(v) => update("logoText", v)}
            placeholder="Your brand or event name"
          />
          <ContentRow
            label="Event name"
            enabled={config.showEventName}
            value={config.eventName}
            onToggle={(v) => update("showEventName", v)}
            onValue={(v) => update("eventName", v)}
            placeholder="/Your Meetup"
          />
          <ContentRow
            label="Short line"
            enabled={config.showTagline}
            value={config.tagline}
            onToggle={(v) => update("showTagline", v)}
            onValue={(v) => update("tagline", v)}
            placeholder="Short event description"
          />
          <ContentRow
            label="Badge text"
            enabled={config.showStatus}
            value={config.statusText}
            onToggle={(v) => update("showStatus", v)}
            onValue={(v) => update("statusText", v)}
            placeholder="I'm Attending"
          />
          <div className="grid grid-cols-2 gap-3">
            <ContentRow
              label="Date"
              enabled={config.showDate}
              value={config.date}
              onToggle={(v) => update("showDate", v)}
              onValue={(v) => update("date", v)}
              placeholder="July 2026"
            />
            <ContentRow
              label="Location"
              enabled={config.showLocation}
              value={config.location}
              onToggle={(v) => update("showLocation", v)}
              onValue={(v) => update("location", v)}
              placeholder="City, Country"
            />
          </div>
          <ContentRow
            label="Website"
            enabled={config.showWebsite}
            value={config.website}
            onToggle={(v) => update("showWebsite", v)}
            onValue={(v) => update("website", v)}
            placeholder="yoursite.com"
          />
          <ContentRow
            label="Hashtags"
            enabled={config.showHashtags}
            value={config.hashtags}
            onToggle={(v) => update("showHashtags", v)}
            onValue={(v) => update("hashtags", v)}
            placeholder="#Tag1, #Tag2, #Tag3"
            hint="Comma-separated — shown as pill chips"
          />
        </Section>

        {/* Colors */}
        <Section title="Colors (optional)" defaultOpen={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ColorField
              label="Background"
              value={config.primaryColor}
              onChange={(v) => update("primaryColor", v)}
            />
            <ColorField
              label="Accent"
              value={config.secondaryColor}
              onChange={(v) => update("secondaryColor", v)}
            />
            <ColorField
              label="Text Color"
              value={config.textColor}
              onChange={(v) => update("textColor", v)}
            />
          </div>
          {showOverlayOpacity && (
            <div className="space-y-2 pt-2">
              <Label className="text-white/55 text-xs">
                Overlay Opacity — {config.overlayOpacity}%
              </Label>
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={config.overlayOpacity}
                onChange={(e) =>
                  update("overlayOpacity", Number(e.target.value))
                }
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
              />
            </div>
          )}
        </Section>

        {/* Border */}
        <Section title="Border (optional)" defaultOpen={false}>
          <div className="flex items-center gap-3">
            <Toggle
              checked={config.showBorder}
              onChange={(v) => update("showBorder", v)}
            />
            <span className="text-sm text-white/60">Show border</span>
          </div>
          <AnimatePresence>
            {config.showBorder && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-2"
              >
                <Label className="text-white/55 text-xs">
                  Width — {config.borderWidth}px
                </Label>
                <input
                  type="range"
                  min={2}
                  max={24}
                  step={2}
                  value={config.borderWidth}
                  onChange={(e) =>
                    update("borderWidth", Number(e.target.value))
                  }
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* Submit */}
        <Button
          type="submit"
          disabled={saving}
          className="w-full bg-white text-black hover:bg-white/90 font-semibold h-11 disabled:opacity-50"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
              />
              Creating…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Create style &amp; use it
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
