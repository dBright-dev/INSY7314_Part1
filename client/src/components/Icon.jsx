// client/src/components/Icon.jsx
// TypeScript version: export type IconName = "home" | "search" | ... (see App.tsx)

export default function Icon({ name, size = 20 }) {
    const paths = {
        home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
        search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
        calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
        chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
        user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.8-4.2 3.5-6 8-6s7.2 1.8 8 6" /></>,
        bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
        star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.8-5.4 2.8 1-6-4.4-4.3 6.1-.9L12 3Z" />,
        heart: <path d="M20.8 5.8a5.5 5.5 0 0 0-7.8 0L12 6.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z" />,
        arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
        clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v6l4 2" /></>,
        check: <path d="m5 12 4 4L19 6" />,
        sparkle: <><path d="m12 3 1.1 3.9L17 8l-3.9 1.1L12 13l-1.1-3.9L7 8l3.9-1.1L12 3Z" /><path d="m18.5 14 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" /></>,
        briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V4h6v3M3 12h18M10 12v2h4v-2" /></>,
        plus: <><path d="M12 5v14M5 12h14" /></>,
        shield: <><path d="M12 3 4.5 6v5.3c0 4.8 3 8.1 7.5 9.7 4.5-1.6 7.5-4.9 7.5-9.7V6L12 3Z" /><path d="m9 12 2 2 4-5" /></>,
        chevron: <path d="m9 18 6-6-6-6" />,
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {paths[name]}
        </svg>
    );
}