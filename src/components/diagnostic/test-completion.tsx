import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const TestCompletion = () => (
    <Card className="text-center">
        <CardHeader>
            <CardTitle className="text-2xl">Teste Diagnóstico Concluído!</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-lg">Seu plano de estudos está sendo gerado.</p>
        </CardContent>
    </Card>
);