/** Total time budget across attempts. */
export class TimeoutBudget {
  private readonly deadline: number;

  constructor(totalMs: number) {
    this.deadline = Date.now() + totalMs;
  }

  remaining(): number {
    return Math.max(0, this.deadline - Date.now());
  }

  exhausted(): boolean {
    return this.remaining() <= 0;
  }

  /** AbortSignal that fires when the remaining budget elapses. */
  signalForAttempt(): { signal: AbortSignal; clear: () => void } {
    const controller = new AbortController();
    const remaining = this.remaining();
    if (remaining <= 0) {
      controller.abort();
      return { signal: controller.signal, clear: () => undefined };
    }
    const timer = setTimeout(() => controller.abort(), remaining);
    return {
      signal: controller.signal,
      clear: () => clearTimeout(timer),
    };
  }
}
