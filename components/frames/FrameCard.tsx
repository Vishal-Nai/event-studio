"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Trash2, ExternalLink, Edit3, Star } from "lucide-react";
import { Frame } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FrameCardProps {
  frame: Frame;
  onDelete?: (id: string) => void;
}

function FrameCardInner({ frame, onDelete }: FrameCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="group relative glass-card glass-hover rounded-2xl overflow-hidden"
      >
        <div className="relative aspect-square overflow-hidden bg-[#111118]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(45deg,#1a1a2e 25%,transparent 25%),linear-gradient(-45deg,#1a1a2e 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#1a1a2e 75%),linear-gradient(-45deg,transparent 75%,#1a1a2e 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={frame.imageUrl}
            alt={frame.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href={`/editor?frame=${frame.id}`}
                  className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>Use this style</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <Link
                  href={`/editor?frame=${frame.id}`}
                  className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center text-white hover:from-violet-500 hover:to-blue-400 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>Make post</TooltipContent>
            </Tooltip>

            {onDelete && frame.category === "custom" && (
              <Tooltip>
                <TooltipTrigger>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteOpen(true);
                    }}
                    className="w-9 h-9 rounded-lg bg-red-500/20 backdrop-blur-sm border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Delete style</TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className="absolute top-2.5 left-2.5">
            <Badge
              variant="secondary"
              className={
                frame.category === "preset"
                  ? "bg-violet-500/20 text-violet-300 border-violet-500/30 text-[10px] px-2 py-0.5"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] px-2 py-0.5"
              }
            >
              {frame.category === "preset" ? (
                <span className="flex items-center gap-1">
                  <Star className="w-2.5 h-2.5" />
                  Ready
                </span>
              ) : (
                "Mine"
              )}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-white/90 truncate mb-1">{frame.name}</h3>
          <p className="text-xs text-white/40 mb-3 line-clamp-2">
            {frame.description ?? frame.event}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/30">{frame.category === "custom" ? "My style" : "Ready-made"}</span>
            <Link
              href={`/editor?frame=${frame.id}`}
              className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
            >
              Use this style →
            </Link>
          </div>
        </div>
      </motion.div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="glass border-white/10 bg-[#12121a] text-white">
          <DialogHeader>
            <DialogTitle>Delete style?</DialogTitle>
            <DialogDescription className="text-white/50">
              &ldquo;{frame.name}&rdquo; will be permanently removed. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-t-white/10 bg-transparent">
            <Button
              type="button"
              variant="outline"
              className="border-white/10 text-white/70"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-500 text-white"
              onClick={() => {
                onDelete?.(frame.id);
                setDeleteOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const FrameCard = memo(FrameCardInner);
