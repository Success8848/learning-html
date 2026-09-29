import type { DemoVideo } from "@/types";

export const demoVideos: DemoVideo[] = [
  {
    id: "NO_HELMET_TRIPLE_RIDING",
    name: "No Helmet & Triple Riding",
    violation: "No Helmet & Triple Riding",
    triggerTimestamp: "00:03",
    cameraId: "CAM-001",
    evidenceStatus: "ready",
    status: "available",
    severity: "high",
    vehicleId: "Bike",
    licensePlate: "Jay Shree Ram",
    location: "Uploaded video",
    evidenceId: "EVD-UPLOAD-TRIPLE-RIDING",
  },

  {
    id: "WRONG_LANE_01",
    name: "wrong lane 1",
    violation: "Wrong Lane",
    triggerTimestamp: "00:02",
    cameraId: "CAM-001",
    evidenceStatus: "ready",
    status: "available",
    severity: "high",
    vehicleId: "Bus",
    licensePlate: "BA 2 KHA 1419",
    location: "Uploaded video",
    evidenceId: "EVD-WRONG-LANE-01",
  },
];