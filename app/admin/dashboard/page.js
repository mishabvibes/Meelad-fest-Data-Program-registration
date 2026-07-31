"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, ALL_CLASSES } from "@/data/categories";
import RegistrationWizard from "@/components/RegistrationWizard";

function getBadgeClass(categoryId) {
  const map = {
    kids: "bg-blue-100 text-blue-800 border border-blue-200",
    sub_junior: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    junior: "bg-amber-100 text-amber-800 border border-amber-200",
    senior: "bg-purple-100 text-purple-800 border border-purple-200",
    super_senior: "bg-rose-100 text-rose-800 border border-rose-200",
  };
  return map[categoryId] || "bg-gray-100 text-gray-800 border border-gray-200";
}

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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState(null);

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printType, setPrintType] = useState("all");
  const [printCategoryId, setPrintCategoryId] = useState("");
  const [printClass, setPrintClass] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (categoryId) params.set("categoryId", categoryId);
      params.set("page", currentPage);
      params.set("limit", itemsPerPage);
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
      setError("ഡാറ്റ ലോഡ് ചെയ്യുന്നതിൽ പിഴവ് (Error loading data)");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [q, categoryId]);

  useEffect(() => {
    const t = setTimeout(load, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, q, categoryId]);

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

  const totalPages = data?.total ? Math.ceil(data.total / itemsPerPage) : 0;

  return (
    <div className="min-h-screen bg-[#F6EFDD] font-body text-ink">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-sandline bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6 md:py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" alt="Logo" className="h-10 w-auto object-contain drop-shadow-md md:h-12" />
          <div className="hidden sm:block">
            <h1 className="font-display text-lg font-bold leading-tight text-night">മീലാദ് ഫെസ്റ്റ്</h1>
            <p className="font-mal text-[11px] font-semibold text-ink/60 uppercase tracking-wider">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-sandline bg-sand px-3 py-1.5 text-[13px] font-semibold text-night transition-colors hover:bg-night hover:text-white shadow-sm">
             <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-night font-bold">A</span>
             <span className="hidden sm:block">Log Out</span>
           </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        
        {/* Actions: Horizontally scrollable on mobile */}
        <div className="no-scrollbar -mx-4 mb-6 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          <button onClick={handleAdd} className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl bg-night px-5 text-[14px] font-bold text-sand shadow-soft hover:opacity-90 transition-opacity">
            + പുതിയ രജിസ്ട്രേഷൻ
          </button>
          <a href="/api/admin/export" className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl bg-gold px-5 text-[14px] font-bold text-night shadow-soft hover:opacity-90 transition-opacity">
            ⬇ CSV എക്സ്പോർട്ട്
          </a>
          <button onClick={() => setShowPrintModal(true)} className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border-2 border-sandline bg-white px-5 text-[14px] font-bold text-night shadow-sm hover:bg-sand transition-colors">
            🖨️ പ്രിന്റ് / PDF
          </button>
          <button onClick={() => setShowSettings(true)} className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border-2 border-sandline bg-white px-5 text-[14px] font-bold text-ink shadow-sm hover:bg-sand transition-colors">
            ⚙️ സെറ്റിങ്സ്
          </button>
        </div>

        {/* Stat Cards Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
          <div className="col-span-2 rounded-[16px] bg-night p-5 shadow-soft md:col-span-1 transition-transform hover:-translate-y-0.5">
            <p className="text-[12px] font-semibold text-sand/70 uppercase tracking-widest">ആകെ (Total)</p>
            <p className="mt-1 font-display text-4xl font-bold text-sand">{data?.total ?? "…"}</p>
          </div>
          {CATEGORIES.map(cat => (
             <div key={cat.id} className="rounded-[16px] border border-sandline bg-white p-5 shadow-sm transition-all hover:shadow-soft hover:-translate-y-0.5 md:col-span-1">
               <p className="text-[11px] font-bold text-ink/50 uppercase tracking-widest">{cat.label}</p>
               <p className="mt-1 font-display text-3xl font-bold text-night">{totalsByCategory[cat.id] ?? 0}</p>
             </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-sandline bg-white p-5 shadow-sm md:flex-row md:items-center">
           <div className="flex-1">
             <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-widest text-ink/50">തിരയുക (Search)</label>
             <input value={q} onChange={e=>setQ(e.target.value)} placeholder="പേര്, ഫോൺ അല്ലെങ്കിൽ Reg No..." className="focus-ring w-full rounded-xl border-2 border-sandline bg-sand px-4 py-3 text-[14px] outline-none transition-colors focus:border-gold focus:bg-white" />
           </div>
           <div className="flex-1 md:max-w-[280px]">
             <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-widest text-ink/50">വിഭാഗം (Category)</label>
             <select value={categoryId} onChange={e=>setCategoryId(e.target.value)} className="focus-ring w-full rounded-xl border-2 border-sandline bg-sand px-4 py-3 text-[14px] outline-none transition-colors focus:border-gold focus:bg-white">
               <option value="">എല്ലാ വിഭാഗവും</option>
               {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label} ({cat.classRangeLabel})</option>)}
             </select>
           </div>
        </div>

        {error && <p className="mb-4 rounded-xl bg-rose/10 p-3 text-[14px] font-medium text-rose border border-rose/20">{error}</p>}

        {/* Auto-Tally Details */}
        {data?.eventCounts && (
          <details className="group mb-6 rounded-2xl border border-sandline bg-white shadow-sm overflow-hidden">
            <summary className="cursor-pointer bg-sand/30 p-5 text-[14px] font-bold text-night hover:bg-sand/60 transition-colors select-none">
              ഇനം തിരിച്ചുള്ള കണക്ക് (Auto Tally Details) 
              <span className="ml-2 text-ink/40 text-[12px] font-normal group-open:hidden">(Click to expand)</span>
            </summary>
            <div className="border-t border-sandline p-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="rounded-xl border border-sandline bg-sand/20 p-4 shadow-sm">
                  <p className="mb-3 border-b border-sandline/50 pb-2 text-[13px] font-bold text-night">{cat.label}</p>
                  <ul className="space-y-1.5 text-[12px] text-ink/70">
                    {cat.stage.map((ev) => (
                      <li key={ev.key} className="flex justify-between items-center">
                        <span className="truncate pr-2">{ev.name}</span>
                        <span className="rounded bg-white px-1.5 py-0.5 font-semibold text-night shadow-sm border border-sandline">
                          {data.eventCounts[cat.id]?.stage?.[ev.key] ?? 0}
                        </span>
                      </li>
                    ))}
                    {cat.off.map((ev) => (
                      <li key={ev.key} className="flex justify-between items-center">
                        <span className="truncate pr-2">{ev.name}</span>
                        <span className="rounded bg-white px-1.5 py-0.5 font-semibold text-night shadow-sm border border-sandline">
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

        {/* Data View */}
        {loading && <div className="py-12 text-center font-bold text-ink/40 animate-pulse">ലോഡ് ചെയ്യുന്നു…</div>}
        {!loading && data?.registrations?.length === 0 && <div className="py-12 text-center font-bold text-ink/40">രജിസ്ട്രേഷനുകൾ ഒന്നും കണ്ടെത്തിയില്ല</div>}
        
        {/* MOBILE LIST VIEW (Cards) */}
        {!loading && data?.registrations?.length > 0 && (
          <div className="block md:hidden space-y-4">
            {data.registrations.map(r => (
               <div key={r._id} className="flex flex-col gap-3 rounded-2xl border border-sandline bg-white p-4 shadow-sm">
                 <div className="flex items-start justify-between border-b border-sandline/50 pb-3">
                   <div>
                     <div className="flex flex-wrap items-center gap-2 mb-1">
                       <h3 className="font-bold text-[16px] text-night">{r.studentName}</h3>
                       <span className={getBadgeClass(r.categoryId) + " px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"}>{r.categoryLabel}</span>
                     </div>
                     <p className="font-display text-[12px] font-bold text-ink/50">Reg: <span className="text-gold">{r.regNo}</span> <span className="mx-1">•</span> ക്ലാസ്: {r.studentClass}</p>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-[12px]">
                   <div><span className="font-semibold text-ink/40 block mb-0.5 uppercase tracking-widest text-[10px]">ഫോൺ</span>{r.guardianPhone}</div>
                   <div><span className="font-semibold text-ink/40 block mb-0.5 uppercase tracking-widest text-[10px]">സ്റ്റേജ്</span>{(r.stageEventNames || []).join(", ") || "-"}</div>
                   <div className="col-span-2"><span className="font-semibold text-ink/40 block mb-0.5 uppercase tracking-widest text-[10px]">ഓഫ് സ്റ്റേജ്</span>{(r.offEventNames || []).join(", ") || "-"}</div>
                 </div>
                 <div className="mt-1 flex gap-2 border-t border-sandline/50 pt-3">
                   <button onClick={() => handleEdit(r)} className="flex-1 rounded-xl bg-sand py-2 text-[13px] font-bold text-night hover:bg-gold/20 transition-colors">✏️ എഡിറ്റ്</button>
                   <button onClick={() => handleDelete(r._id)} className="flex-1 rounded-xl bg-rose/10 py-2 text-[13px] font-bold text-rose hover:bg-rose/20 transition-colors">🗑️ ഡിലീറ്റ്</button>
                 </div>
               </div>
            ))}
          </div>
        )}

        {/* DESKTOP TABLE VIEW */}
        {!loading && data?.registrations?.length > 0 && (
          <div className="hidden md:block overflow-hidden rounded-2xl border border-sandline bg-white shadow-soft">
             <table className="w-full text-left text-[14px]">
               <thead className="border-b border-sandline bg-sand/60">
                 <tr>
                   <th className="px-5 py-4 font-bold text-ink/60 text-[12px] uppercase tracking-wider">Reg No & Name</th>
                   <th className="px-5 py-4 font-bold text-ink/60 text-[12px] uppercase tracking-wider">Category & Class</th>
                   <th className="px-5 py-4 font-bold text-ink/60 text-[12px] uppercase tracking-wider">Phone</th>
                   <th className="px-5 py-4 font-bold text-ink/60 text-[12px] uppercase tracking-wider">Events</th>
                   <th className="px-5 py-4 text-right font-bold text-ink/60 text-[12px] uppercase tracking-wider">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-sandline">
                  {data.registrations.map((r, i) => (
                    <tr key={r._id} className={i % 2 === 0 ? "bg-white hover:bg-sand/40 transition-colors" : "bg-sand/20 hover:bg-sand/40 transition-colors"}>
                      <td className="px-5 py-4">
                        <div className="font-display font-bold text-[12px] text-goldlight mb-0.5 uppercase tracking-widest">{r.regNo}</div>
                        <div className="font-bold text-[15px] text-night">{r.studentName}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={getBadgeClass(r.categoryId) + " px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide inline-block mb-1.5"}>
                          {r.categoryLabel}
                        </span>
                        <div className="text-[13px] font-medium text-ink/70">ക്ലാസ്: {r.studentClass}</div>
                      </td>
                      <td className="px-5 py-4 font-medium text-ink/80">{r.guardianPhone}</td>
                      <td className="px-5 py-4 text-[13px]">
                        <div className="mb-1.5"><span className="font-semibold text-ink/40 text-[11px] uppercase tracking-widest mr-1">സ്റ്റേജ്:</span> {(r.stageEventNames || []).join(", ") || "-"}</div>
                        <div><span className="font-semibold text-ink/40 text-[11px] uppercase tracking-widest mr-1">ഓഫ് സ്റ്റേജ്:</span> {(r.offEventNames || []).join(", ") || "-"}</div>
                      </td>
                      <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEdit(r)} className="rounded-xl p-2.5 text-ink/40 hover:bg-gold/20 hover:text-night transition-colors" title="Edit">✏️</button>
                            <button onClick={() => handleDelete(r._id)} className="rounded-xl p-2.5 text-ink/40 hover:bg-rose/10 hover:text-rose transition-colors" title="Delete">🗑️</button>
                          </div>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && data?.registrations?.length > 0 && (
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-sandline bg-white p-4 shadow-sm sm:flex-row sm:px-6 sm:py-4">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-ink/50 uppercase tracking-widest">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="focus-ring rounded-xl border border-sandline bg-sand px-3 py-1.5 text-[13px] font-semibold outline-none transition-colors focus:border-gold"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[13px] font-bold text-ink/50 tracking-widest uppercase">
                Page <span className="text-night">{currentPage}</span> of <span className="text-night">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="focus-ring rounded-xl border border-sandline bg-white px-4 py-2 text-[13px] font-bold text-night shadow-sm hover:bg-sand disabled:opacity-40 transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="focus-ring rounded-xl border border-sandline bg-white px-4 py-2 text-[13px] font-bold text-night shadow-sm hover:bg-sand disabled:opacity-40 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-xl">
            <h2 className="mb-5 font-mal text-xl font-bold text-night">പ്രിന്റ് ഓപ്ഷനുകൾ</h2>
            <div className="flex flex-col gap-5">
              <div>
                <label className="mb-2 block text-[12px] font-bold uppercase tracking-widest text-ink/60">
                  എന്ത് പ്രിന്റ് ചെയ്യണം?
                </label>
                <select
                  value={printType}
                  onChange={(e) => setPrintType(e.target.value)}
                  className="focus-ring w-full rounded-xl border-2 border-sandline bg-sand px-4 py-3 text-[14px] outline-none transition-colors focus:border-gold"
                >
                  <option value="all">എല്ലാ ഡാറ്റയും (All Data)</option>
                  <option value="category">വിഭാഗം തിരിച്ച് (By Category)</option>
                  <option value="class">ക്ലാസ് തിരിച്ച് (By Class)</option>
                </select>
              </div>

              {printType === "category" && (
                <div className="rise-in">
                  <label className="mb-2 block text-[12px] font-bold uppercase tracking-widest text-ink/60">
                    വിഭാഗം തിരഞ്ഞെടുക്കുക
                  </label>
                  <select
                    value={printCategoryId}
                    onChange={(e) => setPrintCategoryId(e.target.value)}
                    className="focus-ring w-full rounded-xl border-2 border-sandline bg-sand px-4 py-3 text-[14px] outline-none transition-colors focus:border-gold"
                  >
                    <option value="">-- തിരഞ്ഞെടുക്കുക --</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label} ({cat.classRangeLabel})</option>
                    ))}
                  </select>
                </div>
              )}

              {printType === "class" && (
                <div className="rise-in">
                  <label className="mb-2 block text-[12px] font-bold uppercase tracking-widest text-ink/60">
                    ക്ലാസ് തിരഞ്ഞെടുക്കുക
                  </label>
                  <select
                    value={printClass}
                    onChange={(e) => setPrintClass(e.target.value)}
                    className="focus-ring w-full rounded-xl border-2 border-sandline bg-sand px-4 py-3 text-[14px] outline-none transition-colors focus:border-gold"
                  >
                    <option value="">-- തിരഞ്ഞെടുക്കുക --</option>
                    {ALL_CLASSES.map((c) => (
                      <option key={c.value} value={c.value}>{c.value}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="rounded-xl px-5 py-2.5 text-[14px] font-bold text-ink/70 hover:bg-sand transition-colors"
              >
                റദ്ദാക്കുക
              </button>
              <button
                type="button"
                disabled={(printType === "category" && !printCategoryId) || (printType === "class" && !printClass)}
                onClick={() => {
                  const params = new URLSearchParams();
                  if (printType === "category") params.set("categoryId", printCategoryId);
                  if (printType === "class") params.set("studentClass", printClass);
                  window.open(`/admin/print?${params.toString()}`, "_blank");
                  setShowPrintModal(false);
                }}
                className="rounded-xl bg-night px-6 py-2.5 text-[14px] font-bold text-sand shadow-soft disabled:opacity-50 hover:bg-night/90 transition-all"
              >
                ജനറേറ്റ് PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-xl">
            <h2 className="mb-5 font-mal text-xl font-bold text-night">സെറ്റിങ്സ് (Settings)</h2>
            <form onSubmit={saveSettings} className="flex flex-col gap-5">
              <div>
                <label className="mb-2 block text-[12px] font-bold uppercase tracking-widest text-ink/60">
                  ഓഫ് സ്റ്റേജ് പരമാവധി ഇനങ്ങൾ
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={settings.maxOffStageSelections}
                  onChange={(e) => setSettings({ ...settings, maxOffStageSelections: e.target.value })}
                  className="focus-ring w-full rounded-xl border-2 border-sandline bg-sand px-4 py-3 text-[14px] outline-none transition-colors focus:border-gold"
                />
              </div>
              <div>
                <label className="mb-2 block text-[12px] font-bold uppercase tracking-widest text-ink/60">
                  സ്റ്റേജ് പരമാവധി ഇനങ്ങൾ
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={settings.maxStageSelections}
                  onChange={(e) => setSettings({ ...settings, maxStageSelections: e.target.value })}
                  className="focus-ring w-full rounded-xl border-2 border-sandline bg-sand px-4 py-3 text-[14px] outline-none transition-colors focus:border-gold"
                />
              </div>
              <div>
                <label className="mb-2 block text-[12px] font-bold uppercase tracking-widest text-ink/60">
                  രജിസ്ട്രേഷൻ അവസാനിക്കുന്ന സമയം
                </label>
                <input
                  type="datetime-local"
                  value={settings.registrationDeadline ? new Date(new Date(settings.registrationDeadline).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ""}
                  onChange={(e) => setSettings({ ...settings, registrationDeadline: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="focus-ring w-full rounded-xl border-2 border-sandline bg-sand px-4 py-3 text-[14px] outline-none transition-colors focus:border-gold"
                />
                <p className="mt-1.5 text-[11px] font-medium text-ink/40 uppercase tracking-widest">അവസാന സമയം വേണ്ടെങ്കിൽ ശൂന്യമായി ഇടുക</p>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="rounded-xl px-5 py-2.5 text-[14px] font-bold text-ink/70 hover:bg-sand transition-colors"
                >
                  റദ്ദാക്കുക
                </button>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="rounded-xl bg-night px-6 py-2.5 text-[14px] font-bold text-sand shadow-soft hover:bg-night/90 transition-all"
                >
                  {savingSettings ? "സേവ് ചെയ്യുന്നു..." : "സേവ് ചെയ്യുക"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRegistrationModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-night/80 p-4 pt-10 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[32px] bg-sand shadow-xl">
            <div className="absolute right-4 top-4 z-10">
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/10 font-bold text-ink hover:bg-ink/20 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="px-6 pb-2 pt-6">
              <h2 className="font-mal text-xl font-bold text-night">
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
    </div>
  );
}
