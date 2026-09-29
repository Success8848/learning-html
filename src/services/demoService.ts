import { demoVideos } from "@/mock/demoVideos";
import { mockRequest } from "./api";

export const demoService = {
  list: () => mockRequest(demoVideos),
  get: (id: string) => mockRequest(demoVideos.find((demo) => demo.id === id) ?? null),
};