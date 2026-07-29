import Link from "next/link";

export default function SuccessPage({ searchParams }) {
  const regNo = searchParams?.regNo || "";
  const name = searchParams?.name || "";
  const category = searchParams?.category || "";
  const stage = searchParams?.stage || "";
  const off = searchParams?.off || "";

  if (!regNo) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4 text-center">
        <p className="font-mal text-[15px] text-ink/60">
          രജിസ്ട്രേഷൻ വിവരങ്ങൾ കണ്ടെത്താനായില്ല.
        </p>
        <Link
          href="/"
          className="focus-ring mt-4 rounded-2xl bg-night px-6 py-3 text-[15px] font-bold text-sand"
        >
          രജിസ്റ്റർ ചെയ്യുക
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-4 pb-10 pt-10 text-center">
      <div className="arch-frame arch-top-glow star-dots w-full overflow-hidden bg-night px-6 pb-8 pt-8 shadow-soft">
        <img src="/images/logo.png" alt="Logo" className="mx-auto mb-3 h-16 w-28 object-contain drop-shadow-lg" />
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
            <path
              d="M5 12.5L10 17.5L19 6.5"
              stroke="#0B3B2E"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="font-mal text-xl font-bold text-sand">രജിസ്ട്രേഷൻ പൂർത്തിയായി!</h1>
        <p className="mt-1 font-mal text-[14px] text-sand/70">{name}</p>

        <div className="mx-auto mt-5 w-fit rounded-2xl border border-gold/40 bg-white/5 px-6 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-goldlight/80">
            രജിസ്ട്രേഷൻ നമ്പർ
          </p>
          <p className="font-body text-2xl font-bold tracking-wider text-goldlight">{regNo}</p>
        </div>
      </div>

      <div className="mt-5 w-full rounded-2xl border border-sandline bg-white text-left shadow-soft">
        <div className="flex flex-col divide-y divide-sandline">
          <Row label="വിഭാഗം" value={category} />
          {stage && <Row label="സ്റ്റേജ് ഇനം" value={stage} />}
          {off && <Row label="ഓഫ് സ്റ്റേജ്" value={off} />}
        </div>
      </div>

      <p className="mt-5 font-mal text-[13px] text-ink/50">
        ഈ രജിസ്ട്രേഷൻ നമ്പർ സൂക്ഷിച്ചു വെക്കുക. കൂടുതൽ വിവരങ്ങൾക്ക് മദ്‌റസ ഓഫീസുമായി ബന്ധപ്പെടുക.
      </p>

      <Link
        href="/"
        className="focus-ring mt-6 w-full rounded-2xl bg-night py-4 text-center text-[15px] font-bold text-sand shadow-soft"
      >
        മറ്റൊരു കുട്ടിയെ രജിസ്റ്റർ ചെയ്യുക
      </Link>
    </main>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3">
      <span className="text-[13px] font-medium text-ink/45">{label}</span>
      <span className="max-w-[65%] text-right text-[14px] font-semibold text-ink">{value}</span>
    </div>
  );
}
