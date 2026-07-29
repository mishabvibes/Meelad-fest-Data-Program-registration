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
    const studentClass = searchParams.get("studentClass");
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (studentClass) filter.studentClass = studentClass;
    if (q) {
      filter.$or = [
        { studentName: { $regex: q, $options: "i" } },
        { guardianPhone: { $regex: q, $options: "i" } },
        { regNo: { $regex: q, $options: "i" } },
      ];
    }

    const [total, registrations, tallyData] = await Promise.all([
      Registration.countDocuments(filter),
      Registration.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Registration.find(filter)
        .select("categoryId stageEvents offEvents")
        .lean(),
    ]);

    // Automatically tally how many students picked each event, per category
    const eventCounts = {};
    for (const cat of CATEGORIES) {
      eventCounts[cat.id] = { stage: {}, off: {} };
      cat.stage.forEach((e) => (eventCounts[cat.id].stage[e.key] = 0));
      cat.off.forEach((e) => (eventCounts[cat.id].off[e.key] = 0));
    }
    
    for (const r of tallyData) {
      for (const st of r.stageEvents || []) {
        if (eventCounts[r.categoryId]) {
          eventCounts[r.categoryId].stage[st] = (eventCounts[r.categoryId].stage[st] || 0) + 1;
        }
      }
      for (const off of r.offEvents || []) {
        if (eventCounts[r.categoryId]) {
          eventCounts[r.categoryId].off[off] = (eventCounts[r.categoryId].off[off] || 0) + 1;
        }
      }
    }

    return NextResponse.json({
      ok: true,
      total,
      page,
      limit,
      registrations,
      eventCounts,
    });
  } catch (err) {
    console.error("Admin list error:", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
