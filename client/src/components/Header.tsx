import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  isAdmin?: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void | Promise<void>;
}

export function Header({ currentPage, onNavigate, isLoggedIn, isAdmin = false, isDarkMode, onToggleTheme, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700/50 sticky top-0 z-50 shadow-sm dark:shadow-gray-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate('landing')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#2563eb] to-[#3b82f6] rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all group-hover:scale-105">
              <span className="text-white font-bold text-xl">CL</span>
            </div>
            <h1 className="text-2xl text-[#1e40af] dark:text-blue-400 tracking-tight group-hover:text-[#2563eb] dark:group-hover:text-blue-300 transition-colors">CivicLink</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentPage === 'landing' 
                  ? 'bg-blue-50 dark:bg-blue-500/20 dark:backdrop-blur-xl text-[#2563eb] dark:text-blue-400 dark:border dark:border-blue-400/30' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-[#2563eb] dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-white/10 dark:hover:backdrop-blur-xl'
              }`}
            >
              Home
            </button>
            
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => onNavigate(isAdmin ? 'admin' : 'dashboard')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPage === 'dashboard' || currentPage === 'admin'
                      ? 'bg-blue-50 dark:bg-blue-500/20 dark:backdrop-blur-xl text-[#2563eb] dark:text-blue-400 dark:border dark:border-blue-400/30' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#2563eb] dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-white/10 dark:hover:backdrop-blur-xl'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => onNavigate('report')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPage === 'report' 
                      ? 'bg-blue-50 dark:bg-blue-500/20 dark:backdrop-blur-xl text-[#2563eb] dark:text-blue-400 dark:border dark:border-blue-400/30' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#2563eb] dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-white/10 dark:hover:backdrop-blur-xl'
                  }`}
                >
                  Report Issue
                </button>
                <button
                  onClick={() => onNavigate('track')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPage === 'track' 
                      ? 'bg-blue-50 dark:bg-blue-500/20 dark:backdrop-blur-xl text-[#2563eb] dark:text-blue-400 dark:border dark:border-blue-400/30' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#2563eb] dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-white/10 dark:hover:backdrop-blur-xl'
                  }`}
                >
                  Track Complaint
                </button>
                <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#2563eb] dark:hover:text-blue-400 transition-all hover:bg-gray-50 dark:hover:bg-white/10 dark:hover:backdrop-blur-xl rounded-lg ml-2">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                  }}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/20 dark:hover:backdrop-blur-xl ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white px-6 py-2 rounded-lg hover:from-[#1d4ed8] hover:to-[#2563eb] transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 ml-4"
              >
                Login
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 dark:hover:backdrop-blur-xl rounded-lg transition-all ml-2"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 dark:hover:backdrop-blur-xl rounded-lg transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700/50 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  onNavigate('landing');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-3 rounded-lg transition-all ${
                  currentPage === 'landing' 
                    ? 'bg-blue-50 dark:bg-blue-500/20 dark:backdrop-blur-xl text-[#2563eb] dark:text-blue-400 dark:border dark:border-blue-400/30' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 dark:hover:backdrop-blur-xl'
                }`}
              >
                Home
              </button>
              
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      onNavigate(isAdmin ? 'admin' : 'dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-4 py-3 rounded-lg transition-all ${
                      currentPage === 'dashboard' || currentPage === 'admin'
                        ? 'bg-blue-50 dark:bg-blue-500/20 dark:backdrop-blur-xl text-[#2563eb] dark:text-blue-400 dark:border dark:border-blue-400/30' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 dark:hover:backdrop-blur-xl'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('report');
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-4 py-3 rounded-lg transition-all ${
                      currentPage === 'report' 
                        ? 'bg-blue-50 dark:bg-blue-500/20 dark:backdrop-blur-xl text-[#2563eb] dark:text-blue-400 dark:border dark:border-blue-400/30' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 dark:hover:backdrop-blur-xl'
                    }`}
                  >
                    Report Issue
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('track');
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-4 py-3 rounded-lg transition-all ${
                      currentPage === 'track' 
                        ? 'bg-blue-50 dark:bg-blue-500/20 dark:backdrop-blur-xl text-[#2563eb] dark:text-blue-400 dark:border dark:border-blue-400/30' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 dark:hover:backdrop-blur-xl'
                    }`}
                  >
                    Track Complaint
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 dark:hover:backdrop-blur-xl transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-lg bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white transition-all"
                >
                  Login
                </button>
              )}

              {/* Theme Toggle Mobile */}
              <button
                onClick={onToggleTheme}
                className="text-left px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 dark:hover:backdrop-blur-xl transition-all flex items-center gap-2"
              >
                {isDarkMode ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Light Mode
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    Dark Mode
                  </>
                )}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}