import { ofetch } from "ofetch";
import type { FetchContext, FetchOptions, FetchResponse } from "ofetch";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://task-flow-backend-flax.vercel.app/api/v1";

const rawClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

const REFRESH_PATH = "/auth/refresh-token";

let refreshPromise: Promise<boolean> | null = null;

const refreshSession = (): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = rawClient
      .raw(REFRESH_PATH, { method: "POST", retry: 0 })
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

const shouldRetry = (context: FetchContext): boolean =>
  context.response?.status === 401 &&
  !(context.request as Request).url.includes("/auth/");

const apiClient = async <T>(
  request: string,
  options: FetchOptions<"json"> = {},
): Promise<T> => {
  try {
    return (await rawClient<T>(request, options)) as T;
  } catch (error) {
    if (!shouldRetry(error as FetchContext)) {
      throw error;
    }

    if (!(await refreshSession())) {
      throw error;
    }

    return (await rawClient<T>(request, options)) as T;
  }
};

apiClient.raw = rawClient.raw;

export type { FetchResponse };
export default apiClient;
