import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";

export function SocialLogin() {
    const { signInWithGoogle } = useAuth();

    return (
        <Button
            className="w-full border"
            variant="outline"
            onClick={signInWithGoogle}
        >
            <FcGoogle className="mr-2 h-4 w-4" />
            Continuar com Google
        </Button>
    );
} 