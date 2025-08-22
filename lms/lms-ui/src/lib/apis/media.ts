import api from '../apiClient';

export const presignMedia = async (filename: string, ref: string) => {
  const res = await api.post('/media/presign', { filename, ref });
  return res.data;
};

export const deleteMedia = async (url: string) => {
  const res = await api.post('/media/delete', { url });
  return res.data;
};
