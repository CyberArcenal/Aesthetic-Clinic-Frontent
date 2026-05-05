// src/api/dashboard.ts
import { apiClient } from "../../lib/fetcher";
import type { ApiResponse } from "./types";

export interface DashboardStatsDto {
  kpis: KpiCardsDto;
  dailyRevenue: DailyRevenueDto[];
  topServices: TopServicePerformanceDto[];
  appointmentFunnel: AppointmentFunnelDto;
  clientRetention: ClientRetentionDto;
  staffPerformance: StaffPerformanceDto[];
  forecast: ForecastDto;
}

export interface KpiCardsDto {
  revenueThisMonth: number;
  revenueLastMonth: number;
  revenueChangePercent: number;
  appointmentsThisMonth: number;
  appointmentsLastMonth: number;
  appointmentsChangePercent: number;
  newClientsThisMonth: number;
  newClientsLastMonth: number;
  newClientsChangePercent: number;
  averageTicket: number;
}

export interface DailyRevenueDto {
  date: string;
  revenue: number;
  appointments: number;
}

export interface TopServicePerformanceDto {
  serviceName?: string;
  category?: string;
  appointmentCount: number;
  revenue: number;
  percentageOfTotal: number;
}

export interface AppointmentFunnelDto {
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  completionRate: number;
  cancellationRate: number;
  noShowRate: number;
}

export interface ClientRetentionDto {
  totalClients: number;
  newClients30Days: number;
  returningClients30Days: number;
  retentionRate: number;
}

export interface StaffPerformanceDto {
  staffName?: string;
  completedAppointments: number;
  revenueGenerated: number;
  utilizationRate: number;
}

export interface ForecastDto {
  projectedRevenueNextWeek: number;
  projectedAppointmentsNextWeek: number;
  note?: string;
}

class DashboardAPI {
  private basePath = "/api/v1/dashboard";

  // GET /api/v1/dashboard/stats
  async getStats(): Promise<ApiResponse<DashboardStatsDto>> {
    const res = await apiClient.get<ApiResponse<DashboardStatsDto>>(`${this.basePath}/stats`);
    return res.data;
  }
}

const dashboardApi = new DashboardAPI();

export default dashboardApi;