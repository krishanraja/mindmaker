/**
 * Calendly Integration Utility
 * Standardized Calendly URL generation and popup widget integration
 */

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

export type CalendlySource =
  | 'builder-assessment'
  | 'ai-decision-helper'
  | 'friction-map'
  | 'portfolio-builder'
  | 'consultation-booking'
  | 'initial-consult'
  | 'other';

export interface CalendlyParams {
  name?: string;
  email?: string;
  source: CalendlySource;
  preselectedProgram?: string;
}

/**
 * Opens Calendly popup widget with standardized parameters
 * Falls back to window.open if Calendly widget is not available
 */
export const openCalendlyPopup = (params: CalendlyParams): void => {
  // Map source to Calendly a1 parameter (used for interest field)
  const sourceMap: Record<CalendlySource, string> = {
    'builder-assessment': 'builder-profile-quiz',
    'ai-decision-helper': 'ai-decision-helper',
    'friction-map': 'friction-map-builder',
    'portfolio-builder': 'portfolio-builder',
    'consultation-booking': params.preselectedProgram || 'consultation',
    'initial-consult': params.preselectedProgram || 'initial-consult',
    'other': 'website',
  };

  const a1Value = sourceMap[params.source];
  const calendlyUrl = `https://calendly.com/krish-raja/mindmaker-meeting?name=${encodeURIComponent(params.name || '')}&email=${encodeURIComponent(params.email || '')}&prefill_email=${encodeURIComponent(params.email || '')}&prefill_name=${encodeURIComponent(params.name || '')}&a1=${encodeURIComponent(a1Value)}`;

  // Use Calendly popup widget if available, fallback to window.open
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url: calendlyUrl });
  } else {
    // Fallback for when Calendly script hasn't loaded yet
    window.open(calendlyUrl, '_blank');
  }
};

