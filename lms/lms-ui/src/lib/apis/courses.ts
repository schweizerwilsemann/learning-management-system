import api from '../apiClient';

export const createCourse = async (payload: { title: string }) => {
  const res = await api.post('/courses', payload);
  return res.data;
};

export const updateCourse = async (id: string, payload: any) => {
  const res = await api.put(`/courses/${id}`, payload);
  return res.data;
};

export const deleteCourse = async (id: string) => {
  const res = await api.delete(`/courses/${id}`);
  return res.data;
};

export const publishCourse = async (id: string) => {
  const res = await api.post(`/courses/${id}/publish`);
  return res.data;
};

export const unpublishCourse = async (id: string) => {
  const res = await api.post(`/courses/${id}/unpublish`);
  return res.data;
};

export const getCourseAnalytics = async (id: string) => {
  const res = await api.get(`/courses/${id}/analytics`);
  return res.data;
};
