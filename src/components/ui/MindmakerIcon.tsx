import { cn } from "@/lib/utils";
// TODO: Replace with actual Mindmaker-icon.png when provided
import mindmakerIcon from "@/assets/mindmaker-icon-light.png";

interface MindmakerIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

/**
 * Mindmaker brand icon - uses the exact Mindmaker-icon.png asset
 * Preserves aspect ratio with object-contain
 */
export const MindmakerIcon = ({
  size = 24,
  className,
  animated = false,
}: MindmakerIconProps) => {
  // #region agent log
  fetch('http://127.0.0.1:7247/ingest/d84be03b-cc5f-4a51-8624-1abff965b9ec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MindmakerIcon.tsx:19',message:'MindmakerIcon rendered',data:{size,animated,iconSrc:mindmakerIcon?.toString().substring(0,50) || 'MISSING',hasIcon:!!mindmakerIcon},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  return (
    <img
      src={mindmakerIcon}
      alt="Mindmaker"
      width={size}
      height={size}
      className={cn(
        "shrink-0 object-contain",
        animated && "animate-pulse",
        className
      )}
      style={{ aspectRatio: 'auto' }}
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
