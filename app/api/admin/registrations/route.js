import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import { CATEGORIES } from "@/data/categories";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const q = searchParams.get("q");

    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (q) {
      filter.$or = [
        { studentName: { $regex: q, $options: "i" } },
        { guardianPhone: { $regex: q, $options: "i" } },
        { regNo: { $regex: q, $options: "i" } },
      ];
    }

    const registrations = await Registration.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    // Automatically tally how many students picked each event, per category
    const eventCounts = {};
    for (const cat of CATEGORIES) {
      eventCounts[cat.id] = { stage: {}, off: {} };
      cat.stage.forEach((e) => (eventCounts[cat.id].stage[e.key] = 0));
      cat.off.forEach((e) => (eventCounts[cat.id].off[e.key] = 0));
    }
    for (const r of registrations) {
      if (r.stageEvent && eventCounts[r.categoryId]) {
        eventCounts[r.categoryId].stage[r.stageEvent] =
          (eventCounts[r.categoryId].stage[r.stageEvent] || 0) + 1;
      }
      for (const off of r.offEvents || []) {
        if (eventCounts[r.categoryId]) {
          eventCounts[r.categoryId].off[off] =
            (eventCounts[r.categoryId].off[off] || 0) + 1;
        }
      }
    }

    return NextResponse.json({
      ok: true,
      total: registrations.length,
      registrations,
      eventCounts,
    });
  } catch (err) {
    console.error("Admin list error:", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
