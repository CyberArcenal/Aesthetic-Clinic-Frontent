// src/api/package.ts (mock – replace with real API later)
import type { ApiResponse, PaginatedResult } from "./types";

export interface PackageDto {
  id: number;
  name: string;
  description?: string;
  treatments: { id: number; name: string }[];
  totalPrice: number;
  discountedPrice: number;
  savings: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreatePackageDto {
  name: string;
  description?: string;
  treatmentIds: number[];
  discountedPrice: number;
}

export interface UpdatePackageDto extends Partial<CreatePackageDto> {}

// Mock data
let mockPackages: PackageDto[] = [
  {
    id: 1,
    name: "Glow Up Package",
    description: "HydraFacial + Dermaplaning",
    treatments: [
      { id: 1, name: "HydraFacial" },
      { id: 2, name: "Dermaplaning" },
    ],
    totalPrice: 6500,
    discountedPrice: 5500,
    savings: 1000,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Botox + Fillers",
    description: "2 areas of Botox + 1 syringe of filler",
    treatments: [
      { id: 3, name: "Botox" },
      { id: 4, name: "Fillers" },
    ],
    totalPrice: 15000,
    discountedPrice: 12500,
    savings: 2500,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

let nextId = 3;

class PackageAPI {
  async getPackages(params?: { page?: number; pageSize?: number; search?: string }): Promise<ApiResponse<PaginatedResult<PackageDto>>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let items = [...mockPackages];
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      items = items.filter((p) => p.name.toLowerCase().includes(searchLower));
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

  async getPackage(id: number): Promise<ApiResponse<PackageDto>> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const pkg = mockPackages.find((p) => p.id === id);
    if (!pkg) return { success: false, message: "Package not found", data: null as any };
    return { success: true, data: pkg };
  }

  async createPackage(data: CreatePackageDto): Promise<ApiResponse<PackageDto>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const treatmentNames = data.treatmentIds.map((id) => ({ id, name: `Treatment ${id}` })); // mock
    const totalPrice = data.treatmentIds.length * 1000; // mock calculation
    const newPackage: PackageDto = {
      id: nextId++,
      name: data.name,
      description: data.description,
      treatments: treatmentNames,
      totalPrice,
      discountedPrice: data.discountedPrice,
      savings: totalPrice - data.discountedPrice,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    mockPackages.push(newPackage);
    return { success: true, data: newPackage };
  }

  async updatePackage(id: number, data: UpdatePackageDto): Promise<ApiResponse<PackageDto>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockPackages.findIndex((p) => p.id === id);
    if (index === -1) return { success: false, message: "Package not found", data: null as any };
    const existing = mockPackages[index];
    const updated = { ...existing, ...data };
    if (data.treatmentIds) {
      updated.treatments = data.treatmentIds.map((tid) => ({ id: tid, name: `Treatment ${tid}` }));
      updated.totalPrice = data.treatmentIds.length * 1000;
      updated.savings = updated.totalPrice - updated.discountedPrice;
    }
    mockPackages[index] = updated;
    return { success: true, data: updated };
  }

  async deletePackage(id: number): Promise<ApiResponse<boolean>> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockPackages.findIndex((p) => p.id === id);
    if (index === -1) return { success: false, message: "Package not found", data: false };
    mockPackages.splice(index, 1);
    return { success: true, data: true };
  }

  async togglePackageActive(id: number): Promise<ApiResponse<boolean>> {
    const pkg = mockPackages.find((p) => p.id === id);
    if (!pkg) return { success: false, message: "Package not found", data: false };
    pkg.isActive = !pkg.isActive;
    return { success: true, data: true };
  }
}

const packageApi = new PackageAPI();
export default packageApi;