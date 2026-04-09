import { AlertCircle, CheckCircle, ClipboardList, Mail, Phone } from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-transparent to-green-50/20 dark:from-transparent dark:via-transparent dark:to-transparent transition-colors duration-300">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="text-center">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-[#2563eb] dark:text-blue-400 rounded-full text-sm">
              Trusted by 50,000+ citizens
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-gray-900 dark:text-white mb-6 leading-tight transition-colors">
            Report Civic Issues{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">
              Easily
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed transition-colors">
            Help make your community better. Report and track civic issues in your neighborhood with CivicLink.
          </p>
          <button
            onClick={() => onNavigate('report')}
            className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white px-10 py-4 rounded-xl text-lg hover:from-[#1d4ed8] hover:to-[#2563eb] transition-all shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 hover:-translate-y-1"
          >
            Report an Issue
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white dark:bg-gray-800 py-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-gray-900 dark:text-white mb-4 transition-colors">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto transition-colors">
              Three simple steps to make a difference in your community
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#2563eb] to-[#3b82f6] rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-blue-500/30 group-hover:shadow-2xl group-hover:shadow-blue-500/40 transition-all group-hover:scale-110">
                  <ClipboardList className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-500 transition-colors">
                  <span className="text-[#2563eb]">1</span>
                </div>
              </div>
              <h3 className="text-xl text-gray-900 dark:text-white mb-3 transition-colors">Report</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">
                Submit a detailed report about the civic issue with photos and location
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-orange-500/30 group-hover:shadow-2xl group-hover:shadow-orange-500/40 transition-all group-hover:scale-110">
                  <AlertCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border-2 border-orange-500 transition-colors">
                  <span className="text-[#f59e0b]">2</span>
                </div>
              </div>
              <h3 className="text-xl text-gray-900 dark:text-white mb-3 transition-colors">Track</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">
                Monitor the status of your complaint and receive real-time updates
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#10b981] to-[#34d399] rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-green-500/30 group-hover:shadow-2xl group-hover:shadow-green-500/40 transition-all group-hover:scale-110">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border-2 border-green-500 transition-colors">
                  <span className="text-[#10b981]">3</span>
                </div>
              </div>
              <h3 className="text-xl text-gray-900 dark:text-white mb-3 transition-colors">Resolve</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">
                Authorities work on resolving the issue and update you on completion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-gray-900 dark:text-white mb-4 transition-colors">
              Report Various Issues
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors">
              We handle all types of civic concerns
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Road Issues", icon: "🛣️", color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/30", hoverShadow: "hover:shadow-blue-500/50" },
              { name: "Waste Management", icon: "♻️", color: "from-green-500 to-green-600", shadow: "shadow-green-500/30", hoverShadow: "hover:shadow-green-500/50" },
              { name: "Water Supply", icon: "💧", color: "from-cyan-500 to-cyan-600", shadow: "shadow-cyan-500/30", hoverShadow: "hover:shadow-cyan-500/50" },
              { name: "Public Safety", icon: "🚨", color: "from-red-500 to-red-600", shadow: "shadow-red-500/30", hoverShadow: "hover:shadow-red-500/50" },
            ].map((category) => (
              <div key={category.name} className={`bg-white dark:bg-white/10 dark:backdrop-blur-xl dark:border dark:border-white/20 rounded-2xl p-6 shadow-xl ${category.shadow} hover:shadow-2xl ${category.hoverShadow} transition-all hover:scale-105 hover:-translate-y-2 cursor-pointer`}>
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 text-3xl shadow-lg`}>
                  {category.icon}
                </div>
                <h3 className="text-lg text-gray-900 dark:text-white transition-colors">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl sm:text-4xl text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of citizens working together to improve our communities.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="bg-white text-[#2563eb] px-10 py-4 rounded-xl text-lg hover:bg-gray-50 transition-all shadow-2xl hover:shadow-white/30 hover:scale-105 hover:-translate-y-1"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2563eb] to-[#3b82f6] rounded-xl flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-xl">CL</span>
                </div>
                <h3 className="text-white text-xl">CivicLink</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Making civic engagement simple and effective for everyone.
              </p>
            </div>
            <div>
              <h4 className="text-white mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('report')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Report Issue
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('track')} className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Track Complaint
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Help Center
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                  <Mail className="w-4 h-4" />
                  support@civiclink.gov
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                  <Phone className="w-4 h-4" />
                  1-800-CIVIC-LINK
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 mt-12 pt-8 text-center text-sm transition-colors">
            <p>&copy; 2026 CivicLink. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}