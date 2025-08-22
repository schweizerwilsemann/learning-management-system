"use server";
import * as categoriesApi from '@/lib/apis/categories';

const createCategoryAction = async (name: string) => {
    return categoriesApi.createCategory(name);
};

const updateCategoryAction = async (id: string, name: string) => {
    return categoriesApi.updateCategory(id, name);
};

const deleteCategoryAction = async (id: string) => {
    return categoriesApi.deleteCategory(id);
};

export { createCategoryAction, updateCategoryAction, deleteCategoryAction };