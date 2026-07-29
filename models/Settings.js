import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    maxOffStageSelections: {
      type: Number,
      default: 2,
    },
    maxStageSelections: {
      type: Number,
      default: 1,
    },
    registrationDeadline: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
