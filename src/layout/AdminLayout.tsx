import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // your existing Sidebar component
import TopBar from "./TopBar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (!mounted) return null;

  return (
    <div className="flex h-screen">
      <AdminSidebar isOpen={sidebarOpen} />
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={toggleSidebar} />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-2 bg-[var(--background-color)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;