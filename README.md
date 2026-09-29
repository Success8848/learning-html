# TriNetra

TriNetra is a professional traffic-monitoring control-room frontend for the Nepal Traffic Monitoring and Violation Management System. It gives operators a single interface for reviewing camera status, simulated traffic incidents, evidence, analytics, and locally staged video files.

The project is currently a frontend demonstration. It uses realistic mock data and service abstractions so a production API, database, CCTV device network, and WebSocket server can be connected later.

## What the Application Does

The application represents the daily workflow of a traffic operations operator:

1. Open the operational dashboard to see camera health and recent violations.
2. Review or filter incidents by search text, violation type, severity, and status.
3. Open an incident to inspect its details and evidence references.
4. Check the evidence registry for stored traffic recordings.
5. Add local video files to the review queue from the Upload videos page.
6. Review aggregate violation patterns in Analytics.

All simulated content is labelled or described as demo data. The interface does not claim that placeholder camera feeds are live CCTV or that mock incidents are real AI detections.

## Technology Stack

- **React 19** for the component-based user interface.
- **TypeScript** for typed routes, components, services, and domain models.
- **Vite** for development and production bundling.
- **TanStack Start** for the application runtime and server-side rendering build.
- **TanStack Router** for file-based routing and generated route types.
- **TanStack Query** for the application query client and future API integration.
- **Tailwind CSS v4** for utility-first styling and design tokens.
- **Radix UI and shadcn/ui patterns** for accessible interface primitives such as buttons, inputs, selects, dialogs, progress bars, and tooltips.
- **Lucide React** for navigation and workflow icons.
- **Recharts** for analytics visualizations.
- **Sonner** for operator notifications and toast messages.
- **ESLint and Prettier** for code quality and formatting.

Framer Motion is not currently used. The application favors restrained enterprise UI patterns over decorative animation.

## Sidebar Navigation

The sidebar is defined in `src/components/app-shell.tsx`. It can be collapsed on desktop and opened as a drawer on smaller screens. The active page is highlighted, and collapsed items expose tooltips.

### Dashboard

Route: `/dashboard`

The operational overview shows:

- Today's and weekly violation counts.
- A camera monitoring placeholder with explicit connection status.
- Recent incidents with violation type, camera, license plate, and severity.
- A violation filter for the recent incident list.
- A **Simulate demo incident** action that adds a mock event to application state and displays a toast notification.
- Connection information indicating that the current WebSocket is disconnected in development mode.

### Incidents

Route: `/incidents`

The incident registry is the main review queue. Operators can:

- Search by incident ID, camera, violation, license plate, or location.
- Filter by violation type, severity, and status.
- Page through incident records.
- Open an incident detail page from the table.

Incident records are stored in the mock dataset and copied into local React application state so simulated dashboard events can appear in the registry during the session.

### Evidence

Route: `/evidence`

The evidence registry provides search and an empty-state view. It currently has no stored records because evidence persistence and backend media storage have not been connected yet.

### Upload videos

Route: `/upload`

The upload page is the local video staging workflow. It supports:

- Drag-and-drop or file selection.
- Multiple files at once.
- MP4, WebM, and MOV formats.
- Local browser video previews.
- Title and camera/location metadata displayed with queued files.
- Removing files from the queue.
- Simulated progress and ready states when files are added to the review queue.
- Toast feedback for invalid formats and successful queueing.

Uploads are created with browser object URLs and held in React state. They are not sent to a server and disappear when the page session is lost. A future implementation should replace `startUpload` with an API or multipart upload service and persist the returned video/evidence records.

### Analytics

Route: `/analytics`

Analytics uses Recharts and the mock analytics dataset to display:

- Violations by type.
- Violations by camera.
- Violations over time.
- Severity distribution.

These charts are intended to preserve the frontend contract that a real analytics API can later fulfill.

### Account area

The bottom of the sidebar displays the demo operator, role, and session label. **Logout** links to `/login`. Login and registration are present as demonstration pages; authentication currently uses the mock auth service and does not establish a production identity session.

## Other Routes

The current route tree also includes:

- `/` - entry route that leads into the application.
- `/login` - demo operator login.
- `/register` - demo operator registration.
- `/incidents/$id` - incident detail view.
- `/cameras/$id` - camera detail view.
- `/demo-library/$id` - predefined demo scenario detail view.

The original product brief also describes standalone Cameras, Demo Library, Users, and Settings pages. Those list or management pages are not currently present in the route tree; only the detail routes listed above are implemented for cameras and demo scenarios.

## Project Structure

```text
src/
  components/
    app-shell.tsx       Shared sidebar, header, responsive layout, and session footer
    common.tsx           Page headers, sections, badges, placeholders, and shared views
    data-table.tsx       Incident table and pagination components
    ui/                  Radix/shadcn-style reusable UI primitives
  config/
    app.ts               Application configuration
  lib/
    utils.ts             Shared class-name utilities
    error-capture.ts     Error capture helpers
  mock/
    analytics.ts         Chart data
    cameras.ts           Camera registry data
    demoVideos.ts        Predefined demo scenarios
    incidents.ts         Incident data
    evidence.ts          Evidence data
    users.ts             Demo users
  routes/                TanStack file-based route components
  services/
    api.ts               Mock request wrapper and API response shape
    authService.ts       Demo authentication boundary
    demoService.ts       Demo scenario access boundary
    evidenceService.ts   Evidence access boundary
    incidentService.ts   Incident access boundary
    analyticsService.ts  Analytics access boundary
    websocketService.ts  Simulated incident event boundary
  state/
    app-state.tsx        Session-level incident and authentication state
  types/
    index.ts              Shared domain types
```

`src/routeTree.gen.ts` is generated by TanStack Router. It should be regenerated by the project tooling when routes are added or removed rather than manually maintained.

## Local Development

Requirements: Node.js with npm available.

```bash
npm install
npm run dev
```

The development server will print the local URL. The useful entry points are `/login` and `/dashboard`.

## Useful Commands

```bash
npm run dev       # Start Vite development mode
npm run build     # Build client, SSR, and Nitro output
npm run build:dev # Build using development mode
npm run preview   # Preview the production build
npm run lint      # Run ESLint across the repository
npm run format    # Format the repository with Prettier
```

## Current Limitations and Next Integrations

- Camera feeds are visual placeholders; no CCTV or Android device stream is connected.
- WebSocket activity is simulated locally and currently reports as disconnected.
- Incidents, evidence, analytics, users, and authentication use mock or in-memory data.
- Uploaded videos are browser-local and are not persisted or processed.
- The evidence page is ready for records but has no connected media store.
- Production work should add API contracts, authentication, upload storage, video processing, evidence generation, WebSocket subscriptions, access control, and a database.

The existing service modules are the intended integration boundaries for those future backend connections.
