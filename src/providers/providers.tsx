'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                retry: 1,
            },
        },
    }))

    const [supabaseClient] = useState(() => createClientComponentClient())

    return (
        <SessionContextProvider supabaseClient={supabaseClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionContextProvider>
    )
}
