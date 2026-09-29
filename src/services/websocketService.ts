import type { Incident } from "@/types";
import { demoVideos } from "@/mock/demoVideos";
import { TrafficProcessor } from "@/backend/trafficProcessor";
import { trafficStore } from "@/backend/trafficStore";

type Listener = (incident: Incident) => void;

class DemoWebSocketService {
  private readonly processor = new TrafficProcessor(124, 124);
  readonly connected = true;
  subscribe(listener: Listener) { return trafficStore.subscribe(listener); }
  simulateIncident() {
    const source = demoVideos[Math.floor(Math.random() * demoVideos.length)];
    if (!source) return;
    return trafficStore.add(this.processor.processDemo(source)).incident;
  }
}

export const websocketService = new DemoWebSocketService();