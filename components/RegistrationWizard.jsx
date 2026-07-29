"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ALL_CLASSES,
  CATEGORIES,
  getCategoryByClass,
  getAvailableEvents,
  MAX_OFF_STAGE_SELECTIONS,
} from "@/data/categories";
import ChoiceButton from "./ChoiceButton";
import StepDots from "./StepDots";
import ArchMotif from "./ArchMotif";

const initialForm = {
  studentName: "",
  guardianPhone: "",
  gender: "",
  studentClass: "",
  stageEvent: "",
  offEvents: [],
};

export default function RegistrationWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const category = useMemo(
    () => (form.studentClass ? getCategoryByClass(form.studentClass) : null),
    [form.studentClass]
  );

  const available = useMemo(() => {
    if (!category || !form.gender) return { stage: [], off: [] };
    return getAvailableEvents(category.id, form.gender);
  }, [category, form.gender]);

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }));
  }

  function validateStep1() {
    const e = {};
    if (!form.studentName.trim() || form.studentName.trim().length < 2) {
      e.studentName = "കുട്ടിയുടെ പേര് ശരിയായി നൽകുക";
    }
    if (!/^[6-9]\d{9}$/.test(form.guardianPhone.trim())) {
      e.guardianPhone = "10 അക്ക മൊബൈൽ നമ്പർ ശരിയായി നൽകുക";
    }
    if (!form.gender) e.gender = "ലിംഗം തിരഞ്ഞെടുക്കുക";
    if (!form.studentClass) e.studentClass = "ക്ലാസ് തിരഞ്ഞെടുക്കുക";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e = {};
    if (!form.stageEvent && form.offEvents.length === 0) {
      e.general = "ചുരുങ്ങിയത് ഒരു ഇനമെങ്കിലും തിരഞ്ഞെടുക്കുക";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function goNext() {
    if (step === 1 && validateStep1()) {
      // Reset event choices if the category/gender combination changed the available list
      setForm((f) => ({ ...f, stageEvent: "", offEvents: [] }));
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleOffEvent(key) {
    setForm((f) => {
      const has = f.offEvents.includes(key);
      if (has) {
        return { ...f, offEvents: f.offEvents.filter((k) => k !== key) };
      }
      if (f.offEvents.length >= MAX_OFF_STAGE_SELECTIONS) {
        return f;
      }
      return { ...f, offEvents: [...f.offEvents, key] };
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrors(data.errors || { general: "എന്തോ പിഴവ് സംഭവിച്ചു" });
        if (data.errors?.studentName || data.errors?.guardianPhone || data.errors?.gender || data.errors?.studentClass) {
          setStep(1);
        } else if (data.errors?.stageEvent || data.errors?.offEvents) {
          setStep(2);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const params = new URLSearchParams({
        regNo: data.regNo,
        name: form.studentName.trim(),
        category: data.categoryLabel,
        stage: data.stageEventName || "",
        off: (data.offEventNames || []).join(", "),
      });
      router.push(`/success?${params.toString()}`);
    } catch (err) {
      setErrors({ general: "ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിക്കുക, വീണ്ടും ശ്രമിക്കുക" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-10 pt-6">
      {/* Header */}
      <header className="arch-frame arch-top-glow star-dots relative mb-6 overflow-hidden bg-night px-5 pb-6 pt-8 text-center shadow-soft">
        <ArchMotif className="mx-auto mb-2 h-16 w-28" />
        <p className="font-mal text-[13px] font-medium text-goldlight/90">
          ഹയാത്തുൽ ഇസ്‌ലാം ഹയർ സെക്കണ്ടറി മദ്‌റസ
        </p>
        <h1 className="font-display mt-1 text-2xl font-bold text-sand">
          മീലാദ് ഫെസ്റ്റ്
        </h1>
        <p className="mt-1 font-mal text-[13px] text-sand/70">
          പ്രോഗ്രാം രജിസ്ട്രേഷൻ
        </p>
      </header>

      <div className="mb-6">
        <StepDots step={step} />
      </div>

      {errors.general && (
        <div className="mb-4 rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-[14px] font-medium text-rose">
          {errors.general}
        </div>
      )}

      {step === 1 && (
        <section className="rise-in flex flex-col gap-5">
          <div>
            <label className="mb-1.5 block text-[14px] font-semibold text-ink">
              കുട്ടിയുടെ പേര്
            </label>
            <input
              type="text"
              value={form.studentName}
              onChange={(e) => update({ studentName: e.target.value })}
              placeholder="ഉദാ: മുഹമ്മദ് ഫായിസ്"
              className="focus-ring w-full rounded-2xl border-2 border-sandline bg-white px-4 py-3.5 text-[16px] outline-none placeholder:text-ink/30"
            />
            {errors.studentName && (
              <p className="mt-1 text-[13px] font-medium text-rose">{errors.studentName}</p>
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
              value={form.guardianPhone}
              onChange={(e) =>
                update({ guardianPhone: e.target.value.replace(/\D/g, "").slice(0, 10) })
              }
              placeholder="9876543210"
              className="focus-ring w-full rounded-2xl border-2 border-sandline bg-white px-4 py-3.5 font-body text-[16px] outline-none placeholder:text-ink/30"
            />
            {errors.guardianPhone && (
              <p className="mt-1 text-[13px] font-medium text-rose">{errors.guardianPhone}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[14px] font-semibold text-ink">ലിംഗം</label>
            <div className="grid grid-cols-2 gap-3">
              <ChoiceButton
                selected={form.gender === "male"}
                onClick={() => update({ gender: "male" })}
              >
                ആൺ
              </ChoiceButton>
              <ChoiceButton
                selected={form.gender === "female"}
                onClick={() => update({ gender: "female" })}
              >
                പെൺ
              </ChoiceButton>
            </div>
            {errors.gender && (
              <p className="mt-1 text-[13px] font-medium text-rose">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[14px] font-semibold text-ink">ക്ലാസ്</label>
            <div className="flex flex-col gap-4">
              {CATEGORIES.map((cat) => (
                <div key={cat.id}>
                  <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-ink/45">
                    {cat.label} · {cat.classRangeLabel}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {cat.classes.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => update({ studentClass: c })}
                        className={[
                          "focus-ring rounded-xl border-2 py-2.5 text-[14px] font-bold transition-colors",
                          form.studentClass === c
                            ? "border-night bg-night text-sand"
                            : "border-sandline bg-white text-ink hover:border-gold",
                        ].join(" ")}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {errors.studentClass && (
              <p className="mt-1 text-[13px] font-medium text-rose">{errors.studentClass}</p>
            )}
          </div>

          <button
            type="button"
            onClick={goNext}
            className="focus-ring mt-2 rounded-2xl bg-night py-4 text-[16px] font-bold text-sand shadow-soft active:scale-[0.99]"
          >
            തുടരുക →
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="rise-in flex flex-col gap-6">
          <div className="rounded-2xl border border-sandline bg-white/70 px-4 py-3 text-center">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-ink/45">
              വിഭാഗം
            </p>
            <p className="font-mal text-[16px] font-bold text-night">
              {category?.label} ({category?.classRangeLabel})
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label className="text-[14px] font-semibold text-ink">
                സ്റ്റേജ് ഇനം <span className="font-normal text-ink/40">(ഒന്ന് മാത്രം)</span>
              </label>
            </div>
            <div className="flex flex-col gap-2.5">
              {available.stage.map((ev) => (
                <ChoiceButton
                  key={ev.key}
                  selected={form.stageEvent === ev.key}
                  tag={ev.girlsOnly ? "പെൺ" : null}
                  onClick={() =>
                    update({ stageEvent: form.stageEvent === ev.key ? "" : ev.key })
                  }
                >
                  {ev.name}
                </ChoiceButton>
              ))}
              {available.stage.length === 0 && (
                <p className="text-[13px] text-ink/40">ലഭ്യമായ സ്റ്റേജ് ഇനങ്ങൾ ഇല്ല</p>
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label className="text-[14px] font-semibold text-ink">
                ഓഫ് സ്റ്റേജ് ഇനങ്ങൾ{" "}
                <span className="font-normal text-ink/40">
                  (പരമാവധി {MAX_OFF_STAGE_SELECTIONS})
                </span>
              </label>
              <span className="text-[12px] font-semibold text-gold">
                {form.offEvents.length}/{MAX_OFF_STAGE_SELECTIONS}
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {available.off.map((ev) => {
                const selected = form.offEvents.includes(ev.key);
                const disabled =
                  !selected && form.offEvents.length >= MAX_OFF_STAGE_SELECTIONS;
                return (
                  <ChoiceButton
                    key={ev.key}
                    selected={selected}
                    disabled={disabled}
                    tag={ev.girlsOnly ? "പെൺ" : null}
                    onClick={() => toggleOffEvent(ev.key)}
                  >
                    {ev.name}
                  </ChoiceButton>
                );
              })}
              {available.off.length === 0 && (
                <p className="text-[13px] text-ink/40">ലഭ്യമായ ഓഫ് സ്റ്റേജ് ഇനങ്ങൾ ഇല്ല</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={goBack}
              className="focus-ring flex-1 rounded-2xl border-2 border-sandline bg-white py-4 text-[15px] font-bold text-ink active:scale-[0.99]"
            >
              ← തിരികെ
            </button>
            <button
              type="button"
              onClick={goNext}
              className="focus-ring flex-[2] rounded-2xl bg-night py-4 text-[16px] font-bold text-sand shadow-soft active:scale-[0.99]"
            >
              തുടരുക →
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="rise-in flex flex-col gap-5">
          <div className="overflow-hidden rounded-2xl border border-sandline bg-white shadow-soft">
            <div className="bg-night px-5 py-3">
              <p className="font-mal text-[13px] font-semibold text-sand/80">
                വിവരങ്ങൾ ഉറപ്പുവരുത്തുക
              </p>
            </div>
            <div className="flex flex-col divide-y divide-sandline">
              <ReviewRow label="പേര്" value={form.studentName} />
              <ReviewRow label="ക്ലാസ്" value={`${form.studentClass} (${category?.label})`} />
              <ReviewRow label="ലിംഗം" value={form.gender === "female" ? "പെൺ" : "ആൺ"} />
              <ReviewRow label="മൊബൈൽ" value={form.guardianPhone} />
              <ReviewRow
                label="സ്റ്റേജ് ഇനം"
                value={
                  available.stage.find((e) => e.key === form.stageEvent)?.name || "തിരഞ്ഞെടുത്തിട്ടില്ല"
                }
              />
              <ReviewRow
                label="ഓഫ് സ്റ്റേജ്"
                value={
                  available.off
                    .filter((e) => form.offEvents.includes(e.key))
                    .map((e) => e.name)
                    .join(", ") || "തിരഞ്ഞെടുത്തിട്ടില്ല"
                }
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={submitting}
              className="focus-ring flex-1 rounded-2xl border-2 border-sandline bg-white py-4 text-[15px] font-bold text-ink active:scale-[0.99] disabled:opacity-50"
            >
              ← എഡിറ്റ്
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="focus-ring flex-[2] rounded-2xl bg-gold py-4 text-[16px] font-bold text-night shadow-soft active:scale-[0.99] disabled:opacity-60"
            >
              {submitting ? "സമർപ്പിക്കുന്നു…" : "സ്ഥിരീകരിക്കുക ✓"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3">
      <span className="text-[13px] font-medium text-ink/45">{label}</span>
      <span className="text-right text-[14px] font-semibold text-ink">{value}</span>
    </div>
  );
}
