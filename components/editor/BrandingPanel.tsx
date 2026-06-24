"use client";

import { useState, useEffect, useCallback, useRef, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { BrandingConfig } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BrandingPanelProps {
  config: BrandingConfig;
  onChange: (updates: Partial<BrandingConfig>) => void;
  onReset: () => void;
}

// Fields that should be debounced (text inputs with expensive downstream effects)
const DEBOUNCE_MS = 400;

export function BrandingPanel({ config, onChange, onReset }: BrandingPanelProps) {
  const [open, setOpen] = useState(false);
  // Local draft for text inputs — avoids re-generating SVG frames on every keystroke
  const [draft, setDraft] = useState<BrandingConfig>(config);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<Partial<BrandingConfig> | null>(null);

  // Keep draft in sync when config changes externally (e.g. reset)
  useEffect(() => {
    const id = window.setTimeout(() => setDraft(config), 0);
    return () => window.clearTimeout(id);
  }, [config]);

  const handleTextChange = useCallback(
    (key: keyof BrandingConfig, value: string) => {
      // Update draft immediately (so the input feels responsive)
      setDraft((prev) => ({ ...prev, [key]: value }));
      // Debounce the actual branding update (which regenerates SVG frames)
      if (timerRef.current) clearTimeout(timerRef.current);
      pendingRef.current = { [key]: value };
      timerRef.current = setTimeout(() => {
        onChange({ [key]: value });
        pendingRef.current = null;
      }, DEBOUNCE_MS);
    },
    [onChange]
  );

  // Flush pending debounced updates on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pendingRef.current) onChange(pendingRef.current);
    };
  }, [onChange]);

  const textFields: Array<{
    id: "eventName" | "tagline" | "hashtags" | "location" | "date" | "website";
    label: string;
    placeholder: string;
    hint?: string;
  }> = [
    { id: "eventName", label: "Event name", placeholder: "Cursor India", hint: "Updates the text on supported styles" },
    { id: "tagline", label: "Short line", placeholder: "AI coding agent for building ambitious software" },
    { id: "hashtags", label: "Hashtags", placeholder: "#CursorIndia, #BuildWithCursor", hint: "Comma-separated, shown on supported styles" },
    { id: "location", label: "Location", placeholder: "India" },
    { id: "date", label: "Date", placeholder: "July 2026" },
    { id: "website", label: "Website", placeholder: "cursor.com" },
  ];

  const field = (id: typeof textFields[number]["id"], label: string, placeholder: string, hint?: string) => (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-white/60 text-xs font-medium">
        {label}
      </Label>
      <Input
        id={id}
        value={draft[id]}
        onChange={(e) => handleTextChange(id, e.target.value)}
        placeholder={placeholder}
        className="h-8 text-xs glass border-white/10 bg-transparent text-white placeholder:text-white/20 focus-visible:ring-violet-500/40"
      />
      {hint && <p className="text-[10px] text-white/25">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between text-xs font-semibold text-white/50 uppercase tracking-widest hover:text-white/70 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Settings2 className="w-3 h-3 text-violet-400" />
          Event details
        </span>
        {open
          ? <ChevronUp className="w-3.5 h-3.5" />
          : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-2">
              {textFields.slice(0, 2).map((f) => (
                <Fragment key={f.id}>
                  {field(f.id, f.label, f.placeholder, f.hint)}
                </Fragment>
              ))}

              {/* Status quick-select */}
              <div className="space-y-1.5">
                <Label className="text-white/60 text-xs font-medium">Status</Label>
                <div className="flex flex-wrap gap-1">
                  {["Hackathon", "Meetup", "Cafe Cursor", "Announcement", "Thank You!"].map((s) => (
                    <button key={s} type="button"
                      onClick={() => { setDraft(p => ({ ...p, statusText: s })); onChange({ statusText: s }); }}
                      className={cn(
                        "rounded-md border px-2 py-1 text-[10px] transition-colors leading-none",
                        (draft.statusText ?? "") === s
                          ? "border-violet-400/60 bg-violet-500/15 text-violet-300"
                          : "border-white/10 text-white/35 hover:border-white/25 hover:text-white/60"
                      )}
                    >{s}</button>
                  ))}
                </div>
                <Input
                  id="statusText"
                  value={draft.statusText ?? ""}
                  onChange={(e) => handleTextChange("statusText", e.target.value)}
                  placeholder="or type a custom status…"
                  className="h-7 text-xs glass border-white/10 bg-transparent text-white placeholder:text-white/20 focus-visible:ring-violet-500/40"
                />
              </div>

              {field("hashtags", "Hashtags", "#CursorIndia, #BuildWithCursor", "Comma-separated, shown on supported styles")}

              <div className="grid grid-cols-2 gap-2">
                {field("location", "Location", "India")}
                {field("date", "Date", "July 2026")}
              </div>

              {field("website", "Website", "cursor.com")}

              <Separator className="bg-white/[0.06]" />

              <button
                type="button"
                onClick={() => { onReset(); toast.success("Branding reset to Cursor defaults"); }}
                className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to defaults
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
