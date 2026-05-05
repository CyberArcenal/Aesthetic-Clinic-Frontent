// src/api/category.ts (mock)
import treatmentApi from "./treatment";
import type { ApiResponse, PaginatedResult } from "./types";

export interface CategoryDto {
  id: string; // use category name as ID for simplicity
  name: string;
  count: number;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name: string;
}

class CategoryAPI {
  // Helper to refresh categories from treatments
  private async fetchCategoriesFromTreatments(): Promise<CategoryDto[]> {
    const res = await treatmentApi.getTreatments({ page: 1, pageSize: 1000 });
    if (!res.success) throw new Error(res.message as string);
    const treatments = res.data.items;
    const map = new Map<string, number>();
    treatments.forEach((t) => {
      if (t.category) {
        map.set(t.category, (map.get(t.category) || 0) + 1);
      }
    });
    const categories = Array.from(map.entries()).map(([name, count]) => ({
      id: name,
      name,
      count,
    }));
    return categories.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getCategories(params?: { page?: number; pageSize?: number; search?: string }): Promise<ApiResponse<PaginatedResult<CategoryDto>>> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let items = await this.fetchCategoriesFromTreatments();
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      items = items.filter((c) => c.name.toLowerCase().includes(searchLower));
    }
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const totalCount = items.length;
    const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);
    return {
      success: true,
      data: {
        items: paginatedItems,
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasPrevious: page > 1,
        hasNext: page < Math.ceil(totalCount / pageSize),
      },
    };
  }

  async createCategory(data: CreateCategoryDto): Promise<ApiResponse<CategoryDto>> {
    // Just create a new category by updating no treatments? Actually category creation is just a name; we don't need to create anything.
    // But we must ensure it doesn't conflict with existing.
    const categories = await this.fetchCategoriesFromTreatments();
    if (categories.some((c) => c.name === data.name)) {
      return { success: false, message: "Category already exists", data: null as any };
    }
    // Return the new category (count 0)
    return {
      success: true,
      data: { id: data.name, name: data.name, count: 0 },
    };
  }

  async updateCategory(oldName: string, data: UpdateCategoryDto): Promise<ApiResponse<CategoryDto>> {
    // Rename category: update all treatments with oldName to newName
    const treatmentsRes = await treatmentApi.getTreatments({ page: 1, pageSize: 1000 });
    if (!treatmentsRes.success) return { success: false, message: treatmentsRes.message, data: null as any };
    const treatmentsToUpdate = treatmentsRes.data.items.filter((t) => t.category === oldName);
    for (const t of treatmentsToUpdate) {
      await treatmentApi.updateTreatment(t.id, { category: data.name });
    }
    return {
      success: true,
      data: { id: data.name, name: data.name, count: treatmentsToUpdate.length },
    };
  }

  async deleteCategory(name: string): Promise<ApiResponse<boolean>> {
    // Set category to null for all treatments with this category
    const treatmentsRes = await treatmentApi.getTreatments({ page: 1, pageSize: 1000 });
    if (!treatmentsRes.success) return { success: false, message: treatmentsRes.message, data: false };
    const treatmentsToUpdate = treatmentsRes.data.items.filter((t) => t.category === name);
    for (const t of treatmentsToUpdate) {
      await treatmentApi.updateTreatment(t.id, { category: undefined });
    }
    return { success: true, data: true };
  }

  async getCategory(name: string): Promise<ApiResponse<CategoryDto>> {
    const categories = await this.fetchCategoriesFromTreatments();
    const cat = categories.find((c) => c.name === name);
    if (!cat) return { success: false, message: "Category not found", data: null as any };
    return { success: true, data: cat };
  }
}

const categoryApi = new CategoryAPI();
export default categoryApi;