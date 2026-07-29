"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/data/categories";

function PrintContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (categoryId) params.set("categoryId", categoryId);
        const res = await fetch(`/api/admin/registrations?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError("Error loading data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [q, categoryId]);

  useEffect(() => {
    if (!loading && data) {
      // Small delay to ensure images/fonts are fully rendered before print dialog
      const t = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(t);
    }
  }, [loading, data]);

  if (loading) return <div className="p-10 text-center font-bold">Loading data for printing...</div>;
  if (error) return <div className="p-10 text-center text-rose font-bold">{error}</div>;

  const categoryLabel = categoryId 
    ? CATEGORIES.find(c => c.id === categoryId)?.label 
    : "എല്ലാ വിഭാഗവും (All Categories)";

  return (
    <div className="bg-white p-8 text-black min-h-screen">
      <div className="no-print mb-6 rounded bg-yellow-100 p-4 text-sm text-yellow-800">
        <p><strong>Tip:</strong> In the print dialog, select <b>"Save as PDF"</b> as your destination. Turn on "Background graphics" if colors are missing.</p>
        <button onClick={() => window.print()} className="mt-2 rounded bg-night px-4 py-2 font-bold text-white">Print Again</button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <img src="/images/logo.png" alt="Logo" className="h-16 w-auto" />
        <div>
          <h1 className="font-display text-2xl font-bold">മീലാദ് ഫെസ്റ്റ് രജിസ്ട്രേഷനുകൾ</h1>
          <p className="font-mal text-sm">
            വിഭാഗം: {categoryLabel} | ആകെ: {data?.registrations?.length || 0}
          </p>
          {q && <p className="font-mal text-sm">Search: "{q}"</p>}
        </div>
      </div>

      <table className="print-table">
        <thead>
          <tr>
            <th>Reg No</th>
            <th>പേര്</th>
            <th>ക്ലാസ്</th>
            <th>വിഭാഗം</th>
            <th>ഫോൺ</th>
            <th>സ്റ്റേജ്</th>
            <th>ഓഫ് സ്റ്റേജ്</th>
          </tr>
        </thead>
        <tbody>
          {data?.registrations?.map((r) => (
            <tr key={r._id} className="print-avoid-break">
              <td className="font-semibold">{r.regNo}</td>
              <td>{r.studentName}</td>
              <td>{r.studentClass}</td>
              <td>{r.categoryLabel}</td>
              <td>{r.guardianPhone}</td>
              <td>{(r.stageEventNames || []).join(", ") || "-"}</td>
              <td>{(r.offEventNames || []).join(", ") || "-"}</td>
            </tr>
          ))}
          {data?.registrations?.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center italic py-4">No registrations found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function PrintPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold">Loading...</div>}>
      <PrintContent />
    </Suspense>
  );
}
