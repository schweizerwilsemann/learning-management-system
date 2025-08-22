import api from './apiClient';

const getPurchasesData = async () => {
    const res = await api.get('/admin/analytics/purchases');
    return res?.data;
};

const getUsersData = async () => {
    const res = await api.get('/admin/analytics/users');
    return res?.data;
};

export { getPurchasesData, getUsersData };