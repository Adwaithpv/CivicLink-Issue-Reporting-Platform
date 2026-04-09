import { Filter, ChevronDown, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ApiError, apiFetch } from "../lib/api";
import type { ComplaintStatus, ComplaintSummary } from "../lib/types";

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
}

type AdminComplaint = ComplaintSummary & { createdBy: string };

function statusLabel(status: ComplaintStatus) {
  if (status === "pending") return "Pending";
  if (status === "in_progress") return "In Progress";
  return "Resolved";
}

export function AdminDashboard({ onNavigate, isDarkMode }: AdminDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [complaints, setComplaints] = useState<AdminComplaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const statusParam =
          selectedStatus === "All"
            ? "all"
            : selectedStatus === "Pending"
              ? "pending"
              : selectedStatus === "In Progress"
                ? "in_progress"
                : "resolved";
        const categoryParam = selectedCategory === "All" ? "all" : selectedCategory;

        const qs = new URLSearchParams({ status: statusParam, category: categoryParam });
        const data = await apiFetch<{ complaints: AdminComplaint[] }>(`/api/admin/complaints?${qs.toString()}`);
        setComplaints(data.complaints);
      } catch (err) {
        if (err instanceof ApiError) setError(err.message);
        else setError("Failed to load complaints.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [selectedCategory, selectedStatus]);

  const stats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter((c) => c.status === "pending").length,
      inProgress: complaints.filter((c) => c.status === "in_progress").length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
    };
  }, [complaints]);

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = async (complaintId: string, newStatus: ComplaintStatus) => {
    await apiFetch<{ ok: true }>(`/api/admin/complaints/${encodeURIComponent(complaintId)}/status`, {
      method: "PATCH",
      body: { status: newStatus },
    });
    setComplaints((prev) =>
      prev.map((c) => (c.complaintId === complaintId ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage and resolve citizen complaints</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600">Total Complaints</h3>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white text-xl">📋</span>
              </div>
            </div>
            <p className="text-4xl text-gray-900 mb-1">{stats.total}</p>
            <p className="text-sm text-gray-500">All complaints</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600">Pending</h3>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-4xl text-gray-900 mb-1">{stats.pending}</p>
            <p className="text-sm text-gray-500">Needs attention</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600">In Progress</h3>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-4xl text-gray-900 mb-1">{stats.inProgress}</p>
            <p className="text-sm text-gray-500">Being worked on</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600">Resolved</h3>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-4xl text-gray-900 mb-1">{stats.resolved}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg text-gray-900">Filter Complaints</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-2 font-medium">Category</label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb] appearance-none bg-gray-50 focus:bg-white cursor-pointer transition-all"
                >
                  <option value="All">All Categories</option>
                  <option value="Road">Road Issues</option>
                  <option value="Waste">Waste Management</option>
                  <option value="Water">Water Supply</option>
                  <option value="Safety">Public Safety</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-2 font-medium">Status</label>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb] appearance-none bg-gray-50 focus:bg-white cursor-pointer transition-all"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {isLoading && (
            <div className="px-6 py-8 text-gray-600">Loading complaints…</div>
          )}
          {!isLoading && error && (
            <div className="px-6 py-8 text-red-700 bg-red-50 border-b border-red-200">{error}</div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-gray-900 font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-900 font-semibold">Title</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-900 font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-900 font-semibold">Location</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-900 font-semibold">Citizen</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-900 font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-900 font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-900 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {!isLoading &&
                  !error &&
                  complaints.map((complaint) => (
                  <tr key={complaint.complaintId} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-[#2563eb] font-medium">{complaint.complaintId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium max-w-xs">{complaint.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-lg text-sm font-medium shadow-sm">
                        {complaint.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{complaint.locationText}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-mono">{complaint.createdBy.slice(0, 8)}…</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-2 rounded-xl text-sm font-medium shadow-md ${getStatusColor(complaint.status)}`}>
                        {statusLabel(complaint.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative group">
                        <button className="px-5 py-2 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white text-sm rounded-xl hover:from-[#1d4ed8] hover:to-[#2563eb] transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105">
                          Update
                        </button>
                        <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-10 overflow-hidden">
                          <button
                            onClick={async () => {
                              await handleStatusUpdate(complaint.complaintId, "pending");
                            }}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 transition-colors"
                          >
                            Set to Pending
                          </button>
                          <button
                            onClick={async () => {
                              await handleStatusUpdate(complaint.complaintId, "in_progress");
                            }}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                          >
                            Set to In Progress
                          </button>
                          <button
                            onClick={async () => {
                              await handleStatusUpdate(complaint.complaintId, "resolved");
                            }}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                          >
                            Set to Resolved
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!isLoading && !error && complaints.length === 0 && (
            <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No complaints found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}