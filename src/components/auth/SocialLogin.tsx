"use client"
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/hooks/auth/useAuth";
import { useRouter } from "next/navigation";

export function SocialLogin() {
    const router = useRouter()
    const { user, isLoading } = useAuth()

    const handleSignIn = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                    skipBrowserRedirect: false
                },
            })

            if (error) {
                throw error
            }
        } catch (error) {
            console.error('Error signing in:', error)
        }
    }

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut()
            router.push('/')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    if (isLoading) {
        return <Button disabled>Carregando...</Button>
    }
    console.log(user)
    return user ? (
        <Button
            className="w-full border"
            variant="outline"
            onClick={handleSignOut}
        >
            Sair
        </Button>
    ) : (
        <Button
            className="w-full border"
            variant="outline"
            onClick={handleSignIn}
        >
            <FcGoogle className="mr-2 h-4 w-4" />
            Continuar com Google
        </Button>
    );
} 