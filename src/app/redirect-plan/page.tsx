"use client";

import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/contexts/user-context";
import { checkPlan } from "@/lib/utils/check-plan";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const RedirectPlan = () => {
    const searchParamsObj = useSearchParams();
    const { user } = useUser();
    
    // Acessar os valores de searchParams no Next.js 15 diretamente
    // Não é necessário usar React.use() para searchParams

    useEffect(() => {
        const priceId = searchParamsObj.get("priceId");
        if (!priceId || !user?.id) {
            console.log("Não tem priceId ou user.id", priceId, user?.id);
            return;
        }

        const createCheckoutSession = async () => {
            const { alreadyHasPlan } = await checkPlan(user?.id, priceId);

            try {
                if (alreadyHasPlan) {
                    window.location.href = "/plan-already-active";
                    return;
                }

                const res = await fetch("/api/create-checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: user?.id,
                        price_id: priceId,
                    }),
                });

                const data = await res.json();

                if (data.checkout_url) {
                    window.location.href = data.checkout_url;
                } else {
                    console.error("Erro ao obter URL do checkout.");
                    window.location.href = "/";
                }
            } catch (error) {
                console.error("Erro no checkout:", error);
                window.location.href = "/";
            }
        };

        createCheckoutSession();
    }, [searchParamsObj, user]);

    return <Spinner />;
};

export default RedirectPlan;
