// components/layout/TopBar.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  Search,
  User,
  LogOut,
  Settings,
  Users,
  CalendarDays,
  Stethoscope,
  ClipboardList,
} from "lucide-react";
import { NotificationDrawer } from "../components/Shared/NotificationDrawer";
import notificationApi from "../api/core/notification";
import { authStore, AuthStore } from "../stores/authStore";
import ProfileModal from "@/pages/profile";

interface TopBarProps {
  toggleSidebar: () => void;
}

interface SearchResult {
  id: number;
  name: string;
  type: "client" | "appointment" | "treatment";
  path: string;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const currentUser = authStore.getUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Load unread notification count
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        // Assuming your API returns { unread: number }
        if (currentUser?.id) {
          const stats = await notificationApi.getUserUnreadCount(
            currentUser?.id,
          );
          setUnreadCount(stats.data || 0);
        }
      } catch (error) {
        // silent fail
      }
    };
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search logic (client‑side for now) – can be replaced with API call later
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    // This is a placeholder – replace with actual API search if needed
    // For demo: search clients, appointments, treatments from local store or fake data
    const fakeResults: SearchResult[] = [
      // These would come from real API in production
    ];
    setSearchResults(fakeResults);
    setShowSearchResults(true);
  }, [searchQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // TODO: implement API search for clients, appointments, treatments
    // For now, if there are results, navigate to the first one
    if (searchResults.length > 0) {
      navigate(searchResults[0].path);
      setSearchQuery("");
      setShowSearchResults(false);
    } else {
      // Optionally show "no results" toast
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    navigate(result.path);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleLogout = async () => {
    await authStore.logout();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "client":
        return Users;
      case "appointment":
        return CalendarDays;
      case "treatment":
        return Stethoscope;
      default:
        return ClipboardList;
    }
  };

  return (
    <>
      <header className="bg-[var(--sidebar-bg)] border-b border-[var(--border-color)] sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left side: mobile menu + search */}
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="p-2 rounded-lg hover:bg-[var(--card-secondary-bg)] text-[var(--sidebar-text)] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search bar (desktop only – always visible) */}
            <div className="relative flex-1 max-w-md" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-[var(--text-secondary)]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search clients, appointments, treatments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSearchResults(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSearchResults(false), 200)
                    }
                    className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--border-color)] rounded-lg bg-[var(--card-secondary-bg)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  />
                </div>
              </form>

              {/* Search results dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                  {searchResults.map((result) => {
                    const Icon = getResultIcon(result.type);
                    return (
                      <div
                        key={`${result.type}-${result.id}`}
                        className="px-4 py-3 cursor-pointer hover:bg-[var(--card-secondary-bg)] transition-colors border-b border-[var(--border-color)] last:border-b-0"
                        onMouseDown={() => handleSelectResult(result)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[var(--primary-color)]/10 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-[var(--primary-color)]" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-[var(--text-primary)]">
                              {result.name}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)] mt-0.5 capitalize">
                              {result.type}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* No results message */}
              {showSearchResults &&
                searchQuery.trim() &&
                searchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-lg shadow-lg p-4 text-center text-[var(--text-secondary)] text-sm">
                    No results found for "{searchQuery}"
                  </div>
                )}
            </div>
          </div>

          {/* Right side: notifications + user menu */}
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 rounded-lg hover:bg-[var(--card-secondary-bg)] text-[var(--sidebar-text)] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-[var(--danger-color)] text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* User avatar / dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--card-secondary-bg)] transition-colors"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--primary-color)]/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-[var(--primary-color)]" />
                </div>
                <span className="hidden md:inline text-sm font-medium text-[var(--text-primary)]">
                  {currentUser?.fullName || currentUser?.username || "User"}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--card-secondary-bg)] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--card-secondary-bg)] transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <hr className="my-1 border-[var(--border-color)]" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--danger-color)] hover:bg-[var(--danger-color)]/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onUnreadCountChange={(count) => setUnreadCount(count)}
      />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  );
};

export default TopBar;
