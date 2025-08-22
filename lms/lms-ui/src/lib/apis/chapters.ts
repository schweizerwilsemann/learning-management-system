import api from '../apiClient';

export const createChapter = async (courseId: string, payload: { title: string }) => {
  const res = await api.post(`/chapters/${courseId}`, payload);
  return res.data;
};

export const reorderChapters = async (courseId: string, list: any) => {
  const res = await api.post(`/chapters/${courseId}/reorder`, { list });
  return res.data;
};

export const updateChapter = async (chapterId: string, payload: any) => {
  const res = await api.put(`/chapters/${chapterId}`, payload);
  return res.data;
};

export const deleteChapter = async (chapterId: string, data: any) => {
  const res = await api.delete(`/chapters/${chapterId}`, { data });
  return res.data;
};

export const publishChapter = async (chapterId: string, data: any) => {
  const res = await api.post(`/chapters/${chapterId}/publish`, data);
  return res.data;
};

export const unpublishChapter = async (chapterId: string, data: any) => {
  const res = await api.post(`/chapters/${chapterId}/unpublish`, data);
  return res.data;
};
