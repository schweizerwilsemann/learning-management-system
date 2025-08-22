import api from '../apiClient';

export const createOrder = async (amount: number) => {
  const res = await api.post('/checkout/order', { amount });
  return res.data;
};

export const verifyPayment = async (payload: { paymentId: string; orderId: string; signature: string; courseId: string }) => {
  const res = await api.post('/checkout/verify', payload);
  return res.data;
};
