import api from '../apiClient';

export const createAttachment = async (courseId: string, payload: any) => {
  const res = await api.post(`/attachments/${courseId}`, payload);
  return res.data;
};

export const deleteAttachment = async (courseId: string, id: string) => {
  const res = await api.delete(`/attachments/${courseId}/${id}`);
  return res.data;
};
