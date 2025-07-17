import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ThemeProvider } from '@/components/theme-provider'

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ThemeProvider attribute="class" enableSystem>
            <ProtectedRoute>{children}</ProtectedRoute>
        </ThemeProvider>
    )
}
