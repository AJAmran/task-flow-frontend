import { ofetch } from "ofetch";
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://task-flow-backend-flax.vercel.app/api/v1";

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

export default apiClient;
