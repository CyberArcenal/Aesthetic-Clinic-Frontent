// src/api/types.ts

// Standard API response wrapper from your backend
export interface ApiResponse<T> {
  success: boolean;
  message?: string | null;
  data: T;
  error?: string | null;
}

// Paginated result (used in list endpoints)
export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}