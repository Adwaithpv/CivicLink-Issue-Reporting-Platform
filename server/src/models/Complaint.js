import mongoose from "mongoose";

const TimelineEventSchema = new mongoose.Schema(
  {
    at: { type: Date, required: true, default: () => new Date() },
    status: { type: String, required: true },
    description: { type: String, required: true },
    byUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { _id: false }
);

const ComplaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    locationText: { type: String, required: true, trim: true },
    status: { type: String, enum: ["pending", "in_progress", "resolved"], default: "pending", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    timeline: { type: [TimelineEventSchema], default: [] },
  },
  { timestamps: true }
);

export const Complaint = mongoose.model("Complaint", ComplaintSchema);

