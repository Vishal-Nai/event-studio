import { cn } from "@/lib/utils";

interface CursorLogoProps {
  className?: string;
  height?: number;
}

/**
 * Cursor logo from the local brand asset.
 */
export function CursorLogo({ className, height = 28 }: CursorLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/cursor_logo.svg"
      alt="Cursor"
      width={Math.round(height * 4.21)}
      height={height}
      className={cn("flex-shrink-0", className)}
    />
  );
}
