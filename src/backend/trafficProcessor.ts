import type { DemoVideo, Evidence, Incident, IncidentStatus, Severity, ViolationType } from "@/types";

export type VideoDetection = {
  videoId: string;
  violation: ViolationType;
  timestamp: string;
  cameraId: string;
  severity: Severity;
  vehicleId?: string;
  licensePlate?: string;
  location?: string;
  status?: IncidentStatus;
  evidencePreview?: string;
  sourceVideoName?: string;
};

export type ProcessedDetection = {
  incident: Incident;
  evidence: Evidence;
};

const timestampPattern = /^\d{2}:\d{2}(?::\d{2})?$/;

function normalizeTimestamp(timestamp: string): string {
  if (!timestampPattern.test(timestamp)) {
    throw new Error(`Invalid video timestamp "${timestamp}". Use MM:SS or HH:MM:SS.`);
  }

  return timestamp.length === 5 ? timestamp : timestamp.slice(-5);
}

function evidenceFilename(videoId: string, timestamp: string): string {
  return `${videoId}_${timestamp.replace(":", "-")}.jpg`;
}

export class TrafficProcessor {
  private incidentSequence: number;
  private evidenceSequence: number;

  constructor(lastIncidentNumber = 0, lastEvidenceNumber = 0) {
    this.incidentSequence = lastIncidentNumber;
    this.evidenceSequence = lastEvidenceNumber;
  }

  process(detection: VideoDetection, detectedAt = new Date().toISOString()): ProcessedDetection {
    const timestamp = normalizeTimestamp(detection.timestamp);
    const incidentNumber = ++this.incidentSequence;
    const evidenceNumber = ++this.evidenceSequence;
    const incidentId = `INC-${String(incidentNumber).padStart(4, "0")}`;
    const evidenceId = `EVD-${String(evidenceNumber).padStart(6, "0")}`;
    const evidencePath = `/evidence/${evidenceFilename(detection.videoId, timestamp)}`;

    const evidence: Evidence = {
      id: evidenceId,
      incidentId,
      violation: detection.violation,
      cameraId: detection.cameraId,
      videoTimestamp: timestamp,
      vehicleId: detection.vehicleId ?? "UNKNOWN",
      licensePlate: detection.licensePlate ?? "UNKNOWN",
      capturedAt: detectedAt,
      previewKind: "video-frame",
      filename: evidenceFilename(detection.videoId, timestamp),
      sourceVideoId: detection.videoId,
      path: evidencePath,
      previewDataUrl: detection.evidencePreview,
    };

    const incident: Incident = {
      id: incidentId,
      cameraId: detection.cameraId,
      violation: detection.violation,
      vehicleId: detection.vehicleId ?? "UNKNOWN",
      licensePlate: detection.licensePlate ?? "UNKNOWN",
      speed: null,
      speedLimit: null,
      videoTimestamp: timestamp,
      detectedAt,
      location: detection.location ?? "Unknown location",
      severity: detection.severity,
      status: detection.status ?? "new",
      evidenceId,
      evidencePath,
      evidencePreview: detection.evidencePreview,
      sourceVideoName: detection.sourceVideoName,
      createdAt: detectedAt,
      demoId: detection.videoId,
    };

    return { incident, evidence };
  }

  processDemo(video: DemoVideo, detectedAt?: string): ProcessedDetection {
    return this.process(
      {
        videoId: video.id,
        violation: video.violation,
        timestamp: video.triggerTimestamp,
        cameraId: video.cameraId,
        severity: video.severity,
        vehicleId: video.vehicleId,
        licensePlate: video.licensePlate,
        location: video.location,
      },
      detectedAt,
    );
  }
}