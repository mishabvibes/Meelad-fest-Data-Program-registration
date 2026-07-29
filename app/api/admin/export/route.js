import { dbConnect } from "@/lib/mongodb";
import Registration from "@/models/Registration";

export const dynamic = "force-dynamic";

function csvEscape(value) {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  await dbConnect();
  const registrations = await Registration.find({}).sort({ createdAt: 1 }).lean();

  const headers = [
    "Reg No",
    "Student Name",
    "Class",
    "Category",
    "Gender",
    "Guardian Phone",
    "Stage Event",
    "Off-Stage Events",
    "Registered At",
  ];

  const rows = registrations.map((r) => [
    r.regNo,
    r.studentName,
    r.studentClass,
    r.categoryLabel,
    r.gender === "female" ? "Female" : "Male",
    r.guardianPhone,
    r.stageEventName || "-",
    (r.offEventNames || []).join(" | ") || "-",
    new Date(r.createdAt).toLocaleString("en-IN"),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\r\n");

  // Prefix BOM so Excel opens Malayalam text correctly
  const bom = "\uFEFF";

  return new Response(bom + csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="meelad-fest-registrations-${Date.now()}.csv"`,
    },
  });
}
