import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Evidence, Incident, IncidentStatus } from "@/types";
import { trafficStore } from "@/backend/trafficStore";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseClient } from "@/backend/firebaseClient";

type AppState = { incidents: Incident[]; evidence: Evidence[]; addIncident: (incident: Incident) => void; updateIncidentStatus: (id: string, status: IncidentStatus) => Promise<void>; deleteIncident: (id: string) => Promise<void>; deleteEvidence: (id: string) => Promise<void>; authenticated: boolean; setAuthenticated: (value: boolean) => void };
const Context = createContext<AppState | null>(null);
export function AppStateProvider({ children }: { children: ReactNode }) {
	const [incidents, setIncidents] = useState(() => trafficStore.listIncidents());
	const [evidence, setEvidence] = useState(() => trafficStore.listEvidence());
	const [authenticated, setAuthenticated] = useState(true);
	useEffect(() => {
		const sync = () => { setIncidents(trafficStore.listIncidents()); setEvidence(trafficStore.listEvidence()); };
		const unsubscribe = trafficStore.subscribeStore(sync);
		const client = getFirebaseClient();
		if (!client) void trafficStore.hydrate();
		const unsubscribeAuth = client ? onAuthStateChanged(client.auth, (user) => {
			setAuthenticated(Boolean(user));
			if (user) void trafficStore.hydrate();
		}) : undefined;
		return () => { unsubscribe(); unsubscribeAuth?.(); };
	}, []);
	const value = useMemo(() => ({ incidents, evidence, addIncident: (incident: Incident) => setIncidents((current) => [incident, ...current]), updateIncidentStatus: (id: string, status: IncidentStatus) => trafficStore.updateIncidentStatus(id, status), deleteIncident: (id: string) => trafficStore.deleteIncident(id), deleteEvidence: (id: string) => trafficStore.deleteEvidence(id), authenticated, setAuthenticated }), [incidents, evidence, authenticated]);
	return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAppState() { const context = useContext(Context); if (!context) throw new Error("useAppState must be used inside AppStateProvider"); return context; }