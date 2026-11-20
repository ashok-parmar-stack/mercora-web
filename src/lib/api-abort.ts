import axios from 'axios';

export interface AbortableRequestOptions {
  signal?: AbortSignal;
}

/**
 * Checks if an error was caused by an aborted/canceled HTTP request.
 * Supports standard Fetch DOMException, Axios CanceledError, and custom abort signals.
 */
export function isAbortError(error: unknown): boolean {
  if (!error) return false;

  // Axios cancellation
  if (axios.isCancel(error)) return true;

  if (typeof error === 'object') {
    const err = error as Record<string, any>;
    if (err.name === 'AbortError' || err.name === 'CanceledError') {
      return true;
    }
    if (err.code === 'ERR_CANCELED') {
      return true;
    }
    // Check inner cause or message
    if (typeof err.message === 'string' && (err.message.includes('canceled') || err.message.includes('aborted'))) {
      return true;
    }
  }

  return false;
}

/**
 * RequestAbortManager
 * ─────────────────────────────────────────────────────────────────────────────
 * Encapsulates an AbortController instance for tracking and aborting
 * previous in-flight requests before launching a subsequent request.
 */
export class RequestAbortManager {
  private controller: AbortController | null = null;

  /**
   * Aborts any currently active request and returns a new AbortSignal.
   */
  public nextSignal(): AbortSignal {
    this.abort('Canceled by subsequent request');
    this.controller = new AbortController();
    return this.controller.signal;
  }

  /**
   * Retrieves the current signal without aborting, or creates one if not present.
   */
  public currentSignal(): AbortSignal {
    if (!this.controller) {
      this.controller = new AbortController();
    }
    return this.controller.signal;
  }

  /**
   * Aborts the active in-flight request if present.
   */
  public abort(reason?: string): void {
    if (this.controller) {
      this.controller.abort(reason);
      this.controller = null;
    }
  }

  /**
   * Returns true if there is an active controller.
   */
  public isPending(): boolean {
    return this.controller !== null && !this.controller.signal.aborted;
  }
}
