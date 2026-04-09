import { Router } from "express";
import { z } from "zod";

import { requireAdmin } from "../middleware/auth.js";
import { Complaint } from "../models/Complaint.js";

export const adminRouter = Router();

adminRouter.use(requireAdmin);

adminRouter.get("/complaints", async (req, res, next) => {
  try {
    const Query = z.object({
      status: z.string().optional(),
      category: z.string().optional(),
    });
    const { status, category } = Query.parse(req.query);

    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (category && category !== "all") filter.category = category;

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 }).lean();

    res.json({
      complaints: complaints.map((c) => ({
        complaintId: c.complaintId,
        title: c.title,
        category: c.category,
        status: c.status,
        createdAt: c.createdAt,
        locationText: c.locationText,
        description: c.description,
        createdBy: String(c.createdBy),
      })),
    });
  } catch (err) {
    next(err);
  }
});

adminRouter.patch("/complaints/:complaintId/status", async (req, res, next) => {
  try {
    const Params = z.object({ complaintId: z.string().min(1) });
    const Body = z.object({
      status: z.enum(["pending", "in_progress", "resolved"]),
      note: z.string().min(3).max(300).optional(),
    });

    const { complaintId } = Params.parse(req.params);
    const { status, note } = Body.parse(req.body);

    const complaint = await Complaint.findOne({ complaintId });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    complaint.status = status;
    complaint.timeline.push({
      status:
        status === "pending"
          ? "Pending"
          : status === "in_progress"
            ? "In Progress"
            : "Resolved",
      description: note || "Status updated by admin",
      byUserId: req.session.user.id,
      at: new Date(),
    });

    await complaint.save();

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

