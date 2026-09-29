# Nepal Traffic Monitoring Dashboard — Frontend Implementation Plan

## Scope and guardrails

Build a complete frontend-only control-room application using realistic, clearly labeled demo data.

- No backend, database, Android application, video upload, or real camera streaming.
- Never imply a real operational connection: camera placeholders say “Waiting for CCTV connection,” mock scenarios say “Demo / Simulated,” WebSocket defaults to disconnected, and backend status says development mode.
- Preserve API-shaped models and service boundaries so real REST and WebSocket integrations can replace mocks later without restructuring pages.

## Visual direction

- Restrained dark command-center interface: near-black canvas, charcoal panels, light neutral text, fine borders, compact spacing, and shallow depth.
- Use red, amber, and green only for severity, warnings, and health states; no decorative gradients, glow, glassmorphism, or futuristic effects.
- Use **IBM Plex Sans** for highly readable operational UI and **IBM Plex Mono** for IDs, timestamps, plates, and telemetry.
- Desktop-first shell with a compact collapsible sidebar, practical top bar, responsive drawer on smaller screens, horizontal table scrolling, and stable dashboard grids.
- Motion limited to drawer/dialog transitions, toast entrance, and subtle state changes, with reduced-motion support.

## Architecture

```text
src/
  components/
    layout/       app shell, sidebar, top bar, breadcrumbs
    common/       status chips, page headers, filters, empty/error/loading states
    cameras/      feed placeholder, camera cards, camera metadata
    incidents/    incident rows, severity/status controls, alert toast
    evidence/     evidence preview and evidence metadata
    analytics/    chart panels and legends
    users/        user table and add-user dialog
  config/         frontend connection defaults and navigation
  mock/           cameras, incidents, demo videos, evidence, analytics, users
  services/       API adapter plus domain services and mock WebSocket adapter
  state/          lightweight React context for mock auth, incidents, and connection/UI state
  types/          backend-ready domain and response types
  routes/         all requested public and dashboard routes
```

Services will return typed asynchronous results with small deterministic delays, giving screens realistic loading, empty, and error-ready behavior without network calls. The mock WebSocket service will expose subscribe/connect/disconnect/simulate methods but remain disconnected unless the user explicitly starts a local simulation.

## Implementation stages

### 1. Foundation and design system

- Define semantic Tailwind v4 tokens for surfaces, borders, typography, statuses, chart colors, shadows, and compact radii.
- Add reusable control-room primitives: `StatusBadge`, `MetricCard`, `PageHeader`, `DataState`, `FilterBar`, `FeedPlaceholder`, and `EvidencePlaceholder`.
- Customize existing shadcn controls rather than building raw controls.
- Add global metadata and route-specific metadata.

### 2. Typed demo-data and service layer

- Define `Camera`, `Incident`, `DemoVideo`, `Evidence`, `SystemUser`, `AnalyticsData`, paginated response, filter, and connection-event types.
- Add Nepal-focused, internally consistent records using Kathmandu Valley locations, realistic camera IDs, vehicle plates, timestamps, and cross-linked incident/evidence/demo IDs.
- Add mock implementations for auth, cameras, incidents, demos, evidence, analytics, users, and WebSocket events.
- Centralize future `API_BASE_URL` and `WEBSOCKET_URL` settings.

### 3. Shared application shell

- Add collapsible desktop sidebar and mobile drawer with all requested navigation.
- Add page title, contextual breadcrumb, backend development-mode status, disconnected WebSocket indicator, and operator profile.
- Add profile/role/logout controls at the sidebar footer.
- Keep `/login` and `/register` outside the dashboard shell.

### 4. Authentication screens

- Build professional `/login` and `/register` forms with frontend validation, password visibility controls, remember-me, forgot-password feedback, and demo sign-in behavior.
- Registration includes full name, email, password confirmation, and `ADMIN`/`OPERATOR` role selection.
- Authentication remains local in-memory demo state only; no account is persisted or created remotely.

### 5. Dashboard

- Build compact operational statistics for active/online cameras, today’s violations, critical violations, and pending incidents.
- Add a multi-camera monitoring grid with explicit demo/offline labels and no simulated live video.
- Add recent incidents, system health, camera connectivity, and a restrained violation trend chart.
- Add a “Simulate demo incident” control that uses the mock WebSocket adapter and produces an honest “Demo event” toast plus natural count/list updates.

### 6. Cameras

- `/cameras`: searchable, filterable camera management table/cards with status, mode, heartbeat, current demo, and actions.
- `/cameras/$id`: camera details, large feed placeholder, recent incidents, camera statistics, and future Android connection information.
- Unknown IDs render a useful not-found state.

### 7. Demo library

- `/demo-library`: predefined scenario catalogue with explicit `DEMO / SIMULATED` labeling and no upload controls.
- `/demo-library/$id`: scenario metadata, trigger timestamp, camera, vehicle, evidence reference, severity, and static monitoring preview.

### 8. Incidents and evidence

- `/incidents`: searchable, sortable, paginated table with violation, camera, severity, status, and date filters.
- `/incidents/$id`: formal incident record with clearly separated video timestamp and system detection time, source demo, and evidence preview.
- `/evidence`: searchable evidence gallery/table with a dialog-based detail view; placeholders are explicitly marked as previews, never real evidence.

### 9. Analytics, users, and settings

- `/analytics`: restrained Recharts visualizations for violation types, cameras, trends, severity, daily incidents, and weekly incidents.
- `/users`: searchable/filterable user table and frontend-only add-user dialog with validation and confirmation toast.
- `/settings`: profile, system, and connection settings; editable frontend configuration fields with honest development/disconnected states.

### 10. UX states and final verification

- Add skeletons, empty states, recoverable errors, tooltips, confirmations, keyboard focus, active navigation, toasts, and table overflow handling.
- Verify every route and dynamic detail link at desktop, laptop, tablet, and narrow widths.
- Verify sidebar collapse/mobile drawer, filters, pagination, sorting, dialogs, simulated events, logout/navigation, and form validation.
- Check runtime console, responsive screenshots, route metadata, TypeScript, and the latest build diagnostics; fix all visible and build errors before completion.

## Route map

- `/` redirects to `/dashboard`
- `/login`, `/register`
- `/dashboard`
- `/cameras`, `/cameras/$id`
- `/demo-library`, `/demo-library/$id`
- `/incidents`, `/incidents/$id`
- `/evidence`
- `/analytics`
- `/users`
- `/settings`

## Completion criteria

- Every requested route is navigable and populated with coherent demo data.
- No screen contains upload functionality or claims a real camera/backend/WebSocket connection.
- All repeated data comes from typed mock modules through service adapters.
- The control-room shell is polished and usable across supported screen sizes.
- All key interactions work in the preview with no build or runtime errors.
