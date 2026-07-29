"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/data/categories";

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (categoryId) params.set("categoryId", categoryId);
      const res = await fetch(`/api/admin/registrations?${params.toString()}`);
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("ഡാറ്റ ലോഡ് ചെയ്യുന്നതിൽ പിഴവ്");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, categoryId]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  const totalsByCategory = useMemo(() => {
    if (!data?.registrations) return {};
    const out = {};
    for (const r of data.registrations) {
      out[r.categoryId] = (out[r.categoryId] || 0) + 1;
    }
    return out;
  }, [data]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mal text-xl font-bold text-night">അഡ്മിൻ ഡാഷ്ബോർഡ്</h1>
          <p className="font-mal text-[13px] text-ink/50">മീലാദ് ഫെസ്റ്റ് രജിസ്ട്രേഷനുകൾ</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/api/admin/export"
            className="focus-ring rounded-xl bg-gold px-4 py-2.5 text-[14px] font-bold text-night shadow-soft"
          >
            ⬇ CSV എക്സ്പോർട്ട്
          </a>
          <button
            onClick={handleLogout}
            className="focus-ring rounded-xl border-2 border-sandline bg-white px-4 py-2.5 text-[14px] font-bold text-ink"
          >
            ലോഗ് ഔട്ട്
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        <StatCard label="ആകെ" value={data?.total ?? "…"} highlight />
        {CATEGORIES.map((cat) => (
          <StatCard
            key={cat.id}
            label={cat.label}
            value={totalsByCategory[cat.id] ?? 0}
          />
        ))}
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="പേര്, ഫോൺ അല്ലെങ്കിൽ Reg No തിരയുക"
          className="focus-ring w-full rounded-xl border-2 border-sandline bg-white px-4 py-2.5 text-[14px] outline-none sm:max-w-xs"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="focus-ring w-full rounded-xl border-2 border-sandline bg-white px-4 py-2.5 text-[14px] outline-none sm:max-w-xs"
        >
          <option value="">എല്ലാ വിഭാഗവും</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label} ({cat.classRangeLabel})
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mb-4 text-[14px] font-medium text-rose">{error}</p>}

      {/* Per-event counts, auto tallied */}
      {data?.eventCounts && (
        <details className="mb-6 rounded-xl border border-sandline bg-white p-4 shadow-soft">
          <summary className="cursor-pointer text-[14px] font-bold text-night">
            ഇനം തിരിച്ചുള്ള കണക്ക് (ഓട്ടോമാറ്റിക്)
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="rounded-lg bg-sand p-3">
                <p className="mb-2 text-[13px] font-bold text-night">{cat.label}</p>
                <ul className="space-y-1 text-[13px] text-ink/70">
                  {cat.stage.map((ev) => (
                    <li key={ev.key} className="flex justify-between">
                      <span>{ev.name}</span>
                      <span className="font-semibold text-ink">
                        {data.eventCounts[cat.id]?.stage?.[ev.key] ?? 0}
                      </span>
                    </li>
                  ))}
                  {cat.off.map((ev) => (
                    <li key={ev.key} className="flex justify-between">
                      <span>{ev.name}</span>
                      <span className="font-semibold text-ink">
                        {data.eventCounts[cat.id]?.off?.[ev.key] ?? 0}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Registrations table */}
      <div className="overflow-x-auto rounded-xl border border-sandline bg-white shadow-soft">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-sandline bg-sand/60 text-ink/60">
              <th className="px-4 py-3 font-semibold">Reg No</th>
              <th className="px-4 py-3 font-semibold">പേര്</th>
              <th className="px-4 py-3 font-semibold">ക്ലാസ്</th>
              <th className="px-4 py-3 font-semibold">വിഭാഗം</th>
              <th className="px-4 py-3 font-semibold">ഫോൺ</th>
              <th className="px-4 py-3 font-semibold">സ്റ്റേജ്</th>
              <th className="px-4 py-3 font-semibold">ഓഫ് സ്റ്റേജ്</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-ink/40">
                  ലോഡ് ചെയ്യുന്നു…
                </td>
              </tr>
            )}
            {!loading && data?.registrations?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-ink/40">
                  രജിസ്ട്രേഷനുകൾ ഒന്നും കണ്ടെത്തിയില്ല
                </td>
              </tr>
            )}
            {!loading &&
              data?.registrations?.map((r) => (
                <tr key={r._id} className="border-b border-sandline last:border-0 hover:bg-sand/40">
                  <td className="px-4 py-3 font-semibold text-night">{r.regNo}</td>
                  <td className="px-4 py-3">{r.studentName}</td>
                  <td className="px-4 py-3">{r.studentClass}</td>
                  <td className="px-4 py-3">{r.categoryLabel}</td>
                  <td className="px-4 py-3">{r.guardianPhone}</td>
                  <td className="px-4 py-3">{r.stageEventName || "-"}</td>
                  <td className="px-4 py-3">{(r.offEventNames || []).join(", ") || "-"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function StatCard({ label, value, highlight }) {
  return (
    <div
      className={[
        "rounded-xl border px-3 py-3 text-center shadow-soft",
        highlight ? "border-gold bg-night text-sand" : "border-sandline bg-white text-ink",
      ].join(" ")}
    >
      <p className={["text-[11px] font-medium", highlight ? "text-sand/70" : "text-ink/50"].join(" ")}>
        {label}
      </p>
      <p className="mt-0.5 text-xl font-bold">{value}</p>
    </div>
  );
}
