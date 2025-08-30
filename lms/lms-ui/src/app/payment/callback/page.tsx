"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentCallbackPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const handlePaymentCallback = async () => {
            try {
                // Get VNPay response parameters
                const vnpResponseCode = searchParams.get('vnp_ResponseCode');
                const vnpTxnRef = searchParams.get('vnp_TxnRef');
                const vnpAmount = searchParams.get('vnp_Amount');
                const vnpOrderInfo = searchParams.get('vnp_OrderInfo');

                console.log('VNPay Response:', {
                    vnpResponseCode,
                    vnpTxnRef,
                    vnpAmount,
                    vnpOrderInfo
                });

                // Check if payment was successful (00 = success)
                if (vnpResponseCode === '00') {
                    setStatus('success');
                    setMessage('Thanh toán thành công! Cảm ơn bạn đã mua khóa học.');
                    
                    // Redirect to courses page after 3 seconds
                    setTimeout(() => {
                        router.push('/courses');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage('Thanh toán thất bại. Vui lòng thử lại.');
                }
            } catch (error) {
                console.error('Payment callback error:', error);
                setStatus('error');
                setMessage('Có lỗi xảy ra khi xử lý thanh toán.');
            }
        };

        handlePaymentCallback();
    }, [searchParams, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
                    <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6 text-blue-600" />
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Đang xử lý thanh toán</h2>
                    <p className="text-gray-600">Vui lòng chờ trong khi chúng tôi xác minh thanh toán của bạn...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
                {status === 'success' ? (
                    <>
                        <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-green-600 mb-4">Thanh toán thành công!</h2>
                        <p className="text-gray-600 mb-8 text-lg">{message}</p>
                        <div className="space-y-4">
                            <Button 
                                onClick={() => router.push('/courses')}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold"
                            >
                                Xem khóa học của tôi
                            </Button>
                            <Button 
                                onClick={() => router.push('/')}
                                variant="outline"
                                className="w-full py-3 px-6 rounded-lg font-semibold"
                            >
                                Về trang chủ
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <XCircle className="h-20 w-20 text-red-600 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-red-600 mb-4">Thanh toán thất bại</h2>
                        <p className="text-gray-600 mb-8 text-lg">{message}</p>
                        <div className="space-y-4">
                            <Button 
                                onClick={() => router.push('/')}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold"
                            >
                                Về trang chủ
                            </Button>
                            <Button 
                                onClick={() => router.back()}
                                variant="outline"
                                className="w-full py-3 px-6 rounded-lg font-semibold"
                            >
                                Thử lại
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentCallbackPage;
