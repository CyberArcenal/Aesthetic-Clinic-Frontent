import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--background-color)]">
      {/* Simple header (logo, nav links) – can be extended later */}
      <header className="bg-[var(--card-bg)] border-b border-[var(--border-color)] py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-[var(--primary-color)]">Aesthetic Clinic</h1>
          <nav className="space-x-4">
            <a href="/" className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]">Home</a>
            <a href="/login" className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]">Login</a>
            <a href="/register" className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]">Register</a>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
      <footer className="bg-[var(--card-bg)] border-t border-[var(--border-color)] py-4 text-center text-sm text-[var(--text-secondary)]">
        © {new Date().getFullYear()} Aesthetic Clinic Management System
      </footer>
    </div>
  );
};

export default PublicLayout;