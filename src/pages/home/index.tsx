import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-[var(--primary-color)] mb-4">
        Aesthetic Clinic Management
      </h1>
      <p className="text-[var(--text-secondary)] mb-8">
        Welcome to the clinic management system.
      </p>
      <div className="space-x-4">
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
        <Link to="/register" className="btn btn-secondary">
          Register
        </Link>
      </div>
    </div>
  );
};

export default HomePage;