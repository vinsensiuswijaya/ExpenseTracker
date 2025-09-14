export type Category = {
    id: number;
    name: string;
};

export type CreateCategoryDto = { name: string };
export type UpdateCategoryDto = CreateCategoryDto;