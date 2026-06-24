"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Upload,
  Layers,
  ZoomIn,
  Share2,
  Download,
  Move,
  RotateCw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Images,
} from "lucide-react";
import { useBranding } from "@/hooks/useBranding";
import { useFrames } from "@/hooks/useFrames";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const FEATURES = [
  {
    icon: Upload,
    title: "Upload your photo",
    description: "Choose a favorite event photo from your device. Nothing leaves your browser.",
    color: "from-violet-500/20 to-violet-600/10",
    iconColor: "text-violet-400",
  },
  {
    icon: Layers,
    title: "Try event styles",
    description: "Preview polished social layouts instantly and pick the one that makes your photo stand out.",
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-400",
  },
  {
    icon: ZoomIn,
    title: "Make it fit",
    description: "Use simple controls to make the photo bigger, center it, or rotate it.",
    color: "from-cyan-500/20 to-cyan-600/10",
    iconColor: "text-cyan-400",
  },
  {
    icon: Share2,
    title: "Save and post",
    description: "Download a ready-to-post image for LinkedIn, X, WhatsApp, or your community group.",
    color: "from-pink-500/20 to-pink-600/10",
    iconColor: "text-pink-400",
  },
  {
    icon: Sparkles,
    title: "Use a suggested caption",
    description: "Copy a ready-made caption with hashtags when you want help writing the post.",
    color: "from-amber-500/20 to-amber-600/10",
    iconColor: "text-amber-400",
  },
  {
    icon: Images,
    title: "Create your own style",
    description: "Organizers can save branded styles for attendees to use again and again.",
    color: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-400",
  },
];

const EDITOR_FEATURES = [
  { icon: Move, label: "Drag to move" },
  { icon: ZoomIn, label: "Resize photo" },
  { icon: RotateCw, label: "Rotate quickly" },
  { icon: CheckCircle2, label: "One-tap fit" },
];

const STEPS = [
  { num: "01", title: "Upload photo", desc: "Choose your best photo or drop it into the editor" },
  { num: "02", title: "Try styles", desc: "Tap different event looks until one feels right" },
  { num: "03", title: "Adjust photo", desc: "Make it bigger, center it, or rotate it" },
  { num: "04", title: "Save post", desc: "Download the image and post it anywhere" },
];

export default function HomePage() {
  const { config: branding } = useBranding();
  const { presetFrames } = useFrames(branding);
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-20">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-blue-600/10 rounded-full blur-[80px]" />
        </div>

        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet-500/30 text-sm text-violet-300 font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Turn event photos into posts people want to share</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
          >
            <span className="text-white">Make your </span>
            <br />
            <span className="gradient-text">best event post</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload your favorite photo, try ready-made event styles, adjust the crop, and save a polished image.
            No sign-up required.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/editor"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-white font-semibold text-base hover:from-violet-500 hover:to-blue-400 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
            >
              <Upload className="w-4 h-4" />
              Add your photo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/frames"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass border border-white/10 text-white/80 font-semibold text-base hover:bg-white/[0.07] hover:text-white transition-all hover:-translate-y-0.5"
            >
              <Images className="w-4 h-4" />
              Browse styles
            </Link>
          </motion.div>

          {/* Editor features badge row */}
          <motion.div variants={fadeUp} className="mt-12 flex flex-wrap gap-3 justify-center">
            {EDITOR_FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs text-white/50 border border-white/[0.06]"
              >
                <Icon className="w-3 h-3 text-white/30" />
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Preset Frames Showcase */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold text-violet-400 tracking-widest uppercase mb-3">Event styles</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Try a look before you post
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              Start with a polished style, then switch styles in the editor without uploading again.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {presetFrames.map((frame, i) => (
              <motion.div
                key={frame.id}
                variants={fadeUp}
                custom={i}
                className="group"
              >
                <Link href={`/editor?frame=${frame.id}`}>
                  <div className="glass-card glass-hover rounded-xl overflow-hidden aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={frame.imageUrl}
                      alt={frame.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="mt-2.5 px-1">
                    <p className="text-xs font-semibold text-white/80 truncate">{frame.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">Tap to use this style</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <Link
              href="/frames"
              className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium"
            >
              View all styles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold text-blue-400 tracking-widest uppercase mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need for a polished post
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {FEATURES.map(({ icon: Icon, title, description, color, iconColor }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="glass-card glass-hover rounded-2xl p-6 group cursor-default"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-semibold text-emerald-400 tracking-widest uppercase mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Four steps to your perfect post
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {STEPS.map(({ num, title, desc }, i) => (
              <motion.div key={num} variants={fadeUp} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent -translate-y-1/2 z-10" />
                )}
                <div className="glass-card rounded-2xl p-6 h-full">
                  <div className="text-4xl font-black gradient-text mb-3">{num}</div>
                  <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/50">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-blue-600/20 to-cyan-600/10" />
            <div className="absolute inset-0 glass" />
            <div className="absolute inset-px rounded-3xl border border-white/10" />
            <div className="relative px-8 py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-violet-500/30">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to make your post?
              </h2>
              <p className="text-white/60 text-base max-w-xl mx-auto mb-8">
                Upload your photo, try a style, and save a clean social image in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-white font-semibold hover:from-violet-500 hover:to-blue-400 transition-all shadow-lg shadow-violet-500/25 hover:-translate-y-0.5"
                >
                  <Upload className="w-4 h-4" />
                  Add your photo
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/frames?create=1"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass border border-white/10 text-white/80 font-semibold hover:bg-white/[0.07] hover:text-white transition-all hover:-translate-y-0.5"
                >
                  Create a style
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
