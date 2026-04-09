import { Search, CheckCircle, Clock, AlertCircle, MapPin, Calendar } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ApiError, apiFetch } from "../lib/api";
import type { ComplaintDetail, ComplaintStatus, ComplaintSummary } from "../lib/types";

interface TrackComplaintPageProps {
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
}

export function TrackComplaintPage({ onNavigate, isDarkMode }: TrackComplaintPageProps) {
  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState<ComplaintDetail | null>(null);
  const [recent, setRecent] = useState<ComplaintSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch<{ complaints: ComplaintSummary[] }>("/api/complaints/mine");
        setRecent(data.complaints.slice(0, 6));
      } catch {
        // ignore
      }
    })();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = searchId.trim();
    if (!id) return;
    setIsSearching(true);
    setError(null);
    try {
      const data = await apiFetch<{ complaint: ComplaintDetail }>(`/api/complaints/${encodeURIComponent(id)}`);
      setResult(data.complaint);
    } catch (err) {
      setResult(null);
      if (err instanceof ApiError) setError(err.message);
      else setError("Search failed.");
    } finally {
      setIsSearching(false);
    }
  };

  const statusLabel = (status: ComplaintStatus) =>
    status === "pending" ? "Pending" : status === "in_progress" ? "In Progress" : "Resolved";

  const progress = useMemo(() => {
    if (!result) return 0;
    if (result.status === "pending") return 20;
    if (result.status === "in_progress") return 50;
    return 100;
  }, [result]);

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/20 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl text-gray-900 mb-4">Track Your Complaint</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Enter your complaint ID to check the status and progress
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 border border-gray-100">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#2563eb] transition-colors" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Complaint ID (e.g., CL-2026-001)"
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white px-10 py-4 rounded-xl hover:from-[#1d4ed8] hover:to-[#2563eb] transition-all shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {/* Search Results or All Complaints */}
        {error ? (
          <div className="bg-red-50 rounded-2xl p-6 shadow-lg border border-red-200 text-red-700">
            {error}
          </div>
        ) : result ? (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Complaint Header */}
              <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50/50 to-green-50/50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-2 h-16 ${getCategoryColor(result.category)} rounded-full shadow-lg`}></div>
                      <div>
                        <h2 className="text-2xl text-gray-900">{result.title}</h2>
                        <p className="text-sm text-gray-500 font-mono mt-1">ID: {result.complaintId}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-5 py-3 rounded-xl border-2 flex items-center gap-2 shadow-lg ${getStatusColor(result.status)}`}
                    >
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{statusLabel(result.status)}</span>
                    </span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                      <MapPin className="w-5 h-5 text-[#2563eb]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="text-gray-900 font-medium">{result.locationText}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                      <Calendar className="w-5 h-5 text-[#2563eb]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Reported on</p>
                      <p className="text-gray-900 font-medium">
                        {new Date(result.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 font-medium">Progress</span>
                  <span className="text-sm font-bold text-[#2563eb]">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] h-4 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/30"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-8">
                <h3 className="text-xl text-gray-900 mb-6">Status Timeline</h3>
                <div className="space-y-6">
                  {(result.timeline || []).map((update, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full shadow-lg ${
                            index === 0 ? "bg-gradient-to-br from-[#2563eb] to-[#3b82f6]" : "bg-gray-300"
                          }`}
                        ></div>
                        {index !== result.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gradient-to-b from-gray-300 to-gray-100 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-gray-900 font-medium">{update.status}</h4>
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {new Date(update.at).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{update.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setResult(null);
                setSearchId("");
              }}
              className="w-full bg-gray-100 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-200 transition-all"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl text-gray-900 mb-6">Recent Complaints</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {recent.map((complaint) => (
                <div
                  key={complaint.complaintId}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer"
                  onClick={() => {
                    setSearchId(complaint.complaintId);
                    void apiFetch<{ complaint: ComplaintDetail }>(
                      `/api/complaints/${encodeURIComponent(complaint.complaintId)}`
                    ).then((data) => setResult(data.complaint));
                  }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-2 h-20 ${getCategoryColor(complaint.category)} rounded-full shadow-lg`}></div>
                    <div className="flex-1">
                      <h3 className="text-lg text-gray-900 mb-2 font-medium">{complaint.title}</h3>
                      <p className="text-sm text-gray-500 mb-3 font-mono">ID: {complaint.complaintId}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-4 py-2 rounded-xl text-sm border-2 flex items-center gap-2 shadow-md ${getStatusColor(complaint.status)}`}>
                          {getStatusIcon(complaint.status)}
                          <span className="font-medium">{statusLabel(complaint.status)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{complaint.description}</p>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Box */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-gray-900 mb-3 text-lg">Need Help?</h3>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            If you don't have your complaint ID, you can find it in:
          </p>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#2563eb] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                <span className="text-white text-xs">•</span>
              </div>
              <span className="leading-relaxed">Your email confirmation after submitting the report</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#2563eb] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                <span className="text-white text-xs">•</span>
              </div>
              <span className="leading-relaxed">
                Your{" "}
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-[#2563eb] underline hover:text-[#1d4ed8] font-medium"
                >
                  dashboard
                </button>
                {" "}under "My Complaints"
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}