// components/layout/Sidebar.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  FileText,
  Camera,
  Bell,
  BarChart3,
  UserCog,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  CreditCard,
  ClipboardList,
  Activity,
  Mail,
  Phone,
  AlertCircle,
  FileBarChart,
  UserPlus,
  CalendarCheck,
  Receipt,
  Image,
  BellRing,
  ChartNoAxesCombined,
  Shield,
  Hospital,
  User,
} from "lucide-react";
import { version, name } from "../../package.json";
// import { useGeneralSettings } from "../../utils/configUtils/general";

interface SidebarProps {
  isOpen: boolean;
}

interface MenuItem {
  path: string;
  name: string;
  icon: React.ComponentType<any>;
  category?: string;
  children?: MenuItem[];
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const title = toTitleCase(name);
  const currency = "P";
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  );

  // Menu items for Aesthetic Clinic
  const menuItems: MenuItem[] = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      category: "core",
    },
    {
      path: "",
      name: "Client Management",
      icon: Users,
      category: "clients",
      children: [
        { path: "/clients", name: "All Clients", icon: Users },
        {
          path: "/clients/analysis",
          name: "Client Analytics",
          icon: ChartNoAxesCombined,
        },
      ],
    },
    {
      path: "",
      name: "Treatments",
      icon: Stethoscope,
      category: "treatments",
      children: [
        { path: "/treatments", name: "Service Catalog", icon: ClipboardList },
        { path: "/treatments/categories", name: "Categories", icon: Activity },
        { path: "/treatments/packages", name: "Packages", icon: Hospital },
      ],
    },
    {
      path: "",
      name: "Appointments",
      icon: CalendarDays,
      category: "appointments",
      children: [
        { path: "/appointments", name: "List View", icon: CalendarDays },
        {
          path: "/appointments/calendar",
          name: "Calendar View",
          icon: CalendarDays,
        },
        { path: "/appointments/history", name: "History", icon: FileText },
      ],
    },
    {
      path: "",
      name: "Billing",
      icon: CreditCard,
      category: "billing",
      children: [
        { path: "/invoices", name: "Invoices", icon: Receipt },
        { path: "/payments", name: "Payments", icon: CreditCard },
        {
          path: "/reports/revenue",
          name: "Revenue Reports",
          icon: FileBarChart,
        },
      ],
    },
    {
      path: "/photos",
      name: "Photo Gallery",
      icon: Camera,
      category: "photos",
    },
    {
      path: "",
      name: "Notifications",
      icon: Bell,
      category: "notifications",
      children: [
        // { path: "/notifications/inapp", name: "In-App", icon: BellRing },
        { path: "/notifications/templates", name: "Templates", icon: Mail },
        {
          path: "/notifications/logs",
          name: "Delivery Logs",
          icon: AlertCircle,
        },
      ],
    },
    {
      path: "/reports",
      name: "Reports",
      icon: BarChart3,
      category: "reports",
    },
    {
      path: "/staff",
      name: "Staff",
      icon: UserCog,
      category: "staff",
    },
    {
      path: "",
      name: "System",
      icon: Settings,
      category: "system",
      children: [
        { path: "/users", name: "Users", icon: Users },
        { path: "/audit", name: "Audit Trail", icon: Shield },
        { path: "/settings", name: "Settings", icon: Settings },
        { path: "/backup", name: "Backup", icon: Activity },
      ],
    },
  ];

  const toggleDropdown = (name: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const isActivePath = (path: string) => location.pathname === path;
  const isDropdownActive = (items: MenuItem[] = []) =>
    items.some((item) => isActivePath(item.path));

  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.children && isDropdownActive(item.children)) {
        setOpenDropdowns((prev) => ({ ...prev, [item.name]: true }));
      }
    });
  }, [location.pathname]);

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isActive = hasChildren
        ? isDropdownActive(item.children)
        : isActivePath(item.path);
      const isOpenDropdown = openDropdowns[item.name];

      return (
        <li key={item.path || item.name} className="mb-1 w-full">
          {hasChildren ? (
            <>
              <div
                onClick={() => toggleDropdown(item.name)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer w-full
                  ${
                    isActive
                      ? "bg-[var(--primary-color)] text-[var(--sidebar-text)] shadow-md"
                      : "text-[var(--sidebar-text)] hover:bg-[var(--primary-color)] hover:text-[var(--sidebar-text)]"
                  }
                  ${!isOpen ? "justify-center" : "justify-between"}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-[var(--sidebar-text)]"
                        : "text-[var(--sidebar-text)] group-hover:text-[var(--sidebar-text)]"
                    }`}
                  />
                  {isOpen && <span className="font-medium">{item.name}</span>}
                </div>
                {isOpen && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOpenDropdown ? "rotate-180" : ""
                    } ${
                      isActive
                        ? "text-[var(--sidebar-text)]"
                        : "text-[var(--sidebar-text)] group-hover:text-[var(--sidebar-text)]"
                    }`}
                  />
                )}
              </div>

              {/* Submenu */}
              <div
                className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                  isOpenDropdown ? "max-h-96" : "max-h-0"
                }`}
              >
                {isOpen ? (
                  <ul
                    className="ml-4 border-l-2 pl-3 mt-1 space-y-1"
                    style={{ borderColor: "var(--primary-color)" }}
                  >
                    {item.children?.map((child) => {
                      const isChildActive = isActivePath(child.path);
                      return (
                        <li key={child.path} className="w-full">
                          <Link
                            to={child.path}
                            className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm w-full
                              ${
                                isChildActive
                                  ? "text-[var(--sidebar-text)] bg-[var(--primary-color)]/20 font-semibold"
                                  : "text-[var(--sidebar-text)] hover:bg-[var(--primary-color)] hover:text-[var(--sidebar-text)]"
                              }
                            `}
                          >
                            <child.icon className="w-4 h-4" />
                            <span>{child.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  // Collapsed mode: centered icons
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--primary-color)]"></div>
                    <ul className="flex flex-col items-center space-y-1 mt-1">
                      {item.children?.map((child) => {
                        const isChildActive = isActivePath(child.path);
                        return (
                          <li key={child.path} className="w-full">
                            <Link
                              to={child.path}
                              className={`group flex items-center justify-center gap-3 px-3 py-2 ml-3 rounded-lg transition-all duration-200 text-sm w-[calc(100%-12px)]
                                ${
                                  isChildActive
                                    ? "text-[var(--sidebar-text)] bg-[var(--primary-color)]/20 font-semibold"
                                    : "text-[var(--sidebar-text)] hover:bg-[var(--primary-color)] hover:text-[var(--sidebar-text)]"
                                }
                              `}
                            >
                              <child.icon className="w-4 h-4" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to={item.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full
                ${
                  isActive
                    ? "bg-[var(--primary-color)] text-[var(--sidebar-text)] shadow-md"
                    : "text-[var(--sidebar-text)] hover:bg-[var(--primary-color)] hover:text-[var(--sidebar-text)]"
                }
                ${!isOpen ? "justify-center" : "justify-between"}
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={`w-5 h-5 ${
                    isActive
                      ? "text-[var(--sidebar-text)]"
                      : "text-[var(--sidebar-text)] group-hover:text-[var(--sidebar-text)]"
                  }`}
                />
                {isOpen && <span className="font-medium">{item.name}</span>}
              </div>
              {isOpen && (
                <ChevronRight
                  className={`w-4 h-4 transition-opacity duration-200 ${
                    isActive
                      ? "opacity-100 text-[var(--sidebar-text)]"
                      : "opacity-0 group-hover:opacity-50 text-[var(--sidebar-text)]"
                  }`}
                />
              )}
            </Link>
          )}
        </li>
      );
    });
  };

  const categories = [
    { id: "core", name: "Overview" },
    { id: "clients", name: "Clients" },
    { id: "treatments", name: "Treatments" },
    { id: "appointments", name: "Appointments" },
    { id: "billing", name: "Billing" },
    { id: "photos", name: "Media" },
    { id: "notifications", name: "Notifications" },
    { id: "staff", name: "Staff" },
    { id: "reports", name: "Reports" },
    { id: "system", name: "System" },
  ];

  return (
    <div
      className={`
        fixed md:relative inset-y-0 left-0
        bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]
        rounded-r-3xl shadow-xl
        transform transition-all duration-300 ease-in-out
        z-30 flex flex-col h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        md:${isOpen ? "w-64" : "w-20"}
      `}
    >
      {/* Header */}
      <div className="flex-shrink-0 border-b border-[var(--sidebar-border)] bg-[var(--card-bg)] p-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-[var(--primary-color)]">
            <Hospital className="w-6 h-6 text-white" />
          </div>
          {isOpen && (
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-[var(--sidebar-text)]">
                Aesthetic Clinic
              </h2>
              <p className="text-xs text-[var(--sidebar-text)] opacity-70">
                Management System
              </p>
              <p className="text-xs text-[var(--sidebar-text)] opacity-70">
                {currency}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto sidebar-scrollbar p-4">
        {categories.map((category) => {
          const categoryItems = menuItems.filter(
            (item) => item.category === category.id,
          );
          if (categoryItems.length === 0) return null;

          return (
            <div key={category.id} className="mb-6">
              {isOpen && (
                <h6 className="px-4 py-2 text-xs font-semibold text-[var(--sidebar-text)] uppercase tracking-wider">
                  {category.name}
                </h6>
              )}
              <ul className="space-y-1">{renderMenuItems(categoryItems)}</ul>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--sidebar-border)] text-center flex-shrink-0">
        {isOpen ? (
          <p className="text-xs text-[var(--sidebar-text)] opacity-70">
            v{version} • © {new Date().getFullYear()} Clinic
          </p>
        ) : (
          <p className="text-xs text-[var(--sidebar-text)] opacity-70">
            © {new Date().getFullYear()}
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
