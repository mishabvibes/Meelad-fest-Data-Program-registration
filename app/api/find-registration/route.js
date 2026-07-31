import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req) {
  try {
    // --- Rate limiting ---
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const rl = checkRateLimit(ip);
    if (!rl.ok) {
      return NextResponse.json(
        {
          ok: false,
          errors: {
            general:
              "വളരെയധികം അഭ്യർത്ഥനകൾ. കുറച്ച് സമയം കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക.",
          },
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { regNo, studentName, guardianPhone } = body || {};

    // --- Determine search mode ---
    const hasRegNo = regNo && typeof regNo === "string" && regNo.trim().length > 0;
    const hasNamePhone =
      studentName &&
      typeof studentName === "string" &&
      studentName.trim().length >= 2 &&
      guardianPhone &&
      typeof guardianPhone === "string" &&
      /^[6-9]\d{9}$/.test(guardianPhone.trim());

    if (!hasRegNo && !hasNamePhone) {
      return NextResponse.json(
        {
          ok: false,
          errors: {
            general:
              "രജിസ്ട്രേഷൻ നമ്പർ അല്ലെങ്കിൽ പേരും മൊബൈൽ നമ്പറും നൽകുക.",
          },
        },
        { status: 400 }
      );
    }

    await dbConnect();

    let registration = null;

    if (hasRegNo) {
      // Case-insensitive exact match on reg number
      registration = await Registration.findOne({
        regNo: { $regex: `^${regNo.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
      }).lean();
    } else {
      // Name + phone combo
      registration = await Registration.findOne({
        studentName: { $regex: `^${studentName.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
        guardianPhone: guardianPhone.trim(),
      }).lean();
    }

    if (!registration) {
      return NextResponse.json(
        {
          ok: false,
          errors: {
            general: "രജിസ്ട്രേഷൻ കണ്ടെത്താനായില്ല. വിവരങ്ങൾ ശരിയാണോ എന്ന് പരിശോധിക്കുക.",
          },
        },
        { status: 404 }
      );
    }

    // Convert _id to string for JSON serialisation
    return NextResponse.json({
      ok: true,
      registration: {
        _id: registration._id.toString(),
        regNo: registration.regNo,
        studentName: registration.studentName,
        guardianPhone: registration.guardianPhone,
        gender: registration.gender,
        studentClass: registration.studentClass,
        categoryId: registration.categoryId,
        categoryLabel: registration.categoryLabel,
        stageEvents: registration.stageEvents,
        stageEventNames: registration.stageEventNames,
        offEvents: registration.offEvents,
        offEventNames: registration.offEventNames,
        notes: registration.notes,
        createdAt: registration.createdAt,
      },
    });
  } catch (err) {
    console.error("Find registration error:", err);
    return NextResponse.json(
      {
        ok: false,
        errors: { general: "എന്തോ പിഴവ് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക." },
      },
      { status: 500 }
    );
  }
}
