"use client"
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function SocialLogin() {
    const { data: session } = useSession()
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut()
        router.replace('/')
    }

    const handleSignIn = async () => {
        await signIn('google', { callbackUrl: '/dashboard' })
    }

    if (session) {
        return (
            <Button
                className="w-full border"
                variant="outline"
                onClick={handleSignOut}
            >
                Sair
            </Button>
        )
    }

    return (
        <Button
            className="w-full border"
            variant="outline"
            onClick={handleSignIn}
        >
            <FcGoogle className="mr-2 h-4 w-4" />
            Continuar com Google
        </Button>
    )
} 