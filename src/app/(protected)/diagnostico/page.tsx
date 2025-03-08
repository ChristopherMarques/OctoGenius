"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { usePostDiagnostic, useGetDiagnostic, usePatchDiagnostic } from "@/lib/hooks/queries/useDiagnostic";
import { useUser } from "@/contexts/user-context";
import { TestProgress, QuestionCard, NavigationButtons, TestCompletion, IntentionOn } from "@/components/diagnostic";
import { Spinner } from "@/components/ui/spinner";
import { DiagnosticQuestion } from "@/types/diagnostic-tests.types";

export default function DiagnosticoPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [intentionIn, setIntentionIn] = useState("");
  const [score, setScore] = useState(0);
  const { data: diagnosticPost, isLoading: isLoadingPost } = usePostDiagnostic(intentionIn, user?.id);
  const { data: diagnosticGet, isLoading: isLoadingGet } = useGetDiagnostic(user?.id);
  const { mutate: patchDiagnostic, isPending: isLoadingPatch, error } = usePatchDiagnostic();
  const loading = isLoadingPost || isLoadingGet || isLoadingPatch;
  const questions = useMemo(() => diagnosticGet?.questions || diagnosticPost?.questions || [], [diagnosticGet, diagnosticPost]);
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const nextQuestion = () => (currentQuestion < questions.length - 1 ? setCurrentQuestion(currentQuestion + 1) : completeTest());
  const handleAnswer = (value: string) => setAnswers({ ...answers, [questions[currentQuestion].id]: value });

  const calculateScore = useCallback(() => {
    const score = questions.reduce((acc: number, question: DiagnosticQuestion) => {
      return acc + (answers[question.id] === question.resposta ? 1 : 0);
    }, 0);

    setScore(score);
  }, [answers, questions]);

  const completeTest = () => {
    setTestCompleted(true);
    patchDiagnostic({ userId: user?.id, questions_answers: answers, score: score });
    if (error) {
      toast({ title: "Erro ao concluir o teste!", description: error.message });
    } else {
      toast({ title: "Teste concluído!", description: "Gerando plano de estudos." });
      setTimeout(() => window.location.href = "/dashboard", 3000);
    }
  };

  const handleIntentionChange = (value: string) => {
    setIntentionIn(value);
    setCurrentQuestion(0);
    setAnswers({});
    setTestCompleted(false);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  useEffect(() => {
    calculateScore();
  }, [calculateScore, currentQuestion]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-3xl mx-auto">
          {!testCompleted ? (
            <Card className="flex flex-col gap-4 px-4">
              {questions.length > 0 && (
                <CardHeader>
                  <TestProgress currentQuestion={currentQuestion} totalQuestions={questions.length} progress={progress} discipline={questions[currentQuestion]?.disciplina} />
                </CardHeader>
              )}
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner />
                </div>
              ) : (
                <>
                  {!diagnosticGet && !questions.length && <IntentionOn value={intentionIn} onChange={handleIntentionChange} />}
                  <QuestionCard question={questions[currentQuestion]} answer={answers[questions[currentQuestion]?.id]} onAnswerChange={handleAnswer} />
                  <NavigationButtons onPrevious={handlePrevious} onNext={nextQuestion} canBack={currentQuestion > 0} canAdvance={!!answers[questions[currentQuestion]?.id]} canFinish={questions.length === currentQuestion + 1} isFinishing={testCompleted} />
                </>
              )}
            </Card>
          ) : (
            <TestCompletion />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

