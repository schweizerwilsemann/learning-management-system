"use server";
import api from '@/lib/apiClient';

const checkoutAction = async (amount: number, courseId: string, userId: string) => {
    try {
        const res = await api.post('/checkout/order', { amount, courseId, userId });
        return res;
    } catch (err: any) {
        throw new Error(typeof err === 'string' ? err : JSON.stringify(err));
    }
};

const verifyPaymentAction = async (body: any) => {
    try {
        const res = await api.post('/checkout/verify', body);
        return res;
    } catch (err: any) {
        throw new Error(typeof err === 'string' ? err : JSON.stringify(err));
    }
};

export { checkoutAction, verifyPaymentAction };