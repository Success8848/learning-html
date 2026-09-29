import type { Evidence, Incident, IncidentStatus } from "@/types";
import { demoVideos, findDemoVideoByName } from "@/mock/demoVideos";
import { evidence as initialEvidence } from "@/mock/evidence";
import { incidents as initialIncidents } from "@/mock/incidents";
import type { ProcessedDetection } from "./trafficProcessor";
import { trafficDatabase } from "./trafficDatabase";
import { hideFirebaseEvidence, hideFirebaseIncident, listFirebaseRecords, saveFirebaseProcessed } from "./firebaseTraffic";

type IncidentListener = (incident: Incident) => void;
type StoreListener = () => void;

function canonicalizeDemoIncident(incident: Incident): Incident {
  const demo = findDemoVideoByName(incident.demoId ?? "") ?? findDemoVideoByName(incident.sourceVideoName ?? "");
  if (!demo) return incident;
  return {
    ...incident,
    cameraId: demo.cameraId,
    violation: demo.violation,
    vehicleId: demo.vehicleId,
    licensePlate: demo.licensePlate,
    videoTimestamp: demo.triggerTimestamp,
    location: demo.location,
    severity: demo.severity,
    evidenceId: demo.evidenceId,
    demoId: demo.id,
  };
}

function canonicalizeDemoEvidence(evidence: Evidence, incident: Incident | undefined): Evidence {
  const demo = demoVideos.find((item) => item.id === incident?.demoId);
  if (!demo || !incident) return evidence;
  const filename = `${demo.id}_${demo.triggerTimestamp.replace(":", "-")}.jpg`;
  return {
    ...evidence,
    id: demo.evidenceId,
    incidentId: incident.id,
    violation: demo.violation,
    cameraId: demo.cameraId,
    videoTimestamp: demo.triggerTimestamp,
    vehicleId: demo.vehicleId,
    licensePlate: demo.licensePlate,
    previewKind: evidence.previewDataUrl || incident.evidencePreview ? "video-frame" : evidence.previewKind,
    filename,
    sourceVideoId: demo.id,
    path: `/evidence/${filename}`,
  };
}

class TrafficStore {
  private incidents = [...initialIncidents];
  private evidence = [...initialEvidence];
  private listeners = new Set<IncidentListener>();
  private storeListeners = new Set<StoreListener>();

  listIncidents(): Incident[] {
    return [...this.incidents];
  }

  listEvidence(): Evidence[] {
    return [...this.evidence];
  }

  nextSequenceNumbers(): { incident: number; evidence: number } {
    const incident = this.incidents.reduce((highest, item) => Math.max(highest, Number(item.id.replace("INC-", "")) || 0), 0);
    const evidence = this.evidence.reduce((highest, item) => Math.max(highest, Number(item.id.replace("EVD-", "")) || 0), 0);
    return { incident: incident + 1, evidence: evidence + 1 };
  }

  async hydrate(): Promise<void> {
    if (typeof indexedDB === "undefined") return;
    const [storedIncidents, storedEvidence, remoteRecords] = await Promise.all([
      trafficDatabase.listIncidents(),
      trafficDatabase.listEvidence(),
      listFirebaseRecords(),
    ]);
    const sourceIncidents = [...remoteRecords.incidents, ...storedIncidents, ...this.incidents, ...initialIncidents];
    const incidentRecords = sourceIncidents.map(canonicalizeDemoIncident);
    const sourceEvidence = [...remoteRecords.evidence, ...storedEvidence, ...this.evidence, ...initialEvidence];
    const evidenceRecords = sourceEvidence.map((item) => {
      const incident = sourceIncidents.find((candidate) => candidate.id === item.incidentId || candidate.evidenceId === item.id);
      return canonicalizeDemoEvidence(item, incident ? canonicalizeDemoIncident(incident) : undefined);
    }).sort((left, right) => new Date(right.capturedAt).getTime() - new Date(left.capturedAt).getTime());
    this.incidents = incidentRecords.filter((item, index, records) => !item.isHidden && records.findIndex((candidate) => candidate.id === item.id) === index);
    this.evidence = evidenceRecords.filter((item, index, records) => !item.isHidden && records.findIndex((candidate) => candidate.id === item.id) === index).map((item) => {
      const incident = this.incidents.find((candidate) => candidate.evidenceId === item.id);
      return incident?.evidencePreview && !item.previewDataUrl ? { ...item, previewDataUrl: incident.evidencePreview } : item;
    });
    this.storeListeners.forEach((listener) => listener());
  }

  subscribeStore(listener: StoreListener): () => void {
    this.storeListeners.add(listener);
    return () => this.storeListeners.delete(listener);
  }

  subscribe(listener: IncidentListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async add(processed: ProcessedDetection): Promise<ProcessedDetection> {
    const duplicate = this.incidents.find((incident) => incident.id === processed.incident.id);
    if (duplicate) {
      const duplicateEvidence = this.evidence.find((item) => item.id === duplicate.evidenceId);
      return { incident: duplicate, evidence: duplicateEvidence ?? processed.evidence };
    }
    if (typeof indexedDB !== "undefined") {
      await Promise.all([
        trafficDatabase.saveIncident(processed.incident),
        trafficDatabase.saveEvidence(processed.evidence),
      ]);
    }
    this.incidents = [processed.incident, ...this.incidents];
    this.evidence = [processed.evidence, ...this.evidence];
    this.listeners.forEach((listener) => listener(processed.incident));
    this.storeListeners.forEach((listener) => listener());
    return processed;
  }

  async hasVideo(name: string): Promise<boolean> {
    if (typeof indexedDB === "undefined") return false;
    return Boolean(await trafficDatabase.findVideo(name));
  }

  findProcessedByVideo(videoId: string, sourceVideoName?: string): ProcessedDetection | undefined {
    const incident = this.incidents.find((item) =>
      item.demoId === videoId ||
      findDemoVideoByName(item.demoId ?? "")?.id === videoId ||
      (sourceVideoName !== undefined && item.sourceVideoName?.toLowerCase() === sourceVideoName.toLowerCase()),
    );
    if (!incident) return undefined;
    const evidence = this.evidence.find((item) => item.id === incident.evidenceId);
    return evidence ? { incident, evidence } : undefined;
  }

  async updateProcessed(processed: ProcessedDetection): Promise<void> {
    const previousIncident = this.incidents.find((item) => item.id === processed.incident.id);
    const previousEvidence = previousIncident && this.evidence.find((item) => item.id === previousIncident.evidenceId);
    if (previousEvidence && previousEvidence.id !== processed.evidence.id) {
      const hiddenEvidence = { ...previousEvidence, isHidden: true };
      if (typeof indexedDB !== "undefined") await trafficDatabase.saveEvidence(hiddenEvidence);
      await hideFirebaseEvidence(hiddenEvidence);
    }
    this.incidents = previousIncident
      ? this.incidents.map((item) => item.id === processed.incident.id ? processed.incident : item)
      : [processed.incident, ...this.incidents];
    this.evidence = [
      processed.evidence,
      ...this.evidence.filter((item) => item.id !== processed.evidence.id && item.incidentId !== processed.incident.id && item.id !== previousEvidence?.id),
    ];
    if (typeof indexedDB !== "undefined") {
      await trafficDatabase.saveIncident(processed.incident);
      await trafficDatabase.saveEvidence(processed.evidence);
    }
    await saveFirebaseProcessed(processed);
    this.storeListeners.forEach((listener) => listener());
  }

  async updateIncidentStatus(id: string, status: IncidentStatus): Promise<void> {
    const incident = this.incidents.find((item) => item.id === id);
    const evidence = incident ? this.evidence.find((item) => item.id === incident.evidenceId) : undefined;
    if (!incident || !evidence) return;
    await this.updateProcessed({ incident: { ...incident, status }, evidence });
  }

  findIncidentForEvidenceImage(filename: string): ProcessedDetection | undefined {
    const stem = filename.replace(/\.[^.]+$/, "").toLowerCase();
    const visibleIncidents = this.incidents
      .filter((item) => !item.isHidden)
      .sort((a, b) => new Date(b.createdAt ?? b.detectedAt).getTime() - new Date(a.createdAt ?? a.detectedAt).getTime());
    const incident = visibleIncidents.find((item) => item.demoId?.toLowerCase() === stem || item.sourceVideoName?.replace(/\.[^.]+$/, "").toLowerCase() === stem) ?? visibleIncidents[0];
    if (!incident) return undefined;
    const evidence = this.evidence.find((item) => item.id === incident.evidenceId);
    return evidence ? { incident, evidence } : undefined;
  }

  async saveVideo(name: string, file: File, uploadedAt: string): Promise<void> {
    if (typeof indexedDB !== "undefined") await trafficDatabase.saveVideo({ id: name, name, file, uploadedAt });
  }

  async deleteIncident(id: string): Promise<void> {
    const incident = this.incidents.find((item) => item.id === id);
    const linkedEvidence = incident ? this.evidence.find((item) => item.id === incident.evidenceId) : undefined;
    this.incidents = this.incidents.filter((item) => item.id !== id);
    this.evidence = this.evidence.filter((item) => item.incidentId !== id);
    if (incident && typeof indexedDB !== "undefined") {
      await trafficDatabase.saveIncident({ ...incident, isHidden: true });
      if (linkedEvidence) await trafficDatabase.saveEvidence({ ...linkedEvidence, isHidden: true });
    }
    if (incident) await hideFirebaseIncident(incident, linkedEvidence);
    this.storeListeners.forEach((listener) => listener());
  }

  async deleteEvidence(id: string): Promise<void> {
    const evidence = this.evidence.find((item) => item.id === id);
    this.evidence = this.evidence.filter((item) => item.id !== id);
    this.incidents = this.incidents.map((incident) => {
      if (incident.evidenceId !== id) return incident;
      const { evidencePreview: _preview, evidencePath: _path, ...withoutEvidence } = incident;
      return withoutEvidence;
    });
    if (evidence && typeof indexedDB !== "undefined") await trafficDatabase.saveEvidence({ ...evidence, isHidden: true });
    if (evidence) await hideFirebaseEvidence(evidence);
    const linkedIncident = this.incidents.find((incident) => incident.evidenceId === id);
    if (linkedIncident && typeof indexedDB !== "undefined") await trafficDatabase.saveIncident(linkedIncident);
    this.storeListeners.forEach((listener) => listener());
  }
}

export const trafficStore = new TrafficStore();