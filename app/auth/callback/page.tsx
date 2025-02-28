'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallback() {
    const router = useRouter();
    const { profile, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!profile) return;

            if (!profile.completed_diagnostic) {
                router.push('/diagnostico');
            } else {
                router.push('/dashboard');
            }
        }
    }, [profile, loading, router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
} 