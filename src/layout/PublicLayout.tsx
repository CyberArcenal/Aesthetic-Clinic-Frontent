import { Outlet, Link } from "react-router-dom";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Bar (contact info) */}
      <div className="bg-[var(--primary-color)] text-white text-sm py-2 px-4 hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><Phone size={14} /> +63 2 1234 5678</span>
            <span className="flex items-center gap-1"><Mail size={14} /> info@aestheticclinic.com</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="hover:underline">Staff Login</Link>
            <Link to="/register" className="hover:underline">Client Portal</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[var(--primary-color)] flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="font-bold text-xl text-[var(--primary-color)] hidden sm:inline">Aesthetic Clinic</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
            <Link to="/" className="hover:text-[var(--primary-color)]">Home</Link>
            <Link to="/treatments" className="hover:text-[var(--primary-color)]">Treatments</Link>
            <Link to="/contact" className="hover:text-[var(--primary-color)]">Contact</Link>
          </nav>

          <div className="flex gap-2">
            <Link to="/register" className="btn btn-primary btn-sm hidden sm:inline-flex">Book Now</Link>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-3 px-4 flex flex-col gap-3">
            <Link to="/" className="py-2 hover:text-[var(--primary-color)]" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/treatments" className="py-2 hover:text-[var(--primary-color)]" onClick={() => setMobileMenuOpen(false)}>Treatments</Link>
            <Link to="/contact" className="py-2 hover:text-[var(--primary-color)]" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Link to="/login" className="btn btn-secondary btn-sm flex-1 text-center">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm flex-1 text-center">Register</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h3 className="font-bold text-white mb-3">Aesthetic Clinic</h3>
            <p>Premium aesthetic treatments & wellness.</p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Quick Links</h3>
            <ul className="space-y-1">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/treatments" className="hover:text-white">Treatments</Link></li>
              <li><Link to="/register" className="hover:text-white">Book Appointment</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Contact</h3>
            <ul className="space-y-1">
              <li className="flex items-center gap-2"><Phone size={14} /> +63 2 1234 5678</li>
              <li className="flex items-center gap-2"><Mail size={14} /> info@aestheticclinic.com</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Makati City, PH</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Hours</h3>
            <p>Mon-Fri: 9AM – 6PM</p>
            <p>Sat: 10AM – 4PM</p>
            <p>Sun: Closed</p>
          </div>
        </div>
        <div className="container mx-auto text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-800">
          © {new Date().getFullYear()} Aesthetic Clinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;