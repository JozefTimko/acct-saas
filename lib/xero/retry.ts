import { RetryConfig, DEFAULT_RETRY_CONFIG } from './types';

export class RetryError extends Error {
  constructor(
    message: string,
    public readonly originalError: Error,
    public readonly attempt: number,
    public readonly maxAttempts: number
  ) {
    super(message);
    this.name = 'RetryError';
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on the last attempt
      if (attempt === config.maxAttempts) {
        throw new RetryError(
          `Operation failed after ${config.maxAttempts} attempts`,
          lastError,
          attempt,
          config.maxAttempts
        );
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1),
        config.maxDelay
      );
      
      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 0.1 * delay;
      const totalDelay = delay + jitter;
      
      console.log(`Attempt ${attempt} failed, retrying in ${Math.round(totalDelay)}ms:`, lastError.message);
      
      await new Promise(resolve => setTimeout(resolve, totalDelay));
    }
  }
  
  // This should never be reached, but TypeScript needs it
  throw new RetryError(
    'Operation failed after all attempts',
    lastError!,
    config.maxAttempts,
    config.maxAttempts
  );
}

export function isRetryableError(error: any): boolean {
  // Check for common retryable error conditions
  if (error?.status === 429) return true; // Rate limited
  if (error?.status >= 500) return true; // Server errors
  if (error?.code === 'ECONNRESET') return true; // Connection reset
  if (error?.code === 'ETIMEDOUT') return true; // Timeout
  if (error?.message?.includes('timeout')) return true; // Generic timeout
  
  return false;
}
