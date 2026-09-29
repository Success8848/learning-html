import type { ReactNode } from "react";
import { AlertTriangle, Camera, ImageOff, Radio, Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Camera as CameraType, Severity } from "@/types";

export function PageHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-semibold text-foreground">{title}</h1><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>{actions && <div className="shrink-0">{actions}</div>}</div>;
}

export function Section({ title, description, action, children, className }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={cn("border border-border bg-card", className)}><div className="flex min-h-12 items-center justify-between gap-4 border-b border-border px-4 py-3"><div><h2 className="text-sm font-semibold text-foreground">{title}</h2>{description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}</div>{action}</div>{children}</section>;
}

export function MetricCard({ label, value, detail, tone = "neutral" }: { label: string; value: string | number; detail: string; tone?: "neutral" | "success" | "warning" | "critical" }) {
  const tones = { neutral: "bg-muted", success: "bg-success", warning: "bg-warning", critical: "bg-critical" };
  return <div className="border border-border bg-card px-4 py-3.5"><div className="flex items-center gap-2"><span className={cn("h-1.5 w-1.5 rounded-full", tones[tone])} /><span className="text-[11px] font-semibold uppercase text-muted-foreground">{label}</span></div><div className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</div><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>;
}

export function StatusBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const tone = normalized === "online" || normalized === "active" || normalized === "ready" || normalized === "resolved" || normalized === "available" ? "border-success/30 bg-success/10 text-success" : normalized === "offline" || normalized === "critical" || normalized === "inactive" ? "border-critical/30 bg-critical/10 text-critical" : normalized === "high" || normalized === "maintenance" || normalized === "pending" ? "border-warning/30 bg-warning/10 text-warning" : normalized === "demo" || normalized === "reviewing" ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground";
  return <Badge variant="outline" className={cn("h-5 rounded-sm px-1.5 text-[10px] font-semibold uppercase", tone)}>{value}</Badge>;
}

export function SeverityBadge({ severity }: { severity: Severity }) { return <StatusBadge value={severity} />; }

export function SearchField({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <div className="relative min-w-56"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="pl-9" /></div>;
}

export function FeedPlaceholder({ camera, large = false }: { camera: CameraType; large?: boolean }) {
  return <div className={cn("relative flex min-h-44 flex-col justify-between overflow-hidden bg-background", large && "min-h-80 lg:min-h-[440px]")}>
    <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:32px_32px]" />
    <div className="relative flex items-center justify-between p-3"><span className="font-mono text-xs font-semibold text-foreground">{camera.id}</span><StatusBadge value={camera.mode === "demo" ? "DEMO / SIMULATED" : camera.status} /></div>
    <div className="relative flex flex-1 flex-col items-center justify-center px-4 text-center"><Camera className="mb-3 h-7 w-7 text-muted-foreground" /><p className="text-xs font-semibold uppercase text-foreground">Camera feed</p><p className="mt-1 text-xs text-muted-foreground">Waiting for CCTV connection</p></div>
    <div className="relative flex items-center justify-between border-t border-border bg-card/80 px-3 py-2 text-[11px]"><span className="truncate text-muted-foreground">{camera.location}</span><span className="ml-3 font-mono text-muted-foreground">{camera.mode.toUpperCase()}</span></div>
  </div>;
}

export function EvidencePlaceholder({ timestamp, compact = false, showTimestamp = true }: { timestamp: string; compact?: boolean; showTimestamp?: boolean }) {
  return <div className={cn("relative flex min-h-48 flex-col items-center justify-center overflow-hidden border border-border bg-background", compact && "min-h-32")}><div className="absolute inset-0 opacity-20 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:24px_24px]" /><ImageOff className="relative mb-2 h-6 w-6 text-muted-foreground" /><span className="relative text-xs font-semibold uppercase">Evidence preview</span>{showTimestamp && <span className="relative mt-1 text-[11px] text-muted-foreground">Demo placeholder · Video {timestamp}</span>}</div>;
}

export function EmptyState({ title, description }: { title: string; description: string }) { return <div className="flex min-h-48 flex-col items-center justify-center p-6 text-center"><AlertTriangle className="mb-3 h-6 w-6 text-muted-foreground" /><p className="text-sm font-medium">{title}</p><p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p></div>; }

export function DetailLink({ to, params, children }: { to: "/incidents/$id"; params: { id: string }; children: ReactNode }) { return <Link to={to} params={params} className="font-medium text-primary hover:underline">{children}</Link>; }

export function ConnectionStrip() { return <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border border-border bg-card px-4 py-2 text-xs"><span className="flex items-center gap-2 text-warning"><Radio className="h-3.5 w-3.5" />WebSocket: Disconnected</span><span className="text-muted-foreground">Backend: Development Mode</span><span className="ml-auto text-muted-foreground">Frontend demonstration environment</span></div>; }