import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Forgot password", email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-[var(--card-bg)] rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Reset link sent</h2>
        <p className="text-[var(--text-secondary)] mt-2">
          If an account exists for {email}, you will receive a password reset link.
        </p>
        <Link to="/login" className="btn btn-secondary mt-4 inline-block">Back to Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-[var(--card-bg)] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-[var(--text-primary)]">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)]">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--input-bg)]"
            required
          />
        </div>
        <button type="submit" className="w-full btn btn-primary">Send Reset Link</button>
        <p className="text-center text-sm">
          <Link to="/login" className="text-[var(--primary-color)]">Back to Login</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;