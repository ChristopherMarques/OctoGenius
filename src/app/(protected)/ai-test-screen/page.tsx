"use client";

import { Button } from "@/components/ui/button";
import { useLLM } from "@/lib/hooks/queries/useLLM";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formatResponse = (text: string) => {
    return text
        .split("\n") // Divide por quebras de linha
        .map((paragraph, index) => (
            paragraph.trim() ? <p key={index} className="mb-2">{paragraph}</p> : null
        ));
};

const AiTestScreen = () => {
    const { mutate: askAI, data, isPending } = useLLM();

    return (
        <Card className="flex flex-col gap-4 p-4 border-2 border-gray-300 rounded-md justify-center items-center">
            <CardHeader>
                <CardTitle>Tela de testes para IA</CardTitle>
                <CardDescription>Essa é uma tela para testar o Octopus AI (nome de tudo pode mudar)</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Button variant="outline" onClick={() => askAI("Olá, poderia me falar um pouco sobre você?")}>
                    {isPending ? "Carregando..." : "Gerar Teste"}
                </Button>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        {isPending ? (
                            <Spinner />
                        ) : (
                            <div className="whitespace-pre-line text-left">
                                {data?.candidates?.[0]?.content?.parts?.[0]?.text
                                    ? formatResponse(data.candidates[0].content.parts[0].text)
                                    : "Nenhuma resposta recebida"}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AiTestScreen;
