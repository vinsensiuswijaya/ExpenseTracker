import api from "./apiClient";
import type { Category, CreateCategoryDto, UpdateCategoryDto } from "../types/category";

const base = "/Category";

export async function getCategories(): Promise<Category[]> {
    const res = await api.get<Category[]>(base);
    return res.data;
}

export async function getCategory(id: number): Promise<Category> {
    const res = await api.get<Category>(`${base}/${id}`);
    return res.data;
}

export async function createCategory(dto:CreateCategoryDto): Promise<Category> {
    const res = await api.post<Category>(base, dto);
    return res.data;
}

export async function updateCategory(id: number, dto:UpdateCategoryDto): Promise<void> {
    await api.put(`${base}/${id}`, dto);
}

export async function deleteCategory(id:number): Promise<void> {
    await api.delete(`${base}/${id}`);
}