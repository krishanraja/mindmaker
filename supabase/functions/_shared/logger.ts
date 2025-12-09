/**
 * @file Structured Logging Utility for Edge Functions
 * @description Provides standardized logging format across all Supabase Edge Functions
 * @dependencies None (standalone utility)
 * @returns Logger object with level-specific methods
 * 
 * Usage:
 *   import { createLogger } from '../_shared/logger.ts';
 *   const logger = createLogger('function-name', requestId);
 *   logger.info('Processing request', { userId: '123' });
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface LogEntry {
  level: LogLevel;
  message: string;
  context: Record<string, unknown>;
  timestamp: string;
  requestId: string;
  functionName: string;
  sessionId?: string;
}

export interface Logger {
  debug: (message: string, context?: Record<string, unknown>) => void;
  info: (message: string, context?: Record<string, unknown>) => void;
  warn: (message: string, context?: Record<string, unknown>) => void;
  error: (message: string, context?: Record<string, unknown>) => void;
  critical: (message: string, context?: Record<string, unknown>) => void;
  child: (additionalContext: Record<string, unknown>) => Logger;
}

/**
 * Creates a structured logger for edge functions
 * @param functionName - Name of the edge function
 * @param requestId - Unique request identifier
 * @param sessionId - Optional session ID for user tracking
 */
export function createLogger(
  functionName: string,
  requestId?: string,
  sessionId?: string
): Logger {
  const resolvedRequestId = requestId || generateRequestId();
  
  const log = (level: LogLevel, message: string, context: Record<string, unknown> = {}) => {
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      requestId: resolvedRequestId,
      functionName,
      ...(sessionId && { sessionId }),
    };
    
    const prefix = `[${resolvedRequestId}] [${level.toUpperCase()}]`;
    const contextStr = Object.keys(context).length > 0 ? ` ${JSON.stringify(context)}` : '';
    
    switch (level) {
      case 'debug':
        console.debug(`${prefix} ${message}${contextStr}`);
        break;
      case 'info':
        console.log(`${prefix} ${message}${contextStr}`);
        break;
      case 'warn':
        console.warn(`${prefix} ${message}${contextStr}`);
        break;
      case 'error':
      case 'critical':
        console.error(`${prefix} ${message}${contextStr}`);
        break;
    }
  };
  
  const createChild = (additionalContext: Record<string, unknown>): Logger => {
    return {
      debug: (msg, ctx = {}) => log('debug', msg, { ...additionalContext, ...ctx }),
      info: (msg, ctx = {}) => log('info', msg, { ...additionalContext, ...ctx }),
      warn: (msg, ctx = {}) => log('warn', msg, { ...additionalContext, ...ctx }),
      error: (msg, ctx = {}) => log('error', msg, { ...additionalContext, ...ctx }),
      critical: (msg, ctx = {}) => log('critical', msg, { ...additionalContext, ...ctx }),
      child: (moreContext) => createChild({ ...additionalContext, ...moreContext }),
    };
  };
  
  return {
    debug: (msg, ctx) => log('debug', msg, ctx),
    info: (msg, ctx) => log('info', msg, ctx),
    warn: (msg, ctx) => log('warn', msg, ctx),
    error: (msg, ctx) => log('error', msg, ctx),
    critical: (msg, ctx) => log('critical', msg, ctx),
    child: createChild,
  };
}

/**
 * Generates a unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Extracts request ID and session ID from request headers
 */
export function extractRequestContext(req: Request): { requestId: string; sessionId?: string } {
  const requestId = req.headers.get('x-request-id') || generateRequestId();
  const sessionId = req.headers.get('x-session-id') || undefined;
  return { requestId, sessionId };
}
