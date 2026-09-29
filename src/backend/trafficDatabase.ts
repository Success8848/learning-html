import type { Evidence, Incident } from "@/types";

const databaseName = "trinetra-traffic";
const databaseVersion = 1;
const videoStore = "videos";
const incidentStore = "incidents";
const evidenceStore = "evidence";

type StoredVideo = { id: string; name: string; file: File; uploadedAt: string };

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(videoStore)) database.createObjectStore(videoStore, { keyPath: "id" });
      if (!database.objectStoreNames.contains(incidentStore)) database.createObjectStore(incidentStore, { keyPath: "id" });
      if (!database.objectStoreNames.contains(evidenceStore)) database.createObjectStore(evidenceStore, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function transaction<T>(storeName: string, mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const dbTransaction = database.transaction(storeName, mode);
    const request = operation(dbTransaction.objectStore(storeName));
    let result: T | undefined;
    request.onsuccess = () => {
      result = request.result;
    };
    request.onerror = () => reject(request.error);
    dbTransaction.oncomplete = () => resolve(result as T);
    dbTransaction.onerror = () => reject(dbTransaction.error ?? request.error);
    dbTransaction.onabort = () => reject(dbTransaction.error ?? request.error);
  });
}

export const trafficDatabase = {
  saveVideo: (video: StoredVideo) => transaction(videoStore, "readwrite", (store) => store.put(video)),
  saveIncident: (incident: Incident) => transaction(incidentStore, "readwrite", (store) => store.put(incident)),
  saveEvidence: (evidence: Evidence) => transaction(evidenceStore, "readwrite", (store) => store.put(evidence)),
  findVideo: (name: string) => transaction<StoredVideo | undefined>(videoStore, "readonly", (store) => store.get(name)),
  listIncidents: () => transaction<Incident[]>(incidentStore, "readonly", (store) => store.getAll()),
  listEvidence: () => transaction<Evidence[]>(evidenceStore, "readonly", (store) => store.getAll()),
  deleteVideo: (name: string) => transaction(videoStore, "readwrite", (store) => store.delete(name)),
  deleteIncident: (id: string) => transaction(incidentStore, "readwrite", (store) => store.delete(id)),
  deleteEvidence: (id: string) => transaction(evidenceStore, "readwrite", (store) => store.delete(id)),
};