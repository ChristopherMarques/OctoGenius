"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { signIn, useSession } from "next-auth/react";
import { useUser } from "@/contexts/user-context";
import { useRouter } from "next/navigation";

export default function BuyButton({ priceId, planName }: { priceId: string, planName: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { status } = useSession();
    const { user } = useUser();

    async function handleCheckout() {
        if (status !== "authenticated") {
            console.log("Usuário não autenticado, redirecionando para login...");

            await signIn('google', { callbackUrl: `/redirect-plan?priceId=${priceId}` });
            return;
        }
        setLoading(true);

        const resPlan = await fetch("/api/check-plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user?.id, priceId }),
        });
        const { alreadyHasPlan } = await resPlan.json();
        if (alreadyHasPlan) {
            router.push("/plan-already-active");
            return;
        }

        try {
            const userId = user?.id;

            const res = await fetch("/api/create-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, price_id: priceId }),
            });

            const data = await res.json();

            if (data.checkout_url) {
                router.replace(data.checkout_url);
            } else {
                console.error("Erro ao obter URL do checkout.");
            }
        } catch (error) {
            console.error("Erro no checkout:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            onClick={handleCheckout}
            variant="outline"
            disabled={loading}
            className="bg-blue-500 text-white hover:bg-blue-600"
        >
            {loading ? `Carregando...` : `Assinar ${planName}`}
        </Button>
    );
}
