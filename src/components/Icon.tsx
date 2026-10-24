const iconPaths = {
    user: (
        <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
        </>
    ),
    education: (
        <>
            <path d="m2 9 10-5 10 5-10 5L2 9Z" />
            <path d="M6 11v5c0 2 3 4 6 4s6-2 6-4v-5" />
            <path d="M22 9v7" />
        </>
    ),
    location: (
        <>
            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
        </>
    ),
    email: (
        <>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m3 6 9 7 9-7" />
        </>
    ),
    projects: (
        <>
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M2 12h20M10 12v2h4v-2" />
        </>
    ),
    clients: (
        <>
            <circle cx="9" cy="8" r="3" />
            <path d="M2 20v-2a7 7 0 0 1 14 0v2H2Z" />
            <path d="M16 5a3 3 0 0 1 0 6M18 14a6 6 0 0 1 4 6h-3" />
        </>
    ),
    technologies: (
        <>
            <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
        </>
    ),
    publications: (
        <>
            <path d="M6 3h9l4 4v14H6z" />
            <path d="M15 3v4h4M9 12h6M9 16h6" />
        </>
    ),
    calendar: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M7 3v4M17 3v4M3 10h18" />
            <path d="m9 16 2 2 4-4" />
        </>
    ),
};

interface IconProps {
    name: keyof typeof iconPaths;
    size?: number;
    className?: string;
}

export default function Icon({ name, size = 28, className }: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
            focusable="false"
        >
            {iconPaths[name]}
        </svg>
    );
}
