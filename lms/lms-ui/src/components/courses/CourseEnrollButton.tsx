"use client";
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { checkoutAction, verifyPaymentAction } from '@/actions/checkout';
import { toast } from '../ui/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CourseEnrollButtonProps {
    price: number;
    courseId: string;
    children: React.ReactNode;
}

const CourseEnrollButton: React.FC<CourseEnrollButtonProps> = ({ price, courseId, children }) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const session = useSession();
    const router = useRouter();
    const serachParams = useSearchParams();

    const [isVeryfying, setIsVeryfying] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleCheckout = async () => {
        if (session.status !== 'authenticated') {
            setOpenDialog(true);
            return;
        }
        setLoading(true);
        try {
            const sessionUserId = (session?.data?.user as any)?.id;
            if (!sessionUserId) {
                return toast({
                    title: "User not found. Please sign in again.",
                    variant: "destructive",
                });
            }

            const response = await checkoutAction(price, courseId, sessionUserId);
            const { success, order } = response.data;
            if (!success) {
                return toast({
                    title: "Something went wrong.",
                    variant: "destructive",
                });
            }

            // Redirect to VNPay payment page
            if (order?.paymentUrl) {
                window.location.href = order.paymentUrl;
            } else {
                return toast({
                    title: "Payment URL not generated.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            console.log(error);
            return toast({
                title: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const onSignIn = async (method: 'google') => {
        try {
            await signIn(method, {
                redirect: false
            });
            setOpenDialog(false);
        } catch (error) {
            console.log(error);
            toast({
                title: serachParams.get('error') || 'Something went wrong.',
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full md:w-auto"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    children
                )}
            </Button>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Sign in to continue
                        </DialogTitle>
                        <DialogDescription>
                            You need to be signed in to purchase this course.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col gap-4">
                        <Button
                            onClick={() => onSignIn('google')}
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <Image
                                        src="/google.svg"
                                        alt="Google"
                                        width={20}
                                        height={20}
                                        className="mr-2"
                                    />
                                    Continue with Google
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CourseEnrollButton;