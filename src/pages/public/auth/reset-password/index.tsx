import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [resetDone, setResetDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }
    console.log("Reset password", { token, password });
    setResetDone(true);
  };

  if (resetDone) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-[var(--card-bg)] rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Password Reset Successful</h2>
        <p className="text-[var(--text-secondary)] mt-2">You can now log in with your new password.</p>
        <Link to="/login" className="btn btn-primary mt-4 inline-block">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-[var(--card-bg)] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-[var(--text-primary)]">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)]">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--input-bg)]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)]">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--input-bg)]"
            required
          />
        </div>
        <button type="submit" className="w-full btn btn-primary">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;