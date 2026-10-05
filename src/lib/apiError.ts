interface ApiErrorShape {
  message?: unknown;
  data?: { message?: unknown } | null;
  response?: {
    _data?: { message?: unknown } | null;
    status?: unknown;
  } | null;
  status?: number;
  statusCode?: number;
}

export function getApiErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again",
): string {
  const e = err as ApiErrorShape | null;
  const fromData = e?.data?.message;
  if (typeof fromData === "string" && fromData.trim()) {
    return fromData;
  }
  const fromResponse = e?.response?._data?.message;
  if (typeof fromResponse === "string" && fromResponse.trim()) {
    return fromResponse;
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}

export function getApiErrorStatus(err: unknown): number | null {
  const e = err as ApiErrorShape | null;
  if (typeof e?.status === "number") {
    return e.status;
  }
  if (typeof e?.statusCode === "number") {
    return e.statusCode;
  }
  if (typeof e?.response?.status === "number") {
    return e.response.status;
  }
  return null;
}
