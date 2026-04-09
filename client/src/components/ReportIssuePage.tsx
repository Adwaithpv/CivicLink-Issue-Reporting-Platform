import { Upload, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { ApiError, apiFetch } from "../lib/api";

interface ReportIssuePageProps {
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
}

export function ReportIssuePage({ onNavigate, isDarkMode }: ReportIssuePageProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
  });
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const data = await apiFetch<{ complaint: { complaintId: string } }>("/api/complaints", {
        method: "POST",
        body: {
          title: formData.title,
          category: formData.category,
          description: formData.description,
          locationText: formData.location,
        },
      });
      alert(
        `Issue reported successfully!\n\nComplaint ID: ${data.complaint.complaintId}\n\nYou can track your complaint from your dashboard.`
      );
      onNavigate("dashboard");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to submit issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl text-gray-900 mb-4">Report an Issue</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Help us improve your community by reporting civic issues
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}
            {/* Issue Title */}
            <div>
              <label htmlFor="title" className="block text-gray-900 mb-2">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief description of the issue"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label htmlFor="category" className="block text-gray-900 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent appearance-none bg-gray-50 focus:bg-white transition-all cursor-pointer"
                required
              >
                <option value="">Select a category</option>
                <option value="Road">🛣️ Road Issues</option>
                <option value="Waste">♻️ Waste Management</option>
                <option value="Water">💧 Water Supply</option>
                <option value="Safety">🚨 Public Safety</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-gray-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide detailed information about the issue..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent resize-none transition-all bg-gray-50 focus:bg-white"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Include as much detail as possible to help us understand the issue
              </p>
            </div>

            {/* Upload Photo */}
            <div>
              <label className="block text-gray-900 mb-2">
                Upload Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#2563eb] transition-all cursor-pointer bg-gray-50 hover:bg-blue-50/50 group">
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="photo" className="cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-110 transition-all">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  {selectedFile ? (
                    <p className="text-[#2563eb] font-medium">Selected: {selectedFile}</p>
                  ) : (
                    <>
                      <p className="text-gray-700 mb-1 font-medium">Click to upload photo</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-gray-900 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#2563eb] transition-colors" />
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter street address or landmark"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Provide the exact location where the issue is located
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white px-6 py-4 rounded-xl hover:from-[#1d4ed8] hover:to-[#2563eb] transition-all shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 flex items-center justify-center gap-2 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="sm:w-auto bg-gray-100 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-gray-900 mb-3 text-lg">What happens next?</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="leading-relaxed">Your report will be reviewed by our team within 24 hours</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="leading-relaxed">You'll receive a unique complaint ID to track progress</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="leading-relaxed">Updates will be sent to your email and dashboard</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="leading-relaxed">Authorities will work to resolve the issue promptly</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}