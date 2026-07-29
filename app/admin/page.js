"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ArchMotif from "@/components/ArchMotif";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message || "പാസ്‌വേഡ് തെറ്റാണ്");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError("എന്തോ പിഴവ് സംഭവിച്ചു");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="arch-frame arch-top-glow star-dots mb-6 overflow-hidden bg-night px-5 pb-6 pt-8 text-center shadow-soft">
        <ArchMotif className="mx-auto mb-2 h-14 w-24" />
        <h1 className="font-mal text-lg font-bold text-sand">അഡ്മിൻ ലോഗിൻ</h1>
        <p className="mt-1 font-mal text-[13px] text-sand/70">മീലാദ് ഫെസ്റ്റ് രജിസ്ട്രേഷൻ</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-[14px] font-semibold text-ink">പാസ്‌വേഡ്</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="focus-ring w-full rounded-2xl border-2 border-sandline bg-white px-4 py-3.5 text-[16px] outline-none"
          />
        </div>
        {error && <p className="text-[13px] font-medium text-rose">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="focus-ring rounded-2xl bg-night py-4 text-[16px] font-bold text-sand shadow-soft disabled:opacity-50"
        >
          {loading ? "പരിശോധിക്കുന്നു…" : "ലോഗിൻ"}
        </button>
      </form>
    </main>
  );
}
