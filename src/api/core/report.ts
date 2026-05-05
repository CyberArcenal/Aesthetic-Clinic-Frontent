// src/api/report.ts
import { apiClient } from "../../lib/fetcher";
import type { ApiResponse, PaginatedResult } from "./types";

// ---------- DTOs ----------
export interface ReportLogResponseDto {
  id: number;
  reportName?: string;
  parameters?: string;      // JSON string of filters
  generatedById?: number;
  generatedByName?: string;
  insights?: string;        // AI-generated summary
  generatedAt: string;
  createdAt: string;
}

export interface GenerateReportDto {
  reportName: string;
  parameters?: string;      // optional JSON string
}

// ---------- API methods ----------
class ReportAPI {
  private basePath = "/api/v1/reports";

  // GET /api/v1/reports?page=1&pageSize=10&reportName=...&fromDate=...&toDate=...
  async getReports(params?: {
    page?: number;
    pageSize?: number;
    reportName?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<ApiResponse<PaginatedResult<ReportLogResponseDto>>> {
    const res = await apiClient.get<ApiResponse<PaginatedResult<ReportLogResponseDto>>>(
      this.basePath,
      { params }
    );
    return res.data;
  }

  // GET /api/v1/reports/{id}
  async getReport(id: number): Promise<ApiResponse<ReportLogResponseDto>> {
    const res = await apiClient.get<ApiResponse<ReportLogResponseDto>>(`${this.basePath}/${id}`);
    return res.data;
  }

  // DELETE /api/v1/reports/{id}
  async deleteReport(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.delete<ApiResponse<boolean>>(`${this.basePath}/${id}`);
    return res.data;
  }

  // POST /api/v1/reports/generate
  async generateReport(data: GenerateReportDto): Promise<ApiResponse<ReportLogResponseDto>> {
    const res = await apiClient.post<ApiResponse<ReportLogResponseDto>>(`${this.basePath}/generate`, data);
    return res.data;
  }

  // POST /api/v1/reports/trigger-weekly-report (admin only)
  async triggerWeeklyReport(): Promise<void> {
    // This endpoint returns 200 without a body; no need to parse response.
    await apiClient.post(`${this.basePath}/trigger-weekly-report`);
  }
}
const reportApi = new ReportAPI();
export default reportApi;