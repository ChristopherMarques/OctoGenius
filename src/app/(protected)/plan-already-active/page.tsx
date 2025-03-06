import { Button } from "@/components/ui/button";
import Link from "next/link";

const PlanAlreadyActivePage = () => {
    return (
        <div className="text-foreground text-center flex flex-col gap-4 justify-center items-center h-screen">
            <h1 className="text-2xl font-bold">Você já possui esse plano ativo</h1>
            <p className="text-md">Por favor, aguarde a expiração do plano atual para assinar um novo plano ou assine um plano diferente.</p>
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href="/dashboard">Ir para o dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/">Ir para a página inicial</Link>
                </Button>
            </div>
        </div>
    );
};

export default PlanAlreadyActivePage;


