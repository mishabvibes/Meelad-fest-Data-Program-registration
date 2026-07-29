import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Settings from "@/models/Settings";
import {
  getCategoryByClass,
  getAvailableEvents,
} from "@/data/categories";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    if (!id) return NextResponse.json({ ok: false, message: "ID is required" }, { status: 400 });

    const deleted = await Registration.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, message: "Registration not found" }, { status: 404 });
    }
    
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin DELETE error:", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    if (!id) return NextResponse.json({ ok: false, message: "ID is required" }, { status: 400 });

    const body = await req.json();
    const {
      studentName,
      guardianPhone,
      gender,
      studentClass,
      stageEvents,
      offEvents,
    } = body || {};

    let settings = await Settings.findOne({});
    const maxOffStageSelections = settings?.maxOffStageSelections ?? 2;
    const maxStageSelections = settings?.maxStageSelections ?? 1;

    const errors = {};

    if (!studentName || studentName.trim().length < 2) {
      errors.studentName = "കുട്ടിയുടെ പേര് ശരിയായി നൽകുക";
    }
    if (!guardianPhone || !/^[6-9]\d{9}$/.test(guardianPhone.trim())) {
      errors.guardianPhone = "10 അക്ക മൊബൈൽ നമ്പർ ശരിയായി നൽകുക";
    }
    if (!gender || (gender !== "male" && gender !== "female")) {
      errors.gender = "ലിംഗം തിരഞ്ഞെടുക്കുക";
    }
    const category = getCategoryByClass(studentClass);
    if (!category) {
      errors.studentClass = "ക്ലാസ് തിരഞ്ഞെടുക്കുക";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    const available = getAvailableEvents(category.id, gender);
    const stageKeys = available.stage.map((e) => e.key);
    const offKeys = available.off.map((e) => e.key);

    const chosenStage = Array.isArray(stageEvents) ? stageEvents : [];
    if (chosenStage.length > maxStageSelections) {
      errors.stageEvents = `പരമാവധി ${maxStageSelections} ഇനങ്ങൾ മാത്രം തിരഞ്ഞെടുക്കാം`;
    }
    if (chosenStage.some((k) => !stageKeys.includes(k))) {
      errors.stageEvents = "തിരഞ്ഞെടുത്ത സ്റ്റേജ് ഇനം ലഭ്യമല്ല";
    }

    const chosenOff = Array.isArray(offEvents) ? offEvents : [];
    if (chosenOff.length > maxOffStageSelections) {
      errors.offEvents = `പരമാവധി ${maxOffStageSelections} ഇനങ്ങൾ മാത്രം തിരഞ്ഞെടുക്കാം`;
    }
    if (chosenOff.some((k) => !offKeys.includes(k))) {
      errors.offEvents = "തിരഞ്ഞെടുത്ത ഇനങ്ങളിൽ ചിലത് ലഭ്യമല്ല";
    }

    if (chosenStage.length === 0 && chosenOff.length === 0) {
      errors.general = "ചുരുങ്ങിയത് ഒരു ഇനമെങ്കിലും തിരഞ്ഞെടുക്കുക";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    const stageEventObjs = available.stage.filter((e) => chosenStage.includes(e.key));
    const offEventObjs = available.off.filter((e) => chosenOff.includes(e.key));

    const updated = await Registration.findByIdAndUpdate(
      id,
      {
        studentName: studentName.trim(),
        guardianPhone: guardianPhone.trim(),
        gender,
        studentClass,
        categoryId: category.id,
        categoryLabel: `${category.label} (${category.classRangeLabel})`,
        stageEvents: stageEventObjs.map((e) => e.key),
        stageEventNames: stageEventObjs.map((e) => e.name),
        offEvents: offEventObjs.map((e) => e.key),
        offEventNames: offEventObjs.map((e) => e.name),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ ok: false, message: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      regNo: updated.regNo,
      categoryLabel: updated.categoryLabel,
      stageEventNames: updated.stageEventNames,
      offEventNames: updated.offEventNames,
    });
  } catch (err) {
    console.error("Admin PUT error:", err);
    return NextResponse.json({ ok: false, errors: { general: "Server error" } }, { status: 500 });
  }
}
