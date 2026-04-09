export type UserRole = "citizen" | "admin";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type ComplaintStatus = "pending" | "in_progress" | "resolved";

export type ComplaintSummary = {
  complaintId: string;
  title: string;
  category: string;
  status: ComplaintStatus;
  createdAt: string;
  description: string;
  locationText: string;
};

export type ComplaintDetail = ComplaintSummary & {
  timeline: { at: string; status: string; description: string }[];
};

