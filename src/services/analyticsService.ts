import { analytics } from "@/mock/analytics";
import { mockRequest } from "./api";

export const analyticsService = { get: () => mockRequest(analytics) };