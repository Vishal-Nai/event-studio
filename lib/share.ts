export function buildLinkedInShareUrl(pageUrl?: string): string {
  const url = pageUrl ?? (typeof window !== "undefined" ? window.location.href : "https://event.studio");
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

export function buildTwitterShareUrl(text: string, hashtags?: string[]): string {
  const tagString = hashtags?.map((t) => t.replace(/^#/, "")).join(",") ?? "";
  const params = new URLSearchParams({ text });
  if (tagString) params.set("hashtags", tagString);
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function downloadDataUrl(dataUrl: string, filename = "event-photo.png"): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export async function copyImageToClipboard(dataUrl: string): Promise<void> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  await navigator.clipboard.write([
    new ClipboardItem({ "image/png": blob }),
  ]);
}

export function openInNewTab(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
