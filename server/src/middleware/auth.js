export function requireLogin(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export function requireAdmin(req, res, next) {
  const user = req.session?.user;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

