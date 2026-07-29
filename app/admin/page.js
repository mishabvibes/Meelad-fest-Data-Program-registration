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
      <div className="arch-header relative mb-6 w-full overflow-hidden rounded-[32px] px-6 pb-8 pt-8 text-center shadow-soft">
        <div className="star-field pointer-events-none absolute inset-0" aria-hidden="true">
          <span className="twinkle" style={{ left: "18%", top: "22%", animationDelay: ".2s" }} />
          <span className="twinkle" style={{ left: "78%", top: "18%", animationDelay: "1.1s" }} />
          <span className="twinkle" style={{ left: "30%", top: "60%", animationDelay: "1.8s" }} />
          <span className="twinkle" style={{ left: "70%", top: "58%", animationDelay: ".7s" }} />
          <span className="twinkle" style={{ left: "50%", top: "14%", animationDelay: "2.4s" }} />
        </div>

        <div className="relative mx-auto mb-3 h-[80px] w-[105px]">
          <div className="motif-glow absolute -inset-8" aria-hidden="true" />
          <img src="/images/logo.png" alt="Logo" className="relative h-full w-full object-contain drop-shadow-lg" />
        </div>

        <h1 className="font-display relative text-xl font-bold text-sand [text-shadow:0_2px_10px_rgba(0,0,0,0.25)]">അഡ്മിൻ ലോഗിൻ</h1>
        <p className="font-mal relative mt-1 text-[13px] text-sand/70">മീലാദ് ഫെസ്റ്റ് രജിസ്ട്രേഷൻ</p>
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
