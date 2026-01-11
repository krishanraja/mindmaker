/**
 * Retry utility for edge functions
 * Implements exponential backoff and error classification
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryableErrors?: (error: Error) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  retryableErrors: (error: Error) => {
    // Retry on network errors, timeouts, and 5xx errors
    const message = error.message.toLowerCase();
    return (
      message.includes('timeout') ||
      message.includes('network') ||
      message.includes('econnreset') ||
      message.includes('etimedout') ||
      message.includes('500') ||
      message.includes('502') ||
      message.includes('503') ||
      message.includes('504') ||
      message.includes('429') // Rate limit - retry with backoff
    );
  },
};

/**
 * Determines if an error is retryable
 */
export function isRetryableError(error: Error, options?: RetryOptions): boolean {
  const retryableErrors = options?.retryableErrors || DEFAULT_OPTIONS.retryableErrors;
  return retryableErrors(error);
}

/**
 * Calculates delay for retry attempt with exponential backoff
 */
export function calculateRetryDelay(attempt: number, options?: RetryOptions): number {
  const initialDelay = options?.initialDelayMs || DEFAULT_OPTIONS.initialDelayMs;
  const maxDelay = options?.maxDelayMs || DEFAULT_OPTIONS.maxDelayMs;
  const multiplier = options?.backoffMultiplier || DEFAULT_OPTIONS.backoffMultiplier;
  
  const delay = Math.min(initialDelay * Math.pow(multiplier, attempt), maxDelay);
  return delay;
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retries a function with exponential backoff
 * @param fn - Function to retry
 * @param options - Retry configuration
 * @returns Result of function call
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const maxRetries = options?.maxRetries || DEFAULT_OPTIONS.maxRetries;
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry if error is not retryable
      if (!isRetryableError(lastError, options)) {
        throw lastError;
      }
      
      // Don't retry on last attempt
      if (attempt >= maxRetries) {
        throw lastError;
      }
      
      // Calculate delay and wait
      const delay = calculateRetryDelay(attempt, options);
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms delay`);
      await sleep(delay);
    }
  }
  
  throw lastError || new Error('Retry failed');
}
