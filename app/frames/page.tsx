"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PenSquare, Search, Grid3X3, List, Sparkles, Plus, Settings2 } from "lucide-react";
import { useFrames } from "@/hooks/useFrames";
import { useBranding } from "@/hooks/useBranding";
import { FrameCard } from "@/components/frames/FrameCard";
import { FrameCreator } from "@/components/frames/FrameCreator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function FramesPage() {
  const { config: branding } = useBranding();
  const { allFrames, deleteFrame, isLoaded, addFrame } = useFrames(branding);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "preset" | "custom">("all");
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (!window.location.search.includes("create=1")) return;
    const id = window.setTimeout(() => setCreateOpen(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  const filtered = allFrames.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.event.toLowerCase().includes(search.toLowerCase()) ||
      f.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchTab = tab === "all" || f.category === tab;
    return matchSearch && matchTab;
  });

  const handleDelete = (id: string) => {
    const ok = deleteFrame(id);
    if (ok) {
      toast.success("Style deleted");
    } else {
      toast.error("Could not delete this style. Please try again.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="glass-card max-h-[92vh] w-[min(1120px,calc(100vw-2rem))] overflow-y-auto rounded-3xl border-white/10 bg-[#0b0b12]/95 p-5 text-white sm:max-w-none sm:p-6">
          <DialogHeader className="pr-8">
            <DialogTitle className="text-xl font-bold text-white">Create your own style</DialogTitle>
            <DialogDescription className="text-white/45">
              Start with a social-ready layout, edit the words, and drag the logo, title, or badge where they look best.
            </DialogDescription>
          </DialogHeader>
          <FrameCreator
            compact
            addFrame={addFrame}
            initialConfig={{
              primaryColor: branding.accentColor,
              secondaryColor: branding.secondaryColor,
              textColor: "#ffffff",
              logoText: branding.logoText,
              eventName: branding.eventName,
              tagline: branding.tagline,
              date: branding.date,
              location: branding.location,
              hashtags: branding.hashtags ?? "",
              statusText: branding.statusText ?? "I'm Attending",
              website: branding.website,
            }}
            onCreated={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <p className="text-sm font-semibold text-violet-400 tracking-widest uppercase mb-2">
              Style hub
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Choose a style
            </h1>
            <p className="text-white/50 mt-2 text-base">
              Try ready-made looks or create your own reusable event style.
            </p>
            {/* Current branding indicator */}
            <div className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full glass border border-white/[0.08] w-fit">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${branding.accentColor}, ${branding.secondaryColor})`,
                }}
              />
              <span className="text-xs text-white/50">
                Event details: <span className="text-white/70 font-medium">{branding.eventName}</span>
              </span>
              <Link href="/editor" className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors ml-1">
                Edit details →
              </Link>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/10 text-white/70 font-medium text-sm hover:bg-white/[0.06] hover:text-white transition-all w-fit"
            >
              <Settings2 className="w-4 h-4" />
              Event details
            </Link>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-white font-semibold text-sm hover:from-violet-500 hover:to-blue-400 transition-all shadow-lg shadow-violet-500/20 hover:-translate-y-0.5 w-fit"
            >
              <Plus className="w-4 h-4" />
              Create style
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              placeholder="Search styles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 glass border-white/10 bg-transparent text-white placeholder:text-white/30 focus-visible:ring-violet-500/40"
            />
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList className="glass border border-white/10 bg-transparent">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50"
              >
                All ({allFrames.length})
              </TabsTrigger>
              <TabsTrigger
                value="preset"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Ready-made
              </TabsTrigger>
              <TabsTrigger
                value="custom"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50"
              >
                <Grid3X3 className="w-3.5 h-3.5 mr-1.5" />
                My styles
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Grid */}
        {!isLoaded ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4">
              <List className="w-7 h-7 text-white/30" />
            </div>
            <h3 className="text-white/60 font-medium mb-2">No styles found</h3>
            <p className="text-white/30 text-sm mb-6">
              {tab === "custom"
                ? "You have not created any custom styles yet."
                : "Try adjusting your search."}
            </p>
            {tab === "custom" && (
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 text-white font-medium text-sm"
              >
                <PenSquare className="w-4 h-4" />
                Create your first style
              </button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((frame) => (
                <FrameCard
                  key={frame.id}
                  frame={frame}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
