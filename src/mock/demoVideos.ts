import type { DemoVideo } from "@/types";

export const demoVideos: DemoVideo[] = [
  {
    id: "00101",
    name: "no helmet&triple riding",
    violation: "No Helmet & Triple Riding",
    triggerTimestamp: "00:04",
    cameraId: "CAM-001",
    evidenceStatus: "ready",
    status: "available",
    severity: "high",
    vehicleId: "Bike",
    licensePlate: "Jay Shree Ram",
    location: "Uploaded video",
    evidenceId: "EVD-00101",
  },

  {
    id: "010100",
    name: "wrong lane 1",
    violation: "Wrong Lane",
    triggerTimestamp: "00:01",
    cameraId: "CAM-001",
    evidenceStatus: "ready",
    status: "available",
    severity: "high",
    vehicleId: "Bus",
    licensePlate: "BA 2 KHA 9419",
    location: "Uploaded video",
    evidenceId: "EVD-010100",
  },

  {
    id: "0110",
    name: "triple_riding2",
    violation: "Triple Riding",
    triggerTimestamp: "00:02",
    cameraId: "CAM-001",
    evidenceStatus: "ready",
    status: "available",
    severity: "medium",
    vehicleId: "Bike",
    licensePlate: "BA Pradesh 02 010 PA 979",
    location: "Uploaded video",
    evidenceId: "EVD-0110",
  },

  {
    id: "001100",
    name: "signal_jump1",
    violation: "Signal Jumping",
    triggerTimestamp: "00:03",
    cameraId: "CAM-001",
    evidenceStatus: "ready",
    status: "available",
    severity: "medium",
    vehicleId: "Car",
    licensePlate: "BJ17 TFK",
    location: "Uploaded video",
    evidenceId: "EVD-001100",
  },
  {
    id: "0001001",
    name: "over_speed1",
    violation: "Over Speeding",
    triggerTimestamp: "00:01",
    cameraId: "CAM-001",
    evidenceStatus: "ready",
    status: "available",
    severity: "high",
    vehicleId: "Bike",
    licensePlate: "BJ17 TFK",
    location: "Uploaded video",
    evidenceId: "EVD-0001001",
  },
];

function normalizeDemoName(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .toUpperCase()
    .match(/[A-Z]+|\d+/g)
    ?.map((part) => (/^\d+$/.test(part) ? String(Number(part)) : part))
    .join("_") ?? "";
}

export function findDemoVideoByName(name: string): DemoVideo | undefined {
  const normalizedName = normalizeDemoName(name);
  return demoVideos.find((video) =>
    [video.id, video.name].some((candidate) => normalizeDemoName(candidate) === normalizedName),
  );
}