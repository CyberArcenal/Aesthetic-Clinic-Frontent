// src/pages/DashboardPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  CalendarDays,
  Stethoscope,
  DollarSign,
  TrendingUp,
  Eye,
  Plus,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  CalendarCheck,
  UserPlus,
  CreditCard,
  FileText,
  Bell,
  BarChart3,
} from "lucide-react";
import type { DashboardStatsDto } from "../../api/core/dashboard";
import { formatCurrency, formatPercentage } from "../../utils/formatters";
import dashboardApi from "../../api/core/dashboard";

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.getStats();
      if (res.success) {
        setStats(res.data);
      } else {
        setError(res.message || "Failed to load dashboard data");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Helper to get growth color
  const getGrowthColor = (value: number) => {
    if (value > 0) return "var(--success-color)";
    if (value < 0) return "var(--danger-color)";
    return "var(--text-secondary)";
  };

  // Quick actions
  const quickActions = [
    {
      label: "New Appointment",
      path: "/appointments/book",
      icon: CalendarCheck,
      color: "blue",
    },
    {
      label: "Add Client",
      path: "/clients/new",
      icon: UserPlus,
      color: "green",
    },
    {
      label: "View Treatments",
      path: "/treatments",
      icon: Stethoscope,
      color: "purple",
    },
    {
      label: "Record Payment",
      path: "/payments",
      icon: CreditCard,
      color: "orange",
    },
  ];

  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
    orange: { bg: "bg-orange-100", text: "text-orange-600" },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-3"
            style={{ borderColor: "var(--primary-color)" }}
          ></div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6" style={{ color: "var(--danger-color)" }}>
        <AlertCircle className="w-12 h-12 mx-auto mb-3" />
        <p className="text-base font-semibold mb-1">Error Loading Dashboard</p>
        <p className="text-sm mb-3">{error}</p>
        <button onClick={fetchStats} className="btn btn-primary btn-sm">
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const { kpis, topServices, appointmentFunnel } = stats;
  const hasGrowth = kpis.revenueChangePercent !== 0;

  return (
    <div className="space-y-4 transition-all duration-300">
      {/* Page Header */}
      <div
        className="compact-card rounded-lg p-4 flex justify-between items-center"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div>
          <h2
            className="text-lg font-semibold flex items-center gap-1.5"
            style={{ color: "var(--sidebar-text)" }}
          >
            <div className="w-1.5 h-5 rounded-full bg-[var(--primary-color)]"></div>
            Clinic Dashboard
          </h2>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Real‑time clinic insights
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn btn-secondary btn-sm flex items-center gap-1"
        >
          <RefreshCw
            className={`icon-sm ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const colors = colorMap[action.color];
          return (
            <Link
              key={action.label}
              to={action.path}
              className="compact-card rounded-lg p-3 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-md"
              style={{ background: colors.bg, border: "1px solid transparent" }}
            >
              <Icon
                className="icon-lg mb-1"
                style={{ color: `var(--${action.color}-600)` }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: `var(--${action.color}-700)` }}
              >
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          title="Revenue This Month"
          value={formatCurrency(kpis.revenueThisMonth)}
          change={kpis.revenueChangePercent}
          icon={DollarSign}
          color={getGrowthColor(kpis.revenueChangePercent)}
          onClick={() => navigate("/invoices")}
        />
        <KpiCard
          title="Appointments This Month"
          value={kpis.appointmentsThisMonth}
          change={kpis.appointmentsChangePercent}
          icon={CalendarDays}
          color={getGrowthColor(kpis.appointmentsChangePercent)}
          onClick={() => navigate("/appointments")}
        />
        <KpiCard
          title="New Clients"
          value={kpis.newClientsThisMonth}
          change={kpis.newClientsChangePercent}
          icon={Users}
          color={getGrowthColor(kpis.newClientsChangePercent)}
          onClick={() => navigate("/clients")}
        />
        <KpiCard
          title="Average Ticket"
          value={formatCurrency(kpis.averageTicket)}
          change={0}
          icon={TrendingUp}
          color="var(--text-secondary)"
          onClick={() => navigate("/invoices")}
        />
      </div>

      {/* Main Content: Top Services & Appointment Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Services */}
        <div
          className="compact-card rounded-lg p-4"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-base flex items-center gap-1.5">
              <Stethoscope className="icon-sm text-[var(--primary-color)]" />
              Top Services
            </h3>
            <Link
              to="/treatments"
              className="text-xs text-[var(--primary-color)] hover:underline flex items-center"
            >
              View all <Eye className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {topServices.slice(0, 5).map((service, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-medium w-5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {idx + 1}.
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "var(--sidebar-text)" }}
                  >
                    {service.serviceName}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--card-secondary-bg)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {service.category}
                  </span>
                </div>
                <div className="text-right">
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "var(--success-color)" }}
                  >
                    {service.appointmentCount} bookings
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {formatCurrency(service.revenue)}
                  </div>
                </div>
              </div>
            ))}
            {topServices.length === 0 && (
              <p
                className="text-sm text-center"
                style={{ color: "var(--text-secondary)" }}
              >
                No service data available
              </p>
            )}
          </div>
        </div>

        {/* Appointment Funnel */}
        <div
          className="compact-card rounded-lg p-4"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-base flex items-center gap-1.5">
              <CalendarCheck className="icon-sm text-[var(--primary-color)]" />
              Appointment Funnel
            </h3>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "var(--success-color)10",
                color: "var(--success-color)",
              }}
            >
              Completion: {formatPercentage(appointmentFunnel.completionRate)}
            </span>
          </div>
          <div className="space-y-3">
            {[
              {
                label: "Scheduled",
                value: appointmentFunnel.scheduled,
                color: "var(--accent-blue)",
              },
              {
                label: "Confirmed",
                value: appointmentFunnel.confirmed,
                color: "var(--accent-green)",
              },
              {
                label: "Completed",
                value: appointmentFunnel.completed,
                color: "var(--accent-emerald)",
              },
              {
                label: "Cancelled",
                value: appointmentFunnel.cancelled,
                color: "var(--accent-red)",
              },
              {
                label: "No-Show",
                value: appointmentFunnel.noShow,
                color: "var(--accent-orange)",
              },
            ].map((stage) => (
              <div
                key={stage.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: stage.color }}
                  ></div>
                  <span
                    className="text-sm"
                    style={{ color: "var(--sidebar-text)" }}
                  >
                    {stage.label}
                  </span>
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: stage.color }}
                >
                  {stage.value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--border-color)] flex justify-between text-xs">
            <span style={{ color: "var(--text-secondary)" }}>
              Cancellation rate:{" "}
              {formatPercentage(appointmentFunnel.cancellationRate)}
            </span>
            <span style={{ color: "var(--text-secondary)" }}>
              No‑show rate: {formatPercentage(appointmentFunnel.noShowRate)}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Metrics (could be extended with daily revenue chart etc.) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MetricCard
          title="Total Clients"
          value={
            kpis.newClientsThisMonth +
            (stats.clientRetention?.totalClients || 0)
          } // not directly in kpis, but we can show active clients
          subtitle="Active clients"
          icon={Users}
          onClick={() => navigate("/clients")}
        />
        <MetricCard
          title="Total Revenue (All time)"
          value={formatCurrency(stats.kpis.revenueThisMonth)} // placeholder, total not provided; can be extended
          subtitle="This month only"
          icon={DollarSign}
          onClick={() => navigate("/invoices")}
        />
        <MetricCard
          title="Staff Performance"
          value={stats.staffPerformance?.length || 0}
          subtitle="Top performers"
          icon={Users}
          onClick={() => navigate("/staff")}
        />
      </div>
    </div>
  );
};

// Sub-components
interface KpiCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
  onClick?: () => void;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  onClick,
}) => {
  const isPositive = change > 0;
  return (
    <div
      className="compact-card rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
      style={{
        background: "var(--card-secondary-bg)",
        border: "1px solid var(--border-color)",
      }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className="p-2 rounded-lg"
          style={{ background: "var(--card-bg)" }}
        >
          <Icon className="icon-sm" style={{ color }} />
        </div>
        {change !== 0 && (
          <div
            className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded-full ${isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
          >
            {isPositive ? (
              <ArrowUp className="icon-xs mr-0.5" />
            ) : (
              <ArrowDown className="icon-xs mr-0.5" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div
        className="text-xl font-bold"
        style={{ color: "var(--sidebar-text)" }}
      >
        {value}
      </div>
      <div
        className="text-xs mt-0.5"
        style={{ color: "var(--text-secondary)" }}
      >
        {title}
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  onClick,
}) => (
  <div
    className="compact-card rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
    style={{
      background: "var(--card-secondary-bg)",
      border: "1px solid var(--border-color)",
    }}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg" style={{ background: "var(--card-bg)" }}>
        <Icon className="icon-sm text-[var(--primary-color)]" />
      </div>
      <div>
        <div
          className="text-lg font-bold"
          style={{ color: "var(--sidebar-text)" }}
        >
          {value}
        </div>
        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
          {title}
        </div>
        <div className="text-xs mt-0.5 opacity-70">{subtitle}</div>
      </div>
    </div>
  </div>
);

export default DashboardPage;
