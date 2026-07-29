export default function ArchMotif({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* mihrab arch outline */}
      <path
        d="M20 118V70C20 39 46 15 100 15C154 15 180 39 180 70V118"
        stroke="#C9A227"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M34 118V72C34 47 55 28 100 28C145 28 166 47 166 72V118"
        stroke="#C9A227"
        strokeWidth="1.2"
        strokeOpacity="0.55"
        strokeLinecap="round"
      />
      {/* hanging chain */}
      <line x1="100" y1="15" x2="100" y2="2" stroke="#C9A227" strokeWidth="1.4" />
      {/* crescent */}
      <path
        d="M94 12a6 6 0 1 0 6 10a7.5 7.5 0 0 1 -6 -10z"
        fill="#C9A227"
      />
      {/* small stars */}
      <circle cx="45" cy="46" r="1.6" fill="#C9A227" />
      <circle cx="155" cy="46" r="1.6" fill="#C9A227" />
      <circle cx="60" cy="30" r="1.2" fill="#C9A227" opacity="0.7" />
      <circle cx="140" cy="30" r="1.2" fill="#C9A227" opacity="0.7" />
    </svg>
  );
}
