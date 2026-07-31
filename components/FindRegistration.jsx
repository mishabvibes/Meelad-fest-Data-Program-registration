"use client";

import { useState } from "react";
import RegistrationWizard from "./RegistrationWizard";

// ── Search modes ──
const MODE_REGNO = "regNo";
const MODE_NAME_PHONE = "namePhone";

// ── View states ──
const VIEW_SEARCH = "search";
const VIEW_DETAILS = "details";
const VIEW_EDIT = "edit";

export default function FindRegistration({
  maxOffStageSelections = 2,
  maxStageSelections = 1,
}) {
  const [view, setView] = useState(VIEW_SEARCH);
  const [mode, setMode] = useState(MODE_REGNO);
  const [regNoInput, setRegNoInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [errors, setErrors] = useState({});
  const [registration, setRegistration] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);

  // ── Search handler ──
  async function handleSearch(e) {
    e.preventDefault();
    setErrors({});
    setEditSuccess(false);

    // Client-side validation
    if (mode === MODE_REGNO) {
      if (!regNoInput.trim()) {
        setErrors({ general: "രജിസ്ട്രേഷൻ നമ്പർ നൽകുക" });
        return;
      }
    } else {
      const errs = {};
      if (!nameInput.trim() || nameInput.trim().length < 2) {
        errs.studentName = "കുട്ടിയുടെ പേര് ശരിയായി നൽകുക";
      }
      if (!/^[6-9]\d{9}$/.test(phoneInput.trim())) {
        errs.guardianPhone = "10 അക്ക മൊബൈൽ നമ്പർ നൽകുക";
      }
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
    }

    setSearching(true);
    try {
      const body =
        mode === MODE_REGNO
          ? { regNo: regNoInput.trim() }
          : {
              studentName: nameInput.trim(),
              guardianPhone: phoneInput.trim(),
            };

      const res = await fetch("/api/find-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrors(data.errors || { general: "എന്തോ പിഴവ് സംഭവിച്ചു" });
        return;
      }

      setRegistration(data.registration);
      setView(VIEW_DETAILS);
    } catch {
      setErrors({
        general: "ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിക്കുക, വീണ്ടും ശ്രമിക്കുക",
      });
    } finally {
      setSearching(false);
    }
  }

  // ── Edit success handler ──
  function handleEditSuccess(data) {
    // Refresh the registration with updated data
    setRegistration((prev) => ({
      ...prev,
      regNo: data.regNo,
      categoryLabel: data.categoryLabel,
      stageEventNames: data.stageEventNames,
      offEventNames: data.offEventNames,
    }));
    setEditSuccess(true);
    setView(VIEW_DETAILS);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Reset to search ──
  function resetSearch() {
    setView(VIEW_SEARCH);
    setRegistration(null);
    setErrors({});
    setEditSuccess(false);
    setRegNoInput("");
    setNameInput("");
    setPhoneInput("");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col pb-10">
      {/* ── Header ── */}
      <header className="arch-header relative overflow-hidden rounded-b-[32px] px-6 pb-8 pt-12 text-center shadow-soft">
        <div
          className="star-field pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <span
            className="twinkle"
            style={{ left: "18%", top: "22%", animationDelay: ".2s" }}
          />
          <span
            className="twinkle"
            style={{ left: "78%", top: "18%", animationDelay: "1.1s" }}
          />
          <span
            className="twinkle"
            style={{ left: "30%", top: "60%", animationDelay: "1.8s" }}
          />
          <span
            className="twinkle"
            style={{ left: "70%", top: "58%", animationDelay: ".7s" }}
          />
          <span
            className="twinkle"
            style={{ left: "50%", top: "14%", animationDelay: "2.4s" }}
          />
        </div>

        <div className="relative mx-auto mb-3 h-[100px] w-[132px]">
          <div className="motif-glow absolute -inset-8" aria-hidden="true" />
          <img
            src="/images/logo.png"
            alt="Logo"
            className="relative h-full w-full object-contain drop-shadow-lg"
          />
        </div>

        <p className="font-mal relative text-[12.5px] font-bold tracking-wide text-goldlight/90">
          ഹയാത്തുൽ ഇസ്‌ലാം ഹയർ സെക്കണ്ടറി മദ്‌റസ
        </p>
        <h1 className="font-display relative mt-1 text-[26px] font-bold leading-tight text-sand [text-shadow:0_2px_18px_rgba(0,0,0,0.25)]">
          എന്റെ രജിസ്ട്രേഷൻ
        </h1>
        <p className="font-mal relative mt-1 text-[13.5px] font-semibold text-sand/70">
          കണ്ടെത്തുക & എഡിറ്റ് ചെയ്യുക
        </p>

        <div className="relative mx-auto mt-3.5 h-[2px] w-[46px] rounded-full bg-gradient-to-r from-transparent via-gold to-transparent" />
      </header>

      <main className="flex flex-col px-4 pt-6">
        {/* ── VIEW: SEARCH ── */}
        {view === VIEW_SEARCH && (
          <section className="rise-in flex flex-col gap-5">
            {/* Mode toggle tabs */}
            <div className="flex overflow-hidden rounded-2xl border-2 border-sandline bg-white">
              <button
                type="button"
                onClick={() => {
                  setMode(MODE_REGNO);
                  setErrors({});
                }}
                className={[
                  "flex-1 py-3 text-[13px] font-bold transition-colors",
                  mode === MODE_REGNO
                    ? "bg-night text-sand"
                    : "text-ink/60 hover:bg-sand",
                ].join(" ")}
              >
                രജിസ്ട്രേഷൻ നമ്പർ
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode(MODE_NAME_PHONE);
                  setErrors({});
                }}
                className={[
                  "flex-1 border-l-2 border-sandline py-3 text-[13px] font-bold transition-colors",
                  mode === MODE_NAME_PHONE
                    ? "bg-night text-sand"
                    : "text-ink/60 hover:bg-sand",
                ].join(" ")}
              >
                പേര് + മൊബൈൽ
              </button>
            </div>

            {/* Error banner */}
            {errors.general && (
              <div className="rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-[14px] font-medium text-rose">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              {mode === MODE_REGNO ? (
                <div>
                  <label className="mb-1.5 block text-[14px] font-semibold text-ink">
                    രജിസ്ട്രേഷൻ നമ്പർ
                  </label>
                  <input
                    type="text"
                    value={regNoInput}
                    onChange={(e) => setRegNoInput(e.target.value.toUpperCase())}
                    placeholder="ഉദാ: MF-2026-0001"
                    className="focus-ring w-full rounded-2xl border-2 border-sandline bg-white px-4 py-3.5 font-body text-[16px] uppercase tracking-wider outline-none placeholder:text-ink/30 placeholder:normal-case placeholder:tracking-normal"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="mb-1.5 block text-[14px] font-semibold text-ink">
                      കുട്ടിയുടെ പേര്
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="ഉദാ: മുഹമ്മദ് ഫായിസ്"
                      className="focus-ring w-full rounded-2xl border-2 border-sandline bg-white px-4 py-3.5 text-[16px] outline-none placeholder:text-ink/30"
                    />
                    {errors.studentName && (
                      <p className="mt-1 text-[13px] font-medium text-rose">
                        {errors.studentName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[14px] font-semibold text-ink">
                      രക്ഷിതാവിന്റെ മൊബൈൽ നമ്പർ
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={phoneInput}
                      onChange={(e) =>
                        setPhoneInput(
                          e.target.value.replace(/\D/g, "").slice(0, 10)
                        )
                      }
                      placeholder="9876543210"
                      className="focus-ring w-full rounded-2xl border-2 border-sandline bg-white px-4 py-3.5 font-body text-[16px] outline-none placeholder:text-ink/30"
                    />
                    {errors.guardianPhone && (
                      <p className="mt-1 text-[13px] font-medium text-rose">
                        {errors.guardianPhone}
                      </p>
                    )}
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={searching}
                className="focus-ring mt-1 w-full rounded-2xl bg-night py-4 text-[16px] font-bold text-sand shadow-soft active:scale-[0.99] disabled:opacity-60"
              >
                {searching ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-25"
                      />
                      <path
                        d="M4 12a8 8 0 018-8"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="opacity-75"
                      />
                    </svg>
                    തിരയുന്നു…
                  </span>
                ) : (
                  "🔍  തിരയുക"
                )}
              </button>
            </form>

            {/* Back to home link */}
            <a
              href="/"
              className="mt-2 block text-center text-[13px] font-semibold text-ink/40 transition-colors hover:text-ink/60"
            >
              ← ഹോം പേജിലേക്ക് മടങ്ങുക
            </a>
          </section>
        )}

        {/* ── VIEW: DETAILS ── */}
        {view === VIEW_DETAILS && registration && (
          <section className="rise-in flex flex-col gap-5">
            {/* Edit success banner */}
            {editSuccess && (
              <div className="flex items-center gap-3 rounded-2xl border border-night/20 bg-night/10 px-4 py-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold">
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                    <path
                      d="M4 10.5L8 14.5L16 5.5"
                      stroke="#0B3B2E"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p className="font-mal text-[14px] font-semibold text-night">
                  രജിസ്ട്രേഷൻ വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തു!
                </p>
              </div>
            )}

            {/* Reg number card */}
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-night to-night-deep px-5 py-5 text-center shadow-soft">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-goldlight/70">
                രജിസ്ട്രേഷൻ നമ്പർ
              </p>
              <p className="font-display mt-1 text-2xl font-bold tracking-wider text-goldlight">
                {registration.regNo}
              </p>
            </div>

            {/* Student details card */}
            <div className="overflow-hidden rounded-2xl border border-sandline bg-white shadow-soft">
              <div className="bg-night px-5 py-3">
                <p className="font-mal text-[13px] font-semibold text-sand/80">
                  രജിസ്ട്രേഷൻ വിവരങ്ങൾ
                </p>
              </div>
              <div className="flex flex-col divide-y divide-sandline">
                <DetailRow label="പേര്" value={registration.studentName} />
                <DetailRow
                  label="ക്ലാസ്"
                  value={`${registration.studentClass} (${registration.categoryLabel})`}
                />
                <DetailRow
                  label="ലിംഗം"
                  value={registration.gender === "female" ? "പെൺ" : "ആൺ"}
                />
                <DetailRow label="മൊബൈൽ" value={registration.guardianPhone} />
                <DetailRow
                  label="സ്റ്റേജ് ഇനം"
                  value={
                    registration.stageEventNames?.length > 0
                      ? registration.stageEventNames.join(", ")
                      : "തിരഞ്ഞെടുത്തിട്ടില്ല"
                  }
                />
                <DetailRow
                  label="ഓഫ് സ്റ്റേജ്"
                  value={
                    registration.offEventNames?.length > 0
                      ? registration.offEventNames.join(", ")
                      : "തിരഞ്ഞെടുത്തിട്ടില്ല"
                  }
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetSearch}
                className="focus-ring flex-1 rounded-2xl border-2 border-sandline bg-white py-4 text-[14px] font-bold text-ink active:scale-[0.99]"
              >
                🔍 മറ്റൊന്ന് തിരയുക
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditSuccess(false);
                  setView(VIEW_EDIT);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="focus-ring flex-[1.5] rounded-2xl bg-gold py-4 text-[15px] font-bold text-night shadow-soft active:scale-[0.99]"
              >
                ✏️ എഡിറ്റ് ചെയ്യുക
              </button>
            </div>
          </section>
        )}

        {/* ── VIEW: EDIT ── */}
        {view === VIEW_EDIT && registration && (
          <section className="rise-in">
            <div className="mb-4 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-center">
              <p className="font-mal text-[13px] font-semibold text-night/70">
                എഡിറ്റ് ചെയ്യുന്നു:{" "}
                <span className="text-night">{registration.regNo}</span>
              </p>
            </div>

            <RegistrationWizard
              maxOffStageSelections={maxOffStageSelections}
              maxStageSelections={maxStageSelections}
              editMode={true}
              initialData={{
                _id: registration._id,
                studentName: registration.studentName,
                guardianPhone: registration.guardianPhone,
                gender: registration.gender,
                studentClass: registration.studentClass,
                stageEvents: registration.stageEvents || [],
                offEvents: registration.offEvents || [],
                _verifyPhone: registration.guardianPhone, // store original phone for verification
              }}
              onSuccess={handleEditSuccess}
              onCancel={() => {
                setView(VIEW_DETAILS);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </section>
        )}
      </main>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3">
      <span className="text-[13px] font-medium text-ink/45">{label}</span>
      <span className="max-w-[65%] text-right text-[14px] font-semibold text-ink">
        {value}
      </span>
    </div>
  );
}
