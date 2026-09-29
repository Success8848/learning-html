import { trafficStore } from "@/backend/trafficStore";
import { mockRequest } from "./api";

export const incidentService = {
  list: () => mockRequest(trafficStore.listIncidents()),
  get: (id: string) => mockRequest(trafficStore.listIncidents().find((incident) => incident.id === id) ?? null),
};