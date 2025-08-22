"use server";
import api from '@/lib/apiClient';

const uploadMediaAction = async (filename: string, ref: string) => {
    try {
        const res = await api.post('/media/presign', { filename, ref });
        return res.data;
    } catch (err: any) {
        throw new Error(typeof err === 'string' ? err : JSON.stringify(err));
    }
};

const deleteMediaAction = async (url: string) => {
    try {
        const res = await api.post('/media/delete', { url });
        return res.data;
    } catch (err: any) {
        return { success: false, error: err };
    }
};

export { uploadMediaAction, deleteMediaAction };