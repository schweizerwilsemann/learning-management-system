"use server";
import api from '@/lib/apiClient';

const checkoutAction = async (amount: number) => {
    try {
        const res = await api.post('/checkout/order', { amount });
        return res;
    } catch (err: any) {
        throw new Error(typeof err === 'string' ? err : JSON.stringify(err));
    }
};

const verifyPaymentAction = async ({ paymentId, orderId, signature, courseId }: { paymentId: string; orderId: string; signature: string; courseId: string }) => {
    try {
        const res = await api.post('/checkout/verify', { paymentId, orderId, signature, courseId });
        return res;
    } catch (err: any) {
        throw new Error(typeof err === 'string' ? err : JSON.stringify(err));
    }
};

export { checkoutAction, verifyPaymentAction };