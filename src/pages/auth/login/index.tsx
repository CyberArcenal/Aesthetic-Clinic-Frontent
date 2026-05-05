// src/pages/auth/LoginPage.tsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Hospital, Mail, Lock, Eye, EyeOff } from "lucide-react";
import {
  hideLoading,
  showLoading,
  showToast,
  // showToast,
} from "../../../utils/notification";
import { authStore } from "../../../stores/authStore";
import { dialogs } from "../../../utils/dialogs";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError("Please fill in all fields");
      showToast("Please fill in all fields", "warning");
      return;
    }

    setLoading(true);
    setError("");
    showLoading("Signing in...");

    try {
      const success = await authStore.login(identifier, password);
      if (success) {
        showToast("Login successful! Redirecting...", "success");
        const user = authStore.getUser();
        let redirectPath = "/dashboard";
        if (user?.roles?.includes("Admin") || user?.roles?.includes("Staff")) {
          redirectPath = "/dashboard";
        } else if (user?.roles?.includes("Client")) {
          redirectPath = "/client/dashboard";
        } else {
          redirectPath = "/";
        }
        setTimeout(() => {
          navigate(redirectPath);
        }, 500);
      } else {
        const errorMsg = "Invalid credentials. Please try again.";
        setError(errorMsg);
      }
    } catch (err: any) {
      const msg = err.message || "Login failed. Please try again later.";
      setError(msg);
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[var(--background-color)] px-4"
      style={{
        backgroundImage: "url('./public/clinic-bg.png')",
        backgroundSize: "cover",
      }}
    >
      <div className="max-w-md w-full space-y-8 p-8 bg-[var(--card-bg)] rounded-2xl shadow-lg border border-[var(--border-color)]">
        {/* Logo / Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[var(--primary-color)] rounded-full flex items-center justify-center">
              <Hospital className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Welcome Back
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="p-3 text-sm text-center bg-[var(--danger-color)]/10 text-[var(--danger-color)] rounded-lg border border-[var(--danger-color)]/30">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Email/Username Input */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-1"
              >
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-4 h-4 text-[var(--text-secondary)]" />
                </div>
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  placeholder="name@example.com"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-4 h-4 text-[var(--text-secondary)]" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-[var(--primary-color)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-[var(--text-secondary)]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[var(--primary-color)] hover:underline font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
