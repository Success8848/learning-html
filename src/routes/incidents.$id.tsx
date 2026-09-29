import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState, EvidencePlaceholder, PageHeader, Section, SeverityBadge, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MagnifiableEvidenceImage } from "@/components/magnifiable-evidence-image";
import { toast } from "sonner";
import { useAppState } from "@/state/app-state";

export const Route = createFileRoute("/incidents/$id")({
	head: ({ params }) => ({ meta: [{ title: `${params.id} — Incident Record` }] }),
	component: IncidentDetail,
});

function IncidentDetail() {
	const { id } = Route.useParams();
	const { incidents, evidence, deleteIncident, updateIncidentStatus } = useAppState();
	const navigate = useNavigate({ from: "/incidents/$id" });
	const [evidenceOpen, setEvidenceOpen] = useState(false);
	const [savingStatus, setSavingStatus] = useState(false);
	const incident = incidents.find((item) => item.id === id);

	if (!incident) return <AppShell><EmptyState title="Incident not found" description="This incident is not present in the records." /></AppShell>;
	const evidencePreview = incident.evidencePreview ?? evidence.find((item) => item.id === incident.evidenceId)?.previewDataUrl;

	const fields = [
		["Camera", incident.cameraId],
		["Location", incident.location],
		["Violation", incident.violation],
		["Vehicle", incident.vehicleId],
		["License plate", incident.licensePlate],
		["Speed", incident.speed === null ? "-" : `${incident.speed} km/h`],
		["Speed limit", incident.speedLimit === null ? "-" : `${incident.speedLimit} km/h`],
	];

	async function setStatus(status: "resolved" | "pending") {
		setSavingStatus(true);
		try {
			await updateIncidentStatus(incident.id, status);
			toast.success(status === "resolved" ? "Incident approved" : "Incident kept pending");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not update incident status");
		} finally {
			setSavingStatus(false);
		}
	}

	return <AppShell>
		<PageHeader title={`Incident #${incident.id}`} description={incident.violation} actions={<div className="flex gap-2"><Button type="button" variant="outline" size="sm" onClick={() => void deleteIncident(incident.id).then(() => navigate({ to: "/incidents" }))}><Trash2 />Delete</Button><Button asChild variant="outline" size="sm"><Link to="/incidents"><ArrowLeft />All incidents</Link></Button></div>} />
		<div className="flex flex-wrap items-center gap-3 border border-border bg-card p-4"><SeverityBadge severity={incident.severity} /><StatusBadge value={incident.status} /><span className="font-mono text-xs text-muted-foreground">{incident.cameraId} · {incident.licensePlate}</span></div>
		<div className="grid gap-5 xl:grid-cols-[1fr_1.25fr]">
			<Section title="Incident information">
				<dl className="grid grid-cols-2 gap-x-6 gap-y-5 p-4">{fields.map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 text-sm font-medium">{value}</dd></div>)}</dl>
			</Section>
			<Dialog open={evidenceOpen} onOpenChange={setEvidenceOpen}>
				<Section title="Evidence" description={evidencePreview ? "Captured frame stored with this incident" : "Evidence frame is not available"}>
					<div className="p-4">{evidencePreview ? <button type="button" onClick={() => setEvidenceOpen(true)} aria-label="Open evidence photo" className="block w-full cursor-zoom-in border border-border bg-background"><img src={evidencePreview} alt="Incident evidence photo" className="max-h-[520px] w-full object-contain" /></button> : <EvidencePlaceholder timestamp={incident.videoTimestamp} showTimestamp={false} />}<p className="mt-3 font-mono text-xs text-muted-foreground">{incident.evidenceId}</p></div>
				</Section>
				{evidencePreview && <DialogContent className="fixed inset-0 left-0 top-0 z-50 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 data-[state=open]:animate-none sm:rounded-none">
					<DialogHeader className="shrink-0 border-b border-border px-5 py-4 pr-12"><DialogTitle>Incident evidence</DialogTitle><DialogDescription>{incident.id} · {incident.licensePlate}</DialogDescription></DialogHeader>
					<div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black p-2 sm:p-6"><MagnifiableEvidenceImage src={evidencePreview} alt="Enlarged incident evidence photo" /></div>
					<DialogFooter className="flex-row items-center justify-between gap-2 p-4"><StatusBadge value={incident.status} /><div className="flex flex-wrap justify-end gap-2"><Button type="button" variant="outline" disabled={savingStatus} onClick={() => void setStatus("pending")}>Keep pending</Button>{incident.status !== "resolved" && <Button type="button" disabled={savingStatus} onClick={() => void setStatus("resolved")}><Check />Approve</Button>}</div></DialogFooter>
				</DialogContent>}
			</Dialog>
		</div>
	</AppShell>;
}