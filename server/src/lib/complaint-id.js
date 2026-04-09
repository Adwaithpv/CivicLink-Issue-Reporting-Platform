import { Counter } from "../models/Counter.js";

export async function generateComplaintId(now = new Date()) {
  const year = now.getFullYear();
  const key = `complaint:${year}`;

  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seq = counter.seq;
  const padded = String(seq).padStart(3, "0");
  return `CL-${year}-${padded}`;
}

