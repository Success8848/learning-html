import type { Evidence } from "@/types";
import { incidents } from "./incidents";

export const evidence: Evidence[] = incidents.map((item) => ({
  id: item.evidenceId, incidentId: item.id, violation: item.violation, cameraId: item.cameraId,
  videoTimestamp: item.videoTimestamp, vehicleId: item.vehicleId, licensePlate: item.licensePlate,
  capturedAt: item.detectedAt, previewKind: "simulated-placeholder",
}));