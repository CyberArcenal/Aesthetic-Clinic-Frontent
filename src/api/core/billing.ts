// src/api/billing.ts
import { apiClient } from "../../lib/fetcher";
import type { ApiResponse, PaginatedResult } from "./types";

// ---------- Invoice DTOs ----------
export interface InvoiceResponseDto {
  id: number;
  clientId: number;
  clientName?: string;
  appointmentId?: number;
  invoiceNumber?: string;
  issueDate: string;
  dueDate?: string;
  subtotal: number;
  tax: number;
  total: number;
  status?: string;
  notes?: string;
  createdAt: string;
  amountPaid: number;
  balanceDue: number;
}

export interface CreateInvoiceDto {
  clientId: number;
  appointmentId?: number;
  issueDate: string;
  dueDate?: string;
  subtotal: number;
  tax?: number;
  notes?: string;
}

export interface UpdateInvoiceDto {
  issueDate?: string;
  dueDate?: string;
  subtotal?: number;
  tax?: number;
  notes?: string;
}

export interface UpdateInvoiceStatusDto {
  status: string;
}

// ---------- Payment DTOs ----------
export interface PaymentResponseDto {
  id: number;
  invoiceId: number;
  invoiceNumber?: string;
  amount: number;
  paymentDate: string;
  method?: string;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface CreatePaymentDto {
  invoiceId: number;
  amount: number;
  paymentDate: string;
  method: string;
  referenceNumber?: string;
  notes?: string;
}

// ---------- API methods ----------
class BillingAPI {
  // ----- Invoices -----
  private invoicesPath = "/api/v1/Invoices";

  async getInvoices(params?: {
    page?: number;
    pageSize?: number;
    clientId?: number;
    status?: string;
  }): Promise<ApiResponse<PaginatedResult<InvoiceResponseDto>>> {
    const res = await apiClient.get<ApiResponse<PaginatedResult<InvoiceResponseDto>>>(
      this.invoicesPath,
      { params }
    );
    return res.data;
  }

  async getInvoice(id: number): Promise<ApiResponse<InvoiceResponseDto>> {
    const res = await apiClient.get<ApiResponse<InvoiceResponseDto>>(`${this.invoicesPath}/${id}`);
    return res.data;
  }

  async createInvoice(data: CreateInvoiceDto): Promise<ApiResponse<InvoiceResponseDto>> {
    const res = await apiClient.post<ApiResponse<InvoiceResponseDto>>(this.invoicesPath, data);
    return res.data;
  }

  async updateInvoice(id: number, data: UpdateInvoiceDto): Promise<ApiResponse<InvoiceResponseDto>> {
    const res = await apiClient.put<ApiResponse<InvoiceResponseDto>>(`${this.invoicesPath}/${id}`, data);
    return res.data;
  }

  async deleteInvoice(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.delete<ApiResponse<boolean>>(`${this.invoicesPath}/${id}`);
    return res.data;
  }

  async updateInvoiceStatus(id: number, data: UpdateInvoiceStatusDto): Promise<ApiResponse<boolean>> {
    const res = await apiClient.patch<ApiResponse<boolean>>(`${this.invoicesPath}/${id}/status`, data);
    return res.data;
  }

  async getInvoicesByClient(clientId: number): Promise<ApiResponse<InvoiceResponseDto[]>> {
    const res = await apiClient.get<ApiResponse<InvoiceResponseDto[]>>(`${this.invoicesPath}/client/${clientId}`);
    return res.data;
  }

  // ----- Payments -----
  private paymentsPath = "/api/v1/Payments";

  async getPayments(params?: {
    page?: number;
    pageSize?: number;
    invoiceId?: number;
    method?: string;
  }): Promise<ApiResponse<PaginatedResult<PaymentResponseDto>>> {
    const res = await apiClient.get<ApiResponse<PaginatedResult<PaymentResponseDto>>>(
      this.paymentsPath,
      { params }
    );
    return res.data;
  }

  async getPayment(id: number): Promise<ApiResponse<PaymentResponseDto>> {
    const res = await apiClient.get<ApiResponse<PaymentResponseDto>>(`${this.paymentsPath}/${id}`);
    return res.data;
  }

  async createPayment(data: CreatePaymentDto): Promise<ApiResponse<PaymentResponseDto>> {
    const res = await apiClient.post<ApiResponse<PaymentResponseDto>>(this.paymentsPath, data);
    return res.data;
  }

  async deletePayment(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.delete<ApiResponse<boolean>>(`${this.paymentsPath}/${id}`);
    return res.data;
  }

  async getPaymentsByInvoice(invoiceId: number): Promise<ApiResponse<PaymentResponseDto[]>> {
    const res = await apiClient.get<ApiResponse<PaymentResponseDto[]>>(`${this.paymentsPath}/invoice/${invoiceId}`);
    return res.data;
  }
}

const billingApi = new BillingAPI();
export default billingApi;