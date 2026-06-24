import { cn } from "@/lib/utils";

interface CursorLogoProps {
  className?: string;
  height?: number;
}

/**
 * Cursor logo: isometric cube mark + "Cursor" wordmark.
 * Pure inline SVG — no external asset required.
 */
export function CursorLogo({ className, height = 28 }: CursorLogoProps) {
  const h = height;
  const s = h / 40;
  const cx = h / 2;
  const cy = h / 2;

  // Translate points from the 40×40 icon grid to actual pixel coords
  const pt = (px: number, py: number) =>
    `${((px - 20) * s + cx).toFixed(2)},${((py - 20) * s + cy).toFixed(2)}`;

  const gap = Math.round(h * 0.40);
  const textSize = Math.round(h * 0.76);
  const textX = h + gap;
  const totalW = Math.round(textX + textSize * 3.35);

  return (
    <svg
      width={totalW}
      height={h}
      viewBox={`0 0 ${totalW} ${h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
      aria-label="Cursor"
    >
      {/* Top face – bright */}
      <polygon
        points={`${pt(20,3)} ${pt(37,12)} ${pt(20,21)} ${pt(3,12)}`}
        fill="white"
        fillOpacity="0.90"
      />
      {/* Right face – medium */}
      <polygon
        points={`${pt(37,12)} ${pt(37,29)} ${pt(20,38)} ${pt(20,21)}`}
        fill="white"
        fillOpacity="0.42"
      />
      {/* Left face – dark */}
      <polygon
        points={`${pt(3,12)} ${pt(20,21)} ${pt(20,38)} ${pt(3,29)}`}
        fill="white"
        fillOpacity="0.18"
      />
      {/* Cursor arrow */}
      <polygon
        points={`${pt(13,16)} ${pt(28,7)} ${pt(22,22)}`}
        fill="white"
      />
      {/* Wordmark – vertically centered at cy */}
      <text
        x={textX}
        y={cy}
        dominantBaseline="central"
        fontFamily="'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        fontSize={textSize}
        fontWeight="600"
        letterSpacing="-0.4"
        fill="white"
      >
        Cursor
      </text>
    </svg>
  );
}
