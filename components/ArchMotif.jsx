export default function ArchMotif({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="jaali"
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path
            d="M7 0 L14 7 L7 14 L0 7 Z"
            fill="none"
            stroke="#C9A227"
            strokeWidth="0.6"
            opacity="0.55"
          />
          <circle cx="7" cy="7" r="1" fill="#C9A227" opacity="0.4" />
        </pattern>
        <linearGradient id="archFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0D687" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#C9A227" stopOpacity="0.05" />
        </linearGradient>
        <clipPath id="archClip">
          <path d="M40 148V78C40 42 62 18 100 18C138 18 160 42 160 78V148Z" />
        </clipPath>
      </defs>

      {/* lattice fill inside arch */}
      <g clipPath="url(#archClip)">
        <rect x="30" y="10" width="140" height="140" fill="url(#archFill)" />
        <rect x="30" y="10" width="140" height="140" fill="url(#jaali)" />
      </g>

      {/* outer arch line */}
      <path
        d="M40 148V78C40 42 62 18 100 18C138 18 160 42 160 78V148"
        stroke="#C9A227"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* inner arch line */}
      <path
        d="M52 148V80C52 52 70 32 100 32C130 32 148 52 148 80V148"
        stroke="#F0D687"
        strokeWidth="1.1"
        opacity="0.7"
        strokeLinecap="round"
      />

      {/* hanging chain */}
      <line x1="100" y1="18" x2="100" y2="4" stroke="#C9A227" strokeWidth="1.3" />
      <circle cx="100" cy="2" r="1.6" fill="#F0D687" />

      {/* crescent + star finial */}
      <path
        d="M93 8a6.5 6.5 0 1 0 7 11a8 8 0 0 1 -7 -11z"
        fill="#F0D687"
      />
      <circle cx="108" cy="9" r="1.4" fill="#F0D687" />

      {/* base flourish dots */}
      <circle cx="40" cy="148" r="1.6" fill="#C9A227" />
      <circle cx="160" cy="148" r="1.6" fill="#C9A227" />
    </svg>
  );
}