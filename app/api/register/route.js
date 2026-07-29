import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Registration, { getNextSequence } from "@/models/Registration";
import {
  getCategoryByClass,
  getAvailableEvents,
  MAX_OFF_STAGE_SELECTIONS,
} from "@/data/categories";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      studentName,
      guardianPhone,
      gender,
      studentClass,
      stageEvent,
      offEvents,
    } = body || {};

    // --- Validation (kept in one place so bad data never reaches the DB) ---
    const errors = {};

    if (!studentName || studentName.trim().length < 2) {
      errors.studentName = "കുട്ടിയുടെ പേര് ശരിയായി നൽകുക";
    }
    if (!guardianPhone || !/^[6-9]\d{9}$/.test(guardianPhone.trim())) {
      errors.guardianPhone = "10 അക്ക മൊബൈൽ നമ്പർ നൽകുക";
    }
    if (!["male", "female"].includes(gender)) {
      errors.gender = "ലിംഗം തിരഞ്ഞെടുക്കുക";
    }

    const category = getCategoryByClass(studentClass);
    if (!category) {
      errors.studentClass = "ക്ലാസ് തിരഞ്ഞെടുക്കുക";
    }

    let available = { stage: [], off: [] };
    if (category && ["male", "female"].includes(gender)) {
      available = getAvailableEvents(category.id, gender);
    }

    const stageKeys = available.stage.map((e) => e.key);
    const offKeys = available.off.map((e) => e.key);

    if (stageEvent && !stageKeys.includes(stageEvent)) {
      errors.stageEvent = "തിരഞ്ഞെടുത്ത സ്റ്റേജ് ഇനം ലഭ്യമല്ല";
    }

    const chosenOff = Array.isArray(offEvents) ? offEvents : [];
    if (chosenOff.length > MAX_OFF_STAGE_SELECTIONS) {
      errors.offEvents = `പരമാവധി ${MAX_OFF_STAGE_SELECTIONS} ഇനങ്ങൾ മാത്രം തിരഞ്ഞെടുക്കാം`;
    }
    if (chosenOff.some((k) => !offKeys.includes(k))) {
      errors.offEvents = "തിരഞ്ഞെടുത്ത ഇനങ്ങളിൽ ചിലത് ലഭ്യമല്ല";
    }

    if (!stageEvent && chosenOff.length === 0) {
      errors.general = "ചുരുങ്ങിയത് ഒരു ഇനമെങ്കിലും തിരഞ്ഞെടുക്കുക";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    await dbConnect();

    // Prevent an accidental double-submit of the exact same student
    const duplicate = await Registration.findOne({
      studentName: studentName.trim(),
      studentClass,
      guardianPhone: guardianPhone.trim(),
    });
    if (duplicate) {
      return NextResponse.json(
        {
          ok: false,
          errors: {
            general:
              "ഈ വിവരങ്ങളോടെ ഒരു രജിസ്ട്രേഷൻ നിലവിലുണ്ട്: " + duplicate.regNo,
          },
        },
        { status: 409 }
      );
    }

    const year = new Date().getFullYear();
    const seq = await getNextSequence(`registration_${year}`);
    const regNo = `MF-${year}-${String(seq).padStart(4, "0")}`;

    const stageEventObj = available.stage.find((e) => e.key === stageEvent);
    const offEventObjs = available.off.filter((e) => chosenOff.includes(e.key));

    const doc = await Registration.create({
      regNo,
      studentName: studentName.trim(),
      guardianPhone: guardianPhone.trim(),
      gender,
      studentClass,
      categoryId: category.id,
      categoryLabel: `${category.label} (${category.classRangeLabel})`,
      stageEvent: stageEventObj ? stageEventObj.key : null,
      stageEventName: stageEventObj ? stageEventObj.name : null,
      offEvents: offEventObjs.map((e) => e.key),
      offEventNames: offEventObjs.map((e) => e.name),
    });

    return NextResponse.json({
      ok: true,
      regNo: doc.regNo,
      categoryLabel: doc.categoryLabel,
      stageEventName: doc.stageEventName,
      offEventNames: doc.offEventNames,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { ok: false, errors: { general: "എന്തോ പിഴവ് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക." } },
      { status: 500 }
    );
  }
}
