import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, SearchField, Section, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MagnifiableEvidenceImage } from "@/components/magnifiable-evidence-image";
import { Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAppState } from "@/state/app-state";
import type { Evidence } from "@/types";

export const Route = createFileRoute("/evidence")({ head: () => ({ meta: [{ title: "Evidence — Nepal Traffic Monitor" }, { name: "description", content: "Evidence registry for stored traffic recordings." }, { property: "og:title", content: "Traffic Evidence Registry" }, { property: "og:description", content: "Evidence registry for stored traffic recordings." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: EvidencePage });
function EvidencePage() {
	const [query, setQuery] = useState("");
	const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
	const [savingStatus, setSavingStatus] = useState(false);
	const { evidence, incidents, deleteEvidence, updateIncidentStatus } = useAppState();
	const filtered = evidence.filter((item) =>
		`${item.id} ${item.incidentId} ${item.violation} ${item.cameraId} ${item.licensePlate}`
			.toLowerCase()
			.includes(query.toLowerCase()),
	);
	const selectedIncident = incidents.find((incident) => incident.id === selectedEvidence?.incidentId);
	const selectedPreview = selectedEvidence?.previewDataUrl ?? selectedIncident?.evidencePreview;

	async function setStatus(status: "resolved" | "pending") {
		if (!selectedEvidence) return;
		setSavingStatus(true);
		try {
			await updateIncidentStatus(selectedEvidence.incidentId, status);
			toast.success(status === "resolved" ? "Incident approved" : "Incident kept pending");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not update incident status");
		} finally {
			setSavingStatus(false);
		}
	}

	return (
		<AppShell>
			<PageHeader title="Evidence" description="Stored incident evidence snapshots." />
			<Dialog open={selectedEvidence !== null} onOpenChange={(open) => !open && setSelectedEvidence(null)}>
				<Section
					title="Evidence registry"
					description={`${filtered.length} stored records`}
					action={<SearchField value={query} onChange={setQuery} placeholder="Search evidence" />}
				>
					{filtered.length ? (
						<div className="divide-y divide-border">
							{filtered.map((item) => {
								const incident = incidents.find((candidate) => candidate.id === item.incidentId);
								const preview = item.previewDataUrl ?? incident?.evidencePreview;
								return (
									<div key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
										<div className="h-24 w-32 shrink-0 overflow-hidden border border-border bg-background">
											{preview ? (
												<button
													type="button"
													aria-label={`Open evidence photo ${item.id}`}
													onClick={() => setSelectedEvidence(item)}
													className="h-full w-full cursor-zoom-in"
												>
													<img src={preview} alt={`Evidence ${item.id}`} className="h-full w-full object-cover" />
												</button>
											) : (
												<div className="flex h-full items-center justify-center text-xs text-muted-foreground">No preview</div>
											)}
										</div>
										<div className="min-w-0 flex-1">
											<p className="font-mono text-sm">{item.id}</p>
											<p className="mt-1 text-sm">{item.violation} · {item.cameraId}</p>
											<p className="mt-1 text-xs text-muted-foreground">Incident {item.incidentId}</p>
										</div>
										<Button type="button" variant="ghost" size="icon" aria-label={`Delete ${item.id}`} onClick={() => void deleteEvidence(item.id)}>
											<Trash2 />
										</Button>
									</div>
								);
							})}
						</div>
					) : (
						<div className="flex min-h-[260px] items-center justify-center border border-dashed border-border bg-card/40 p-8 text-center">
							<div><p className="text-base font-medium">No evidence available</p><p className="mt-2 text-sm text-muted-foreground">Evidence will appear here once it is captured and stored.</p></div>
						</div>
					)}
				</Section>
				{selectedEvidence && selectedPreview && (
					  <DialogContent className="fixed inset-0 left-0 top-0 z-50 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 data-[state=open]:animate-none sm:rounded-none">
						<DialogHeader className="shrink-0 border-b border-border px-5 py-4 pr-12">
							<DialogTitle>Incident evidence</DialogTitle>
							<DialogDescription>{selectedEvidence.incidentId} · {selectedEvidence.licensePlate}</DialogDescription>
						</DialogHeader>
						<div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black p-2 sm:p-6">
							<MagnifiableEvidenceImage src={selectedPreview} alt={`Enlarged evidence ${selectedEvidence.id}`} />
						</div>
						<DialogFooter className="shrink-0 flex-row items-center justify-between gap-2 border-t border-border p-4">
							{selectedIncident && <StatusBadge value={selectedIncident.status} />}
							<div className="ml-auto flex flex-wrap justify-end gap-2">
								<Button type="button" variant="outline" disabled={savingStatus} onClick={() => void setStatus("pending")}>Keep pending</Button>
								{selectedIncident && selectedIncident.status !== "resolved" && <Button type="button" disabled={savingStatus} onClick={() => void setStatus("resolved")}><Check />Approve</Button>}
							</div>
						</DialogFooter>
					</DialogContent>
				)}
			</Dialog>
		</AppShell>
	);
}