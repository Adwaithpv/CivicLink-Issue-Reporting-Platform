import { Router } from "express";
import { z } from "zod";

import { requireLogin } from "../middleware/auth.js";
import { Complaint } from "../models/Complaint.js";
import { generateComplaintId } from "../lib/complaint-id.js";

export const complaintsRouter = Router();

complaintsRouter.use(requireLogin);

complaintsRouter.post("/", async (req, res, next) => {
  try {
    const Body = z.object({
      title: z.string().min(3).max(200),
      category: z.string().min(2).max(60),
      description: z.string().min(10).max(4000),
      locationText: z.string().min(3).max(300),
    });

    const { title, category, description, locationText } = Body.parse(req.body);
    const userId = req.session.user.id;

    const complaintId = await generateComplaintId();

    const complaint = await Complaint.create({
      complaintId,
      title,
      category,
      description,
      locationText,
      status: "pending",
      createdBy: userId,
      timeline: [
        {
          status: "Submitted",
          description: "Complaint submitted by citizen",
          byUserId: userId,
        },
      ],
    });

    res.status(201).json({
      complaint: {
        complaintId: complaint.complaintId,
      },
    });
  } catch (err) {
    next(err);
  }
});

complaintsRouter.get("/mine", async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const complaints = await Complaint.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      complaints: complaints.map((c) => ({
        complaintId: c.complaintId,
        title: c.title,
        category: c.category,
        status: c.status,
        createdAt: c.createdAt,
        description: c.description,
        locationText: c.locationText,
      })),
    });
  } catch (err) {
    next(err);
  }
});

complaintsRouter.get("/:complaintId", async (req, res, next) => {
  try {
    const complaintId = String(req.params.complaintId || "").trim();
    if (!complaintId) return res.status(400).json({ error: "Missing complaintId" });

    const user = req.session.user;

    const complaint = await Complaint.findOne({ complaintId }).lean();
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    if (user.role !== "admin" && String(complaint.createdBy) !== user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json({
      complaint: {
        complaintId: complaint.complaintId,
        title: complaint.title,
        category: complaint.category,
        status: complaint.status,
        createdAt: complaint.createdAt,
        locationText: complaint.locationText,
        description: complaint.description,
        timeline: (complaint.timeline || []).map((e) => ({
          at: e.at,
          status: e.status,
          description: e.description,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});

