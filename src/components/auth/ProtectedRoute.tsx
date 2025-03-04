'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Spinner } from '../ui/spinner';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/');
        }

    }, [session, router, status]);

    useEffect(() => {
        if (session?.user && !session.expires) {
            update({
                ...session,
                expires: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString() // atualiza a sessão para 1 hora e meia
            });
        }
    }, [session, update]);

    if (status === 'loading') {
        return <div className='flex justify-center items-center h-screen w-screen'><Spinner /></div>;
    }

    if (status === 'unauthenticated') {
        return null;
    }

    return <>{children}</>;
} 