import { createFileRoute, redirect } from "@tanstack/react-router";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  beforeLoad: () => { throw redirect({ to: "/dashboard" }); },
  head: () => ({ meta: [
    { title: "Nepal Traffic Monitoring System" },
    { name: "description", content: "Professional traffic monitoring and violation management dashboard." },
    { property: "og:title", content: "Nepal Traffic Monitoring System" },
    { property: "og:description", content: "Professional traffic monitoring and violation management dashboard." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});
