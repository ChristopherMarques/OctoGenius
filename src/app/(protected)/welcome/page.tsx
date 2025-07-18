"use client";
import Image from "next/image";
import ChatImage from "@/assets/logos/logo-chat.png";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  const { data } = useSession();
  const userName = data?.user.name || "Estudante";

  return (
    <div className="w-full h-full flex flex-col gap-6 justify-center items-center text-center p-4">
      <Image
        src={ChatImage}
        alt="Octopus AI"
        width={300}
        height={300}
        className="mr-2 flexrounded-full p-1 sm:mr-4"
      />
      <div className="space-y-2">
        <h1 className="font-bold text-3xl text-neutral-100">
          Seja bem-vindo(a), {userName}
        </h1>
        <p className="font-medium text-2xl text-neutral-100">
          Vamos criar seu plano de estudos perfeito!
        </p>
      </div>
      <pre className="break-words text-pretty font-medium text-xl line-clamp-12 leading-8 max-w-[1200px]">
        Para entendermos seus pontos fortes e onde podemos melhorar, preparamos
        um rápido desafio diagnóstico. Suas respostas nos ajudarão a focar nos
        temas que mais importam para sua aprovação.
      </pre>
      <Button variant="outline" className="text-xl p-6">
        Começar Desafio!
      </Button>
    </div>
  );
}
