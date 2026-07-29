import mongoose from "mongoose";

// --- Counter collection: gives us a safe, atomic, ever-increasing number
// so every registration gets a clean human-friendly ID like MF-2026-0001 ---
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
export const Counter =
  mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

export async function getNextSequence(name) {
  const result = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return result.seq;
}

const RegistrationSchema = new mongoose.Schema(
  {
    regNo: { type: String, required: true, unique: true, index: true },
    studentName: { type: String, required: true, trim: true },
    guardianPhone: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    studentClass: { type: String, required: true }, // e.g. "1", "+2"
    categoryId: { type: String, required: true, index: true },

    // event keys chosen, referencing data/categories.js
    stageEvents: { type: [String], default: [] }, // up to maxStageSelections
    offEvents: { type: [String], default: [] }, // up to MAX_OFF_STAGE_SELECTIONS

    // human-readable snapshots so old registrations still display correctly
    // even if the event catalog is edited later
    stageEventNames: { type: [String], default: [] },
    offEventNames: { type: [String], default: [] },
    categoryLabel: { type: String, required: true },

    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Registration ||
  mongoose.model("Registration", RegistrationSchema);
