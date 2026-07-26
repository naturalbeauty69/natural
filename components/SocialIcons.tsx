// Minimal monoline glyphs (not brand logos) styled to match the
// botanical/molecular divider motif — thin strokes, currentColor.

export function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M14 8.5h2V6h-2c-1.7 0-3 1.3-3 3v2H9v2.2h2V19h2.4v-5.8H16l.4-2.2h-3V9c0-.3.3-.5.6-.5Z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9.2" />
    </svg>
  );
}

export function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path
        d="M13 3v11.2a3 3 0 1 1-2.2-2.9M13 3c.4 2.3 2.1 4 4.6 4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
