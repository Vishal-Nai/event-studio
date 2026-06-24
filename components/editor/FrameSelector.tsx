"use client";

import { memo, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, Sparkles, CheckCircle2 } from "lucide-react";
import { Frame } from "@/types";
import { cn } from "@/lib/utils";

interface FrameSelectorProps {
  frames: Frame[];
  selectedFrameId: string | null;
  onSelectFrame: (frame: Frame) => void;
  onClearFrame: () => void;
  onCreateFrame?: () => void;
  variant?: "sidebar" | "banner";
}

export function FrameSelectorInner({
  frames,
  selectedFrameId,
  onSelectFrame,
  onClearFrame,
  onCreateFrame,
  variant = "sidebar",
}: FrameSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isBanner = variant === "banner";
  const thumbSize = isBanner ? "w-[76px]" : "w-[72px]";
  const noneSize = isBanner ? "w-[76px] h-[76px]" : "w-16 h-16";
  const newSize = isBanner ? "w-[76px] h-[76px]" : "w-16 h-16";

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <div className="space-y-3">
      {!isBanner && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Styles</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="w-6 h-6 rounded-md flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="w-6 h-6 rounded-md flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className={cn("relative", isBanner && "group/strip")}>
        {isBanner && (
          <>
            <button
              type="button"
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white opacity-0 group-hover/strip:opacity-100 transition-opacity hidden sm:flex"
              aria-label="Scroll styles left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white opacity-0 group-hover/strip:opacity-100 transition-opacity hidden sm:flex"
              aria-label="Scroll styles right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className={cn(
            "flex gap-2.5 overflow-x-auto scrollbar-hide pb-1",
            isBanner && "px-1 sm:px-2"
          )}
        >
          <button
            type="button"
            onClick={onClearFrame}
            className={cn(
              "flex-shrink-0 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1",
              noneSize,
              !selectedFrameId
                ? "border-violet-500 bg-violet-500/10"
                : "border-white/10 bg-white/[0.03] hover:border-white/20"
            )}
            aria-label="No style"
          >
            {!selectedFrameId && <CheckCircle2 className="w-4 h-4 text-violet-400" />}
            <span className="text-[10px] text-white/40">No style</span>
          </button>

          {frames.map((frame) => {
            const isSelected = selectedFrameId === frame.id;
            return (
              <motion.button
                key={frame.id}
                type="button"
                onClick={() => onSelectFrame(frame)}
                className={cn("relative flex-shrink-0 flex flex-col gap-1.5 items-center", thumbSize)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                aria-label={frame.name}
                aria-pressed={isSelected}
                title={frame.description ?? frame.name}
              >
                <div
                  className={cn(
                    "w-full aspect-square rounded-xl overflow-hidden border-2 transition-all relative",
                    isSelected
                      ? "border-violet-500 ring-2 ring-violet-500/40"
                      : "border-white/10 hover:border-white/25"
                  )}
                >
                  <div className="absolute inset-0 bg-[#111118]" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={frame.imageUrl}
                    alt={frame.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  )}
                  {frame.category === "preset" && (
                    <div className="absolute bottom-0.5 right-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-yellow-400 drop-shadow" />
                    </div>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] text-center leading-tight w-full truncate transition-colors",
                    isSelected ? "text-violet-400 font-medium" : "text-white/35"
                  )}
                >
                  {frame.name}
                </span>
              </motion.button>
            );
          })}

          {onCreateFrame ? (
            <button
              type="button"
              onClick={onCreateFrame}
              className={cn(
                "flex-shrink-0 rounded-xl border-2 border-dashed border-white/10 hover:border-violet-500/50 flex flex-col items-center justify-center gap-1 transition-all hover:bg-violet-500/5 group",
                newSize
              )}
              aria-label="Create new style"
            >
              <Plus className="w-4 h-4 text-white/25 group-hover:text-violet-400 transition-colors" />
              <span className="text-[9px] text-white/25 group-hover:text-violet-400 transition-colors">Create</span>
            </button>
          ) : (
            <Link
              href="/frames?create=1"
              className={cn(
                "flex-shrink-0 rounded-xl border-2 border-dashed border-white/10 hover:border-violet-500/50 flex flex-col items-center justify-center gap-1 transition-all hover:bg-violet-500/5 group",
                newSize
              )}
              aria-label="Create new style"
            >
              <Plus className="w-4 h-4 text-white/25 group-hover:text-violet-400 transition-colors" />
              <span className="text-[9px] text-white/25 group-hover:text-violet-400 transition-colors">Create</span>
            </Link>
          )}
        </div>
      </div>

      {selectedFrameId && (
        <motion.div
          key={selectedFrameId}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"
        >
          {(() => {
            const frame = frames.find((f) => f.id === selectedFrameId);
            if (!frame) return null;
            return (
              <div className="flex items-start gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: frame.color ?? "#7c3aed" }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white/70">{frame.name}</p>
                  {frame.description && (
                    <p className="text-[10px] text-white/30 leading-snug mt-0.5">{frame.description}</p>
                  )}
                  {!frame.description && (
                    <p className="text-[10px] text-white/30 capitalize">{frame.category === "custom" ? "My style" : "Ready-made"}</p>
                  )}
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}

export const FrameSelector = memo(FrameSelectorInner);
