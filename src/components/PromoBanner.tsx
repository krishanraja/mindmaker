import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface PromoBannerProps {
  className?: string;
  compact?: boolean;
}

// Set expiry to 30 days from today (configurable)
const getPromoEndDate = () => {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);
  endDate.setHours(23, 59, 59, 999);
  return endDate;
};

const PROMO_END_DATE = getPromoEndDate();

const calculateTimeLeft = (): TimeLeft | null => {
  const difference = PROMO_END_DATE.getTime() - new Date().getTime();

  if (difference <= 0) {
    return null;
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const TimeUnit = ({
  value,
  label,
  compact,
}: {
  value: number;
  label: string;
  compact?: boolean;
}) => {
  const displayValue = value.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative overflow-hidden ${
          compact
            ? "w-10 h-10 sm:w-12 sm:h-12"
            : "w-12 h-12 sm:w-14 sm:h-14"
        } bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center`}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayValue}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`font-mono font-bold text-white ${
              compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
            }`}
          >
            {displayValue}
          </motion.span>
        </AnimatePresence>
      </div>
      <span
        className={`text-white/70 uppercase tracking-wider mt-1 ${
          compact ? "text-[9px] sm:text-[10px]" : "text-[10px] sm:text-xs"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

export const PromoBanner = ({ className = "", compact = false }: PromoBannerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Don't render anything if offer has expired
  if (!timeLeft) {
    return null;
  }

  // Prevent hydration mismatch by not rendering countdown until mounted
  if (!mounted) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl ${
          compact ? "p-3 sm:p-4" : "p-4 sm:p-6"
        } ${className}`}
        style={{
          background: "linear-gradient(135deg, #1a2332 0%, #243447 50%, #1a2332 100%)",
        }}
      >
        <div className="h-16 sm:h-20" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-xl ${
        compact ? "p-3 sm:p-4" : "p-4 sm:p-6"
      } ${className}`}
      style={{
        background: "linear-gradient(135deg, #1a2332 0%, #243447 50%, #1a2332 100%)",
      }}
    >
      {/* Subtle animated glow effect */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(77, 201, 176, 0.15) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div
        className={`relative z-10 flex ${
          compact
            ? "flex-col sm:flex-row items-center gap-3 sm:gap-4"
            : "flex-col md:flex-row items-center gap-4 md:gap-6"
        } justify-between`}
      >
        {/* Left: Badge and text */}
        <div
          className={`flex ${
            compact ? "flex-row items-center gap-3" : "flex-col sm:flex-row items-center gap-3 sm:gap-4"
          }`}
        >
          {/* 50% OFF Badge */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(77, 201, 176, 0.3)",
                "0 0 30px rgba(77, 201, 176, 0.5)",
                "0 0 20px rgba(77, 201, 176, 0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`flex-shrink-0 bg-gradient-to-r from-mint to-mint-dark ${
              compact ? "px-3 py-1.5" : "px-4 py-2"
            } rounded-lg`}
          >
            <span
              className={`font-black text-ink ${
                compact ? "text-sm sm:text-base" : "text-lg sm:text-xl"
              }`}
            >
              50% OFF
            </span>
          </motion.div>

          {/* Text */}
          <div className={`text-center ${compact ? "sm:text-left" : "sm:text-left"}`}>
            <p
              className={`text-white font-semibold ${
                compact ? "text-sm" : "text-base sm:text-lg"
              }`}
            >
              Limited Time Offer
            </p>
            <p
              className={`text-white/70 ${
                compact ? "text-xs" : "text-sm"
              }`}
            >
              Book your consultation before time runs out
            </p>
          </div>
        </div>

        {/* Right: Countdown */}
        <div className="flex items-center gap-1 sm:gap-2">
          <TimeUnit value={timeLeft.days} label="Days" compact={compact} />
          <span
            className={`text-white/50 font-bold ${
              compact ? "text-lg" : "text-xl"
            } -mt-4`}
          >
            :
          </span>
          <TimeUnit value={timeLeft.hours} label="Hrs" compact={compact} />
          <span
            className={`text-white/50 font-bold ${
              compact ? "text-lg" : "text-xl"
            } -mt-4`}
          >
            :
          </span>
          <TimeUnit value={timeLeft.minutes} label="Min" compact={compact} />
          <span
            className={`text-white/50 font-bold ${
              compact ? "text-lg" : "text-xl"
            } -mt-4`}
          >
            :
          </span>
          <TimeUnit value={timeLeft.seconds} label="Sec" compact={compact} />
        </div>
      </div>
    </motion.div>
  );
};

export default PromoBanner;
