"use client";

const LABELS = ["വിവരങ്ങൾ", "ഇനങ്ങൾ", "സ്ഥിരീകരണം"];

export default function StepDots({ step }) {
  return (
    <div className="flex items-center justify-center gap-2.5" aria-label={`Step ${step} of 3`}>
      {LABELS.map((label, i) => {
        const idx = i + 1;
        const active = idx === step;
        const done = idx < step;
        return (
          <div key={label} className="flex items-center gap-2.5">
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold transition-colors font-body",
                  done
                    ? "bg-gold text-night"
                    : active
                    ? "bg-night text-sand ring-4 ring-night/15"
                    : "bg-white text-ink/40 border border-sandline",
                ].join(" ")}
              >
                {done ? "✓" : idx}
              </div>
              <span
                className={[
                  "text-[11px] font-medium",
                  active ? "text-night" : "text-ink/40",
                ].join(" ")}
              >
                {label}
              </span>
            </div>
            {idx < 3 && (
              <div
                className={[
                  "mb-4 h-0.5 w-6 rounded-full sm:w-10",
                  done ? "bg-gold" : "bg-sandline",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
