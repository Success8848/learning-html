import type { ApiResponse } from "@/types";

const wait = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockRequest<T>(data: T): Promise<ApiResponse<T>> {
  await wait();
  return { data, generatedAt: new Date().toISOString(), source: "demo" };
}