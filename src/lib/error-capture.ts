let lastCapturedError: Error | undefined;

export function captureError(error: Error): void {
  lastCapturedError = error;
}

export function consumeLastCapturedError(): Error | undefined {
  const error = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
