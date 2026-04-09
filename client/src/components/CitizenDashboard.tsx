import { Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiFetch, ApiError } from "../lib/api";
import type { ComplaintSummary, ComplaintStatus } from "../lib/types";

interface CitizenDashboardProps {
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
}

function statusLabel(status: ComplaintStatus) {
  if (status === "pending") return "Pending";
  if (status === "in_progress") return "In Progress";
  return "Resolved";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export function CitizenDashboard({ onNavigate }: CitizenDashboardProps) {
  const [complaints, setComplaints] = useState<ComplaintSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiFetch<{ complaints: ComplaintSummary[] }>("/api/complaints/mine");
        setComplaints(data.complaints);
      } catch (err) {
        if (err instanceof ApiError) setError(err.message);
        else setError("Failed to load complaints.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700";
      case "in_progress":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-700";
      case "resolved":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-700";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600";
    }
  };

  const getStatusIcon = (status: ComplaintStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "in_progress":
        return <AlertCircle className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Road":
        return "bg-blue-500";
      case "Waste":
        return "bg-green-500";
      case "Water":
        return "bg-cyan-500";
      case "Safety":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const stats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter((c) => c.status === "pending").length,
      inProgress: complaints.filter((c) => c.status === "in_progress").length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
    };
  }, [complaints]);

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 dark:text-white mb-2 transition-colors">Welcome back, Citizen!</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors">Track and manage your reported issues</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-white/10 dark:backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-white/20 hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 dark:text-gray-300 transition-colors">Total Issues</h3>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white text-xl">📋</span>
              </div>
            </div>
            <p className="text-4xl text-gray-900 dark:text-white mb-1 transition-colors">{stats.total}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">All time</p>
          </div>

          <div className="bg-white dark:bg-white/10 dark:backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-white/20 hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 dark:text-gray-300 transition-colors">Pending</h3>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-4xl text-gray-900 dark:text-white mb-1 transition-colors">{stats.pending}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Awaiting review</p>
          </div>

          <div className="bg-white dark:bg-white/10 dark:backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-white/20 hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 dark:text-gray-300 transition-colors">In Progress</h3>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-4xl text-gray-900 dark:text-white mb-1 transition-colors">{stats.inProgress}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Being worked on</p>
          </div>

          <div className="bg-white dark:bg-white/10 dark:backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-white/20 hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 dark:text-gray-300 transition-colors">Resolved</h3>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-4xl text-gray-900 dark:text-white mb-1 transition-colors">{stats.resolved}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Completed</p>
          </div>
        </div>

        {/* Report New Issue Button */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('report')}
            className="w-full sm:w-auto bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white px-8 py-4 rounded-xl hover:from-[#1d4ed8] hover:to-[#2563eb] transition-all shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 flex items-center justify-center gap-2 hover:scale-105 hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" />
            Report New Issue
          </button>
        </div>

        {/* My Complaints Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-gray-900 dark:text-white transition-colors">My Complaints</h2>
          </div>

          <div className="space-y-4">
            {isLoading && (
              <div className="bg-white dark:bg-white/10 dark:backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-white/20">
                <p className="text-gray-600 dark:text-gray-300">Loading your complaints…</p>
              </div>
            )}
            {!isLoading && error && (
              <div className="bg-red-50 dark:bg-red-500/10 dark:backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-red-200 dark:border-red-500/30">
                <p className="text-red-700 dark:text-red-200">{error}</p>
              </div>
            )}
            {!isLoading && !error && complaints.length === 0 && (
              <div className="bg-white dark:bg-white/10 dark:backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-white/20">
                <p className="text-gray-600 dark:text-gray-300">No complaints yet. Report your first issue to get started.</p>
              </div>
            )}
            {!isLoading &&
              !error &&
              complaints.map((complaint) => (
              <div
                key={complaint.complaintId}
                className="bg-white dark:bg-white/10 dark:backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-white/20 hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
                onClick={() => onNavigate("track")}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <div className={`w-1.5 h-20 ${getCategoryColor(complaint.category)} rounded-full shadow-lg`}></div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-lg text-gray-900 dark:text-white transition-colors">{complaint.title}</h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-mono transition-colors">#{complaint.complaintId}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 leading-relaxed transition-colors">{complaint.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors">
                            {complaint.category}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1 transition-colors">
                            <Clock className="w-4 h-4" />
                            {formatDate(complaint.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end sm:justify-start">
                    <span className={`px-5 py-2.5 rounded-xl border-2 flex items-center gap-2 shadow-md ${getStatusColor(complaint.status)} transition-colors`}>
                      {getStatusIcon(complaint.status)}
                      <span className="font-medium">{statusLabel(complaint.status)}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}