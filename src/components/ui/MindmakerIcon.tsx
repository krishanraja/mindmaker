import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import mindmakerIconLight from "@/assets/mindmaker-icon-light.png";
import mindmakerIconDark from "@/assets/mindmaker-icon-dark.png";

interface MindmakerIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

/**
 * Mindmaker brand icon - uses the real PNG assets
 * Automatically switches between light/dark variants based on theme
 */
export const MindmakerIcon = ({
  size = 24,
  className,
  animated = false,
}: MindmakerIconProps) => {
  const { resolvedTheme } = useTheme();
  
  // Use light icon on dark backgrounds, dark icon on light backgrounds
  const iconSrc = resolvedTheme === "dark" ? mindmakerIconLight : mindmakerIconDark;

  return (
    <img
      src={iconSrc}
      alt="Mindmaker"
      width={size}
      height={size}
      className={cn(
        "shrink-0 object-contain",
        animated && "animate-pulse",
        className
      )}
    />
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
