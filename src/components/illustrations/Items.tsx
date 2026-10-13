interface SvgProps {
  className?: string;
}

/** Flat item artwork used on feed cards. All share a roughly 240 x 160 canvas. */

export function Bicycle({ className }: SvgProps) {
  return (
    <svg viewBox="-125 -70 250 145" className={className} aria-hidden="true">
      <circle cx="-70" cy="20" r="44" fill="none" stroke="#1C1C1E" strokeWidth="6" />
      <circle cx="70" cy="20" r="44" fill="none" stroke="#1C1C1E" strokeWidth="6" />
      <circle cx="-70" cy="20" r="34" fill="none" stroke="#1C1C1E" strokeWidth="1.5" />
      <circle cx="70" cy="20" r="34" fill="none" stroke="#1C1C1E" strokeWidth="1.5" />
      <path
        d="M-70 20 L-30 -35 L45 -35 L70 20 M-70 20 L-5 20 L-30 -35 M-5 20 L45 -35 M45 -35 L38 -55 L60 -55 M-44 -40 L-16 -40"
        fill="none"
        stroke="#1C1C1E"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="-5" cy="20" r="7" fill="#FF6B57" />
    </svg>
  );
}

export function Phone({ className }: SvgProps) {
  return (
    <svg viewBox="-60 -70 120 140" className={className} aria-hidden="true">
      <rect x="-34" y="-62" width="68" height="124" rx="14" fill="#3B5BDB" />
      <rect x="-28" y="-56" width="56" height="112" rx="10" fill="#FFFFFF" fillOpacity="0.2" />
      <rect x="-10" y="-52" width="20" height="6" rx="3" fill="#3B5BDB" />
      <circle cx="18" cy="-30" r="7" fill="#FFFFFF" fillOpacity="0.5" />
    </svg>
  );
}

export function Laptop({ className }: SvgProps) {
  return (
    <svg viewBox="-110 -65 220 130" className={className} aria-hidden="true">
      <rect x="-78" y="-56" width="156" height="98" rx="10" fill="#2B2B30" />
      <rect x="-68" y="-48" width="136" height="82" rx="4" fill="#10B981" fillOpacity="0.25" />
      <rect x="-98" y="42" width="196" height="12" rx="6" fill="#3A3A40" />
      <circle cx="0" cy="-7" r="10" fill="#FFFFFF" fillOpacity="0.35" />
    </svg>
  );
}

export function Earbuds({ className }: SvgProps) {
  return (
    <svg viewBox="-60 -66 120 114" className={className} aria-hidden="true">
      <rect x="-46" y="-26" width="92" height="66" rx="30" fill="#FFFFFF" stroke="#1C1C1E" strokeWidth="3" />
      <path d="M-46 2 H46" fill="none" stroke="#1C1C1E" strokeWidth="3" strokeLinecap="round" />
      <circle cx="0" cy="22" r="4" fill="#10B981" />
      <circle cx="-24" cy="-48" r="10" fill="#FFFFFF" stroke="#1C1C1E" strokeWidth="3" />
      <circle cx="24" cy="-48" r="10" fill="#FFFFFF" stroke="#1C1C1E" strokeWidth="3" />
    </svg>
  );
}

export function KeyRing({ className }: SvgProps) {
  return (
    <svg viewBox="-50 -50 200 110" className={className} aria-hidden="true">
      <circle cx="0" cy="0" r="30" fill="none" stroke="#1C1C1E" strokeWidth="6" />
      <rect x="24" y="-7" width="110" height="14" rx="7" fill="#F5B93A" />
      <rect x="98" y="7" width="9" height="20" rx="3" fill="#F5B93A" />
      <rect x="116" y="7" width="9" height="14" rx="3" fill="#F5B93A" />
      <circle cx="0" cy="0" r="8" fill="#FF6B57" />
    </svg>
  );
}

export function IdCard({ className }: SvgProps) {
  return (
    <svg viewBox="-70 -80 140 150" className={className} aria-hidden="true">
      <path d="M-14 -74 Q0 -52 14 -74" fill="none" stroke="#1C1C1E" strokeWidth="4" strokeLinecap="round" />
      <rect x="-52" y="-56" width="104" height="122" rx="16" fill="#FFFFFF" stroke="#1C1C1E" strokeWidth="3" />
      <rect x="-10" y="-48" width="20" height="6" rx="3" fill="#1C1C1E" />
      <circle cx="0" cy="-10" r="18" fill="#10B981" />
      <rect x="-32" y="22" width="64" height="8" rx="4" fill="#1C1C1E" />
      <rect x="-22" y="40" width="44" height="6" rx="3" fill="#1C1C1E" fillOpacity="0.35" />
    </svg>
  );
}
