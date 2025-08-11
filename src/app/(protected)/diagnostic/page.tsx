"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
    Terminal,
    BookOpen,
    FlaskConical,
    Calculator,
    Dna,
    ScrollText,
    Globe,
    BrainCircuit,
    Users,
    Languages,
    Award,
    Gem,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/design-utils";

// Tipos
interface Alternative { id: string; text: string; }
interface Question { id: string; statement: string; alternatives: Alternative[]; correctAnswerId: string; }
interface UserAnswer { questionId: string; selectedAnswerId: string; }

// Matérias com ícones
const AVALIABLE_SUBJECTS = [
    { value: "Matemática", label: "Matemática", Icon: Calculator },
    { value: "Física", label: "Física", Icon: BrainCircuit },
    { value: "Química", label: "Química", Icon: FlaskConical },
    { value: "Biologia", label: "Biologia", Icon: Dna },
    { value: "História", label: "História", Icon: ScrollText },
    { value: "Geografia", label: "Geografia", Icon: Globe },
    { value: "Filosofia", label: "Filosofia", Icon: BookOpen },
    { value: "Sociologia", label: "Sociologia", Icon: Users },
    { value: "Língua Portuguesa", label: "Língua Portuguesa", Icon: Languages },
];

export default function DiagnosticPage() {
    const router = useRouter();
    const { toast } = useToast();

    // Estados do Componente
    const [step, setStep] = useState<'intro' | 'selection' | 'test' | 'results'>('intro');
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [score, setScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubjectChange = (subjectValue: string) => {
        setSelectedSubjects((prev) =>
            prev.includes(subjectValue)
                ? prev.filter((s) => s !== subjectValue)
                : [...prev, subjectValue]
        );
    };

    const handleGenerateTest = async () => {
        if (selectedSubjects.length === 0) {
            setError("Por favor, selecione pelo menos uma matéria.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/generate-diagnostic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subjects: selectedSubjects }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Falha ao gerar o teste.");
            }
            const testData = await response.json();
            const questionsArray = testData.diagnosticTest || testData;
            if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
                throw new Error("A API não retornou um formato de teste válido.");
            }
            setQuestions(questionsArray);
            setStep('test');
        } catch (err: any) {
            setError(err.message);
            toast({ title: "Erro", description: err.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswerSelect = (questionId: string, selectedAnswerId: string) => {
        setUserAnswers((prev) => {
            const otherAnswers = prev.filter((a) => a.questionId !== questionId);
            return [...otherAnswers, { questionId, selectedAnswerId }];
        });
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitTest = async () => {
        if (userAnswers.length !== questions.length) {
            setError("Por favor, responda todas as questões antes de finalizar.");
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await fetch('/api/study/plan-from-diagnostic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questions, userAnswers }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao enviar o resultado do teste.');
            }

            const data = await response.json();
            const studyPlanId = data.studyPlanId;

            let correctAnswers = 0;
            questions.forEach(q => {
                const userAnswer = userAnswers.find(a => a.questionId === q.id);
                if (userAnswer?.selectedAnswerId === q.correctAnswerId) {
                    correctAnswers++;
                }
            });
            setScore(correctAnswers);
            setStep('results');

            // Armazenar o ID do plano de estudos para redirecionamento posterior
            if (studyPlanId) {
                localStorage.setItem('lastStudyPlanId', studyPlanId);
            }

        } catch (err: any) {
            setError(err.message);
            toast({ title: "Erro ao Finalizar", description: err.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownload = async () => {
        const studyPlanId = localStorage.getItem('lastStudyPlanId');
        if (!studyPlanId) {
            toast({ title: "Erro", description: "ID do plano de estudos não encontrado no localStorage.", variant: "destructive" });
            return;
        }

        console.log(`Iniciando download para o studyPlanId: ${studyPlanId}`);
        setIsDownloading(true);
        try {
            const response = await fetch('/api/download-study-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studyPlanId }),
            });

            // Se a resposta não for 'ok', vamos investigar o que o servidor retornou
            if (!response.ok) {
                const errorText = await response.text(); // Lê a resposta como texto para ver o que é
                console.error("A API retornou um erro:", {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText, // Isto vai mostrar o HTML da página de erro 404 do Next.js
                });
                throw new Error(`Falha ao contactar a API. O servidor respondeu com o status ${response.status}.`);
            }

            const data = await response.json();
            
            const link = document.createElement('a');
            link.href = data.pdfBase64;
            link.download = data.fileName || `plano-de-estudos.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err: any) {
            toast({ title: "Erro no Download", description: err.message, variant: "destructive" });
        } finally {
            setIsDownloading(false);
        }
    };

    const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

    // Renderização dos Passos
    const renderIntro = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="w-full max-w-2xl text-center shadow-2xl border-purple-500/20">
                <CardHeader>
                    <div className="mx-auto bg-purple-100 dark:bg-purple-900/50 p-4 rounded-full mb-4">
                        <Award className="w-16 h-16 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Seu Primeiro Desafio Começa Agora!</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground pt-2">
                        Complete o teste de diagnóstico para desbloquear seu plano de estudos personalizado.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-around">
                        <div className="flex flex-col items-center space-y-4">
                            <Gem className="w-10 h-10 text-blue-500" />
                            <p className="text-lg font-extrabold">+500 Pontos</p>
                            <p className="text-sm text-muted-foreground">Ao finalizar</p>
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            <Award className="w-10 h-10 text-amber-500" />
                            <p className="text-lg font-extrabold">Badge de Explorador</p>
                            <p className="text-sm text-muted-foreground">Sua primeira conquista</p>
                        </div>
                    </div>
                    <Button variant={"outline"} onClick={() => setStep('selection')} size="lg" className="w-1/2">Começar Diagnóstico</Button>
                </CardContent>
            </Card>
        </motion.div>
    );

    const renderSelection = () => (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
            <Card className="w-full max-w-4xl mx-auto shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Quais áreas você quer explorar?</CardTitle>
                    <p className="text-center text-muted-foreground">Selecione as matérias para gerar seu teste personalizado.</p>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6 p-2 w-[90%] h-full">
                        {AVALIABLE_SUBJECTS.map(({ value, label, Icon }) => {
                            const isSelected = selectedSubjects.includes(value);
                            return (
                                <motion.div key={value} whileTap={{ scale: 0.95 }}>
                                    <button
                                        onClick={() => handleSubjectChange(value)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 rounded-lg border-2 w-full h-full text-center transition-all duration-200",
                                            isSelected
                                                ? "bg-purple-100 dark:bg-purple-900/50 border-purple-500 shadow-md"
                                                : "bg-background hover:bg-accent hover:text-accent-foreground"
                                        )}
                                    >
                                        <Icon className={cn("w-8 h-8 mb-2", isSelected ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground")} />
                                        <span className="font-semibold">{label}</span>
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                    {error && <Alert variant="destructive" className="mb-4"><Terminal className="h-4 w-4" /><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                    <Button onClick={handleGenerateTest} disabled={isLoading || selectedSubjects.length === 0} className="w-1/2 mx-auto" variant={"outline"} size="lg">
                        {isLoading ? <Spinner /> : "Gerar Teste"}
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );

    const renderTest = () => {
        if (questions.length === 0) return null;
        const currentQuestion = questions[currentQuestionIndex];
        const selectedAnswer = userAnswers.find(a => a.questionId === currentQuestion.id)?.selectedAnswerId;
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center jsutify-center">
                <Card className="w-full max-w-3xl shadow-lg p-4">
                    <CardHeader>
                        <CardTitle>Questão {currentQuestionIndex + 1} de {questions.length}</CardTitle>
                        <Progress value={progress} className="w-full mt-2" />
                    </CardHeader>
                    <CardContent>
                        <p className="mb-6 text-lg">{currentQuestion.statement}</p>
                        <RadioGroup value={selectedAnswer} onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)} className="space-y-3">
                            {currentQuestion.alternatives.map((alt) => (
                                <Label key={alt.id} htmlFor={alt.id} className={cn("flex items-center space-x-3 p-4 rounded-lg border transition-colors", selectedAnswer === alt.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-border hover:bg-accent')}>
                                    <RadioGroupItem value={alt.id} id={alt.id} />
                                    <span className="text-base font-normal">{alt.text}</span>
                                </Label>
                            ))}
                        </RadioGroup>
                        {error && <Alert variant="destructive" className="my-4"><Terminal className="h-4 w-4" /><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                    </CardContent>
                </Card>
                <div className="flex justify-between w-full max-w-3xl mt-6">
                    <Button onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0} variant="outline">Anterior</Button>
                    {currentQuestionIndex === questions.length - 1 ? (
                        <Button onClick={handleSubmitTest} disabled={isSubmitting}>{isSubmitting ? <Spinner /> : "Finalizar Teste"}</Button>
                    ) : (
                        <Button onClick={goToNextQuestion} variant="outline">Próxima</Button>
                    )}
                </div>
            </motion.div>
        );
    };

    const renderResults = () => (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 150 }}>
            <Card className="w-full max-w-2xl text-center shadow-2xl border-amber-500/20">
                <CardHeader>
                    <div className="mx-auto bg-amber-100 dark:bg-amber-900/50 p-4 rounded-full mb-4 ring-4 ring-amber-200 dark:ring-amber-800">
                        <Award className="w-20 h-20 text-amber-500 dark:text-amber-400" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Diagnóstico Concluído!</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground pt-2">
                        Parabéns por completar seu primeiro desafio.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-background rounded-lg p-6">
                        <p className="text-xl font-medium">Você acertou</p>
                        <p className="text-6xl font-bold text-purple-600 dark:text-purple-400 my-2">{score} <span className="text-4xl text-muted-foreground">/{questions.length}</span></p>
                        <p className="text-lg font-medium">questões</p>
                    </div>
                    <div className="flex justify-around items-center bg-background rounded-lg p-4 gap-8">
                        <div className="flex items-center space-x-3">
                            <Gem className="w-8 h-8 text-blue-500" />
                            <p className="font-semibold text-xl">+500 Pontos</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                            <p className="font-semibold text-xl">Badge Conquistada!</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-4 w-full">
                        <Button 
                            onClick={() => {
                                const studyPlanId = localStorage.getItem('lastStudyPlanId');
                                if (studyPlanId) {
                                    router.push(`/plano-estudos/${studyPlanId}`);
                                } else {
                                    router.push('/dashboard');
                                }
                            }} 
                            size="lg" 
                            className="w-[90%]" 
                        >
                            Ver meu novo Plano de Estudos
                        </Button>
                        <Button 
                            onClick={handleDownload}
                            size="lg" 
                            className="w-[90%]" 
                            variant="outline"
                            disabled={isDownloading}
                        >
                            {isDownloading ? <Spinner /> : "Baixar PDF do Plano"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    const renderStep = () => {
        switch (step) {
            case 'intro': return renderIntro();
            case 'selection': return renderSelection();
            case 'test': return renderTest();
            case 'results': return renderResults();
            default: return renderIntro();
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950">
            {renderStep()}
        </div>
    );
}
