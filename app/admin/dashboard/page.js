"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/data/categories";
import RegistrationWizard from "@/components/RegistrationWizard";

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const [settings, setSettings] = useState({ maxOffStageSelections: 2, maxStageSelections: 1, registrationDeadline: null });
  const [savingSettings, setSavingSettings] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState(null);

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

      const resSettings = await fetch("/api/admin/settings");
      if (resSettings.ok) {
        const jsonSettings = await resSettings.json();
        setSettings(jsonSettings);
      }
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

  async function saveSettings(e) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert("Settings saved!");
        setShowSettings(false);
      } else {
        alert("Failed to save settings");
      }
    } catch (err) {
      alert("Error saving settings");
    } finally {
      setSavingSettings(false);
    }
  }

  function handleAdd() {
    setEditingRegistration(null);
    setShowRegistrationModal(true);
  }

  function handleEdit(r) {
    setEditingRegistration(r);
    setShowRegistrationModal(true);
  }

  async function handleDelete(id) {
    if (!confirm("തീർച്ചയായും ഇത് ഡിലീറ്റ് ചെയ്യണമെന്നുണ്ടോ? (Are you sure you want to delete this?)")) return;
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" });
      if (res.ok) {
        load();
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      alert("Error deleting");
    }
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
          <button
            onClick={handleAdd}
            className="focus-ring rounded-xl bg-night px-4 py-2.5 text-[14px] font-bold text-sand shadow-soft"
          >
            + പുതിയ രജിസ്ട്രേഷൻ
          </button>
          <a
            href="/api/admin/export"
            className="focus-ring rounded-xl bg-gold px-4 py-2.5 text-[14px] font-bold text-night shadow-soft"
          >
            ⬇ CSV എക്സ്പോർട്ട്
          </a>
          <button
            onClick={() => setShowSettings(true)}
            className="focus-ring rounded-xl border-2 border-sandline bg-white px-4 py-2.5 text-[14px] font-bold text-ink"
          >
            ⚙️ സെറ്റിങ്സ്
          </button>
          <button
            onClick={handleLogout}
            className="focus-ring rounded-xl border-2 border-sandline bg-white px-4 py-2.5 text-[14px] font-bold text-ink"
          >
            ലോഗ് ഔട്ട്
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/80 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft">
            <h2 className="mb-4 font-mal text-lg font-bold text-night">സെറ്റിങ്സ് (Settings)</h2>
            <form onSubmit={saveSettings} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-[13px] font-semibold text-ink">
                  ഓഫ് സ്റ്റേജ് പരമാവധി ഇനങ്ങൾ (Max Off-Stage Selections)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={settings.maxOffStageSelections}
                  onChange={(e) => setSettings({ ...settings, maxOffStageSelections: e.target.value })}
                  className="focus-ring w-full rounded-xl border-2 border-sandline bg-sand px-3 py-2 text-[14px] outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-semibold text-ink">
                  സ്റ്റേജ് പരമാവധി ഇനങ്ങൾ (Max Stage Selections)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={settings.maxStageSelections}
                  onChange={(e) => setSettings({ ...settings, maxStageSelections: e.target.value })}
                  className="focus-ring w-full rounded-xl border-2 border-sandline bg-sand px-3 py-2 text-[14px] outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-semibold text-ink">
                  രജിസ്ട്രേഷൻ അവസാനിക്കുന്ന സമയം (Deadline)
                </label>
                <input
                  type="datetime-local"
                  value={settings.registrationDeadline ? new Date(new Date(settings.registrationDeadline).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ""}
                  onChange={(e) => setSettings({ ...settings, registrationDeadline: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="focus-ring w-full rounded-xl border-2 border-sandline bg-sand px-3 py-2 text-[14px] outline-none"
                />
                <p className="mt-1 text-[11px] text-ink/40">അവസാന സമയം വേണ്ടെങ്കിൽ ശൂന്യമായി ഇടുക (Leave empty for no deadline)</p>
              </div>
              <div className="mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="rounded-xl px-4 py-2 text-[14px] font-bold text-ink/70"
                >
                  റദ്ദാക്കുക
                </button>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="rounded-xl bg-night px-5 py-2 text-[14px] font-bold text-sand"
                >
                  {savingSettings ? "സേവ് ചെയ്യുന്നു..." : "സേവ് ചെയ്യുക"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRegistrationModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-night/80 p-4 pt-10">
          <div className="relative w-full max-w-md rounded-[32px] bg-sand">
            <div className="absolute right-4 top-4 z-10">
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 font-bold text-ink hover:bg-ink/20"
              >
                ✕
              </button>
            </div>
            <div className="px-6 pb-2 pt-6">
              <h2 className="font-mal text-lg font-bold text-night">
                {editingRegistration ? "രജിസ്ട്രേഷൻ എഡിറ്റ് ചെയ്യുക" : "പുതിയ രജിസ്ട്രേഷൻ"}
              </h2>
            </div>
            <RegistrationWizard
              adminMode={true}
              initialData={editingRegistration}
              maxOffStageSelections={settings.maxOffStageSelections}
              maxStageSelections={settings.maxStageSelections}
              onSuccess={() => {
                setShowRegistrationModal(false);
                load();
              }}
              onCancel={() => setShowRegistrationModal(false)}
            />
          </div>
        </div>
      )}

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
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-ink/40">
                  ലോഡ് ചെയ്യുന്നു…
                </td>
              </tr>
            )}
            {!loading && data?.registrations?.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-ink/40">
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
                  <td className="px-4 py-3">{(r.stageEventNames || []).join(", ") || "-"}</td>
                  <td className="px-4 py-3">{(r.offEventNames || []).join(", ") || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(r)}
                        className="rounded-lg bg-gold/20 px-2 py-1 text-[16px]"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="rounded-lg bg-rose/10 px-2 py-1 text-[16px]"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
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
