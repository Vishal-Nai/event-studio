import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Event Studio — Make Event Photos Ready to Post",
  description:
    "Upload your photo, try event styles, and save a polished image for LinkedIn, X, WhatsApp, or your community group.",
  keywords: ["event photo", "frame", "social post", "community", "meetup", "photo style"],
  openGraph: {
    title: "Event Studio",
    description: "Turn event photos into polished social posts in a few clicks.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full"
    >
      <head>
        <link
          rel="preload"
          href="/fonts/Cursor%20Gothic/WEB/WOFF2/CursorGothic-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Cursor%20Gothic/WEB/WOFF2/CursorGothic-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <TooltipProvider>
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast: "glass border-white/10 text-white",
              },
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
