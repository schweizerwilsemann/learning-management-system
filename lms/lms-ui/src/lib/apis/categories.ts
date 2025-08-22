import api from '../apiClient';

export const createCategory = async (name: string) => {
  const res = await api.post('/categories', { name });
  return res.data;
};

export const updateCategory = async (id: string, name: string) => {
  const res = await api.put(`/categories/${id}`, { name });
  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};
