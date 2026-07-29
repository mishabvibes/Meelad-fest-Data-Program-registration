"use client";

export default function ChoiceButton({
  selected,
  onClick,
  children,
  tag,
  fullWidth = true,
  disabled = false,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "focus-ring group relative flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all",
        fullWidth ? "w-full" : "",
        disabled
          ? "cursor-not-allowed opacity-40 border-sandline bg-white/50"
          : selected
          ? "border-night bg-night text-sand shadow-soft"
          : "border-sandline bg-white text-ink hover:border-gold active:scale-[0.99]",
      ].join(" ")}
    >
      <span className="flex items-center gap-2 text-[15px] font-medium leading-snug">
        {children}
        {tag ? (
          <span
            className={[
              "rounded-full px-2 py-0.5 text-[11px] font-semibold",
              selected ? "bg-gold text-night" : "bg-rose/10 text-rose",
            ].join(" ")}
          >
            {tag}
          </span>
        ) : null}
      </span>
      <span
        className={[
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected ? "border-gold bg-gold" : "border-sandline bg-transparent",
        ].join(" ")}
      >
        {selected ? (
          <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
            <path
              d="M4 10.5L8 14.5L16 5.5"
              stroke="#0B3B2E"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
    </button>
  );
}
