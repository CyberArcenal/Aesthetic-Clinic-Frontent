import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ClientSidebar from "./ClientSidebar";
import TopBar from "./TopBar"; // can reuse same TopBar (it already reads authStore)

const ClientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (!mounted) return null;

  return (
    <div className="flex h-screen">
      <ClientSidebar isOpen={sidebarOpen} />
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

export default ClientLayout;