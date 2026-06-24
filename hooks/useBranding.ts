"use client";

import { useState, useEffect, useCallback } from "react";
import { BrandingConfig, DEFAULT_BRANDING } from "@/types";

const STORAGE_KEY = "event-studio-branding";

function load(): BrandingConfig {
  if (typeof window === "undefined") return DEFAULT_BRANDING;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_BRANDING, ...JSON.parse(raw) } : DEFAULT_BRANDING;
  } catch {
    return DEFAULT_BRANDING;
  }
}

function save(config: BrandingConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function useBranding() {
  const [config, setConfig] = useState<BrandingConfig>(DEFAULT_BRANDING);

  useEffect(() => {
    const id = window.setTimeout(() => setConfig(load()), 0);
    return () => window.clearTimeout(id);
  }, []);

  const updateConfig = useCallback((updates: Partial<BrandingConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      save(next);
      return next;
    });
  }, []);

  const resetConfig = useCallback(() => {
    save(DEFAULT_BRANDING);
    setConfig(DEFAULT_BRANDING);
  }, []);

  return { config, updateConfig, resetConfig };
}
