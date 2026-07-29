// Signature element (per frontend-design process): a thin line that
// begins as an organic leaf vein (Natural) and resolves into a
// molecular bond lattice (Science) — literalizing "Natural Beauty
// Clinic" x "Scientific Beauty" positioning. Used between every
// major section instead of a generic rule.

export default function BrandDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center py-2 ${className}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative, fluid-width SVG; next/image needs a sized container which doesn't fit this inline divider */}
      <img
        src="/images/brand/botanical-line.svg"
        alt=""
        className="w-full max-w-3xl opacity-80"
      />
    </div>
  );
}
