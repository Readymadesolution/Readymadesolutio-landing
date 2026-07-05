/* Console UI icons — inline, stroke = currentColor, consistent 1.6 weight, 20px. */
type P = { className?: string };
const base = (className?: string) => ({
  viewBox: "0 0 20 20",
  fill: "none",
  className,
  "aria-hidden": true as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function DashboardIcon({ className }: P) {
  return (
    <svg {...base(className)}>
      <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" />
      <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" />
      <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" />
      <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" />
    </svg>
  );
}

export function LeadsIcon({ className }: P) {
  return (
    <svg {...base(className)}>
      <path d="M13.5 17v-1.5a3 3 0 0 0-3-3h-5a3 3 0 0 0-3 3V17" />
      <circle cx="8" cy="6" r="3" />
      <path d="M17.5 17v-1.5a3 3 0 0 0-2.25-2.9" />
    </svg>
  );
}

export function CalendarIcon({ className }: P) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="4.5" width="14" height="12.5" rx="2" />
      <path d="M3 8h14M7 3v3M13 3v3" />
    </svg>
  );
}

export function TeamIcon({ className }: P) {
  return (
    <svg {...base(className)}>
      <circle cx="7.5" cy="7" r="3" />
      <path d="M2.5 16.5v-1a3.5 3.5 0 0 1 3.5-3.5h3a3.5 3.5 0 0 1 3.5 3.5v1" />
      <path d="M15 7.5h3.5M16.75 5.75v3.5" />
    </svg>
  );
}

export function SettingsIcon({ className }: P) {
  return (
    <svg {...base(className)}>
      <path d="M3 6h9M15 6h2" />
      <path d="M3 14h2M8 14h9" />
      <circle cx="13.5" cy="6" r="2" />
      <circle cx="6.5" cy="14" r="2" />
    </svg>
  );
}

export function SearchIcon({ className }: P) {
  return (
    <svg {...base(className)}>
      <circle cx="9" cy="9" r="5.5" />
      <path d="m17 17-3.2-3.2" />
    </svg>
  );
}

export function PlusIcon({ className }: P) {
  return (
    <svg {...base(className)}>
      <path d="M10 4.5v11M4.5 10h11" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: P) {
  return (
    <svg {...base(className)}>
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  );
}

export function BellIcon({ className }: P) {
  return (
    <svg {...base(className)}>
      <path d="M6 8a4 4 0 0 1 8 0c0 4 1.5 5 1.5 5h-11S6 12 6 8Z" />
      <path d="M8.5 16a1.75 1.75 0 0 0 3 0" />
    </svg>
  );
}
