import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  CreditCard,
  Camera,
  Bell,
  User,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Hospital,
} from "lucide-react";
import { authStore } from "../stores/authStore";

interface ClientSidebarProps {
  isOpen: boolean;
}

const ClientSidebar: React.FC<ClientSidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const currency = "PHP";
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const menuItems = [
    { path: "/client/dashboard", name: "Dashboard", icon: LayoutDashboard },
    { path: "/client/appointments", name: "My Appointments", icon: CalendarDays },
    { path: "/client/invoices", name: "My Invoices", icon: CreditCard },
    { path: "/client/photos", name: "Photo Gallery", icon: Camera },
    { path: "/client/notifications", name: "Notifications", icon: Bell },
    { path: "/client/profile", name: "Profile", icon: User },
    { path: "/client/settings", name: "Settings", icon: Settings },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await authStore.logout();
    window.location.href = "/login";
  };

  return (
    <div
      className={`fixed md:relative inset-y-0 left-0 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] rounded-r-3xl shadow-xl transition-all duration-300 z-30 flex flex-col h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:${isOpen ? "w-64" : "w-20"}`}
    >
      <div className="flex-shrink-0 border-b border-[var(--sidebar-border)] p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--primary-color)] flex items-center justify-center">
            <Hospital className="w-6 h-6 text-white" />
          </div>
          {isOpen && (
            <div>
              <h2 className="text-lg font-bold text-[var(--sidebar-text)]">Client Portal</h2>
              <p className="text-xs text-[var(--sidebar-text)] opacity-70">{currency}</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = isActivePath(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full
                    ${isActive ? "bg-[var(--primary-color)] text-[var(--sidebar-text)] shadow-md" : "text-[var(--sidebar-text)] hover:bg-[var(--primary-color)] hover:text-[var(--sidebar-text)]"}
                    ${!isOpen ? "justify-center" : "justify-between"}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {isOpen && <span className="font-medium">{item.name}</span>}
                  </div>
                  {isOpen && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[var(--sidebar-border)]">
        <button
          onClick={handleLogout}
          className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-[var(--sidebar-text)] hover:bg-[var(--danger-color)] hover:text-white
            ${!isOpen ? "justify-center" : "justify-between"}`}
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            {isOpen && <span className="font-medium">Logout</span>}
          </div>
        </button>
        {isOpen && (
          <p className="text-xs text-center mt-4 text-[var(--sidebar-text)] opacity-70">
            © {new Date().getFullYear()} Clinic
          </p>
        )}
      </div>
    </div>
  );
};

export default ClientSidebar;