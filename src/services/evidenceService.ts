import { trafficStore } from "@/backend/trafficStore";
import { mockRequest } from "./api";

export const evidenceService = {
  list: () => mockRequest(trafficStore.listEvidence()),
  get: (id: string) => mockRequest(trafficStore.listEvidence().find((item) => item.id === id) ?? null),
};