import { cn } from "@/lib/utils";

interface MindmakerIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
  variant?: "default" | "light" | "dark";
}

/**
 * Mindmaker brand icon - the distinctive two-block building icon
 * Used instead of generic Sparkles icons throughout the app
 */
export const MindmakerIcon = ({
  size = 24,
  className,
  animated = false,
  variant = "default",
}: MindmakerIconProps) => {
  // Color based on variant
  const getColors = () => {
    switch (variant) {
      case "light":
        return {
          primary: "#00D4AA", // mint
          secondary: "#00B894", // darker mint
        };
      case "dark":
        return {
          primary: "#1a365d", // dark blue
          secondary: "#00D4AA", // mint accent
        };
      default:
        return {
          primary: "currentColor",
          secondary: "currentColor",
        };
    }
  };

  const colors = getColors();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "shrink-0",
        animated && "animate-pulse",
        className
      )}
      aria-label="Mindmaker"
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="mindmaker-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a365d" />
          <stop offset="100%" stopColor="#00D4AA" />
        </linearGradient>
        <linearGradient id="mindmaker-mint-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00D4AA" />
          <stop offset="100%" stopColor="#00B894" />
        </linearGradient>
      </defs>

      {/* Small block (top left) - trapezoid */}
      <path
        d="M3 10L5 6H8L10 10H3Z"
        fill="url(#mindmaker-gradient)"
        className={cn(animated && "origin-center")}
      />

      {/* Large block (top right) - trapezoid */}
      <path
        d="M12 10L15 3H20L22 10H12Z"
        fill="url(#mindmaker-gradient)"
      />

      {/* Left square (bottom left) */}
      <rect
        x="3"
        y="11"
        width="8"
        height="9"
        rx="0.5"
        fill="url(#mindmaker-gradient)"
      />

      {/* Right square (bottom right) */}
      <rect
        x="12"
        y="11"
        width="10"
        height="9"
        rx="0.5"
        fill="url(#mindmaker-mint-gradient)"
      />
    </svg>
  );
};

/**
 * Animated loading version of the Mindmaker icon
 */
export const MindmakerIconLoading = ({
  size = 24,
  className,
}: Omit<MindmakerIconProps, "animated">) => {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <MindmakerIcon size={size} className="animate-pulse" />
      <div
        className="absolute inset-0 rounded-full animate-ping opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(0,212,170,0.4) 0%, transparent 70%)",
        }}
      />
    </div>
  );
};

/**
 * Badge with Mindmaker icon and text
 */
interface MindmakerBadgeProps {
  text?: string;
  className?: string;
}

export const MindmakerBadge = ({
  text = "Powered by Mindmaker",
  className,
}: MindmakerBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-mint-dark",
        className
      )}
    >
      <MindmakerIcon size={14} />
      <span>{text}</span>
    </div>
  );
};

