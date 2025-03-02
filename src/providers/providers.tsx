'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { UserProvider } from '@/contexts/user-context'

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                retry: 1,
            },
        },
    }))

    return (
        <SessionProvider>
            <UserProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </UserProvider>
        </SessionProvider>
    );
}
