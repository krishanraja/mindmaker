/**
 * Email Notification Utility
 * Shared function to send lead emails via Supabase Edge Function
 */

import { supabase } from '@/integrations/supabase/client';

export interface LeadEmailParams {
  name: string;
  email: string;
  source: string;
  additionalData?: {
    jobTitle?: string;
    sessionData?: Record<string, any>;
    commitmentLevel?: string;
    audienceType?: "individual" | "team";
    pathType?: "build" | "orchestrate";
  };
}

/**
 * Sends a lead email notification to krish@themindmaker.ai
 * Handles errors gracefully - does not block user flow
 */
export const sendLeadEmail = async (params: LeadEmailParams): Promise<void> => {
  try {
    const { error } = await supabase.functions.invoke('send-lead-email', {
      body: {
        name: params.name,
        email: params.email,
        jobTitle: params.additionalData?.jobTitle || 'Not specified',
        selectedProgram: params.source,
        commitmentLevel: params.additionalData?.commitmentLevel,
        audienceType: params.additionalData?.audienceType,
        pathType: params.additionalData?.pathType,
        sessionData: params.additionalData?.sessionData || {},
      },
    });

    if (error) {
      console.error('Email notification error:', error);
      // Don't throw - we don't want to block the user flow
    }
  } catch (err) {
    console.error('Failed to send lead email:', err);
    // Don't throw - we don't want to block the user flow
  }
};

