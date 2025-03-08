import { Progress } from "../ui/progress";

interface TestProgressProps {
    currentQuestion: number;
    totalQuestions: number;
    progress: number;
    discipline: string;
}

export const TestProgress = ({ currentQuestion, totalQuestions, progress, discipline }: TestProgressProps) => (
    <div>
        <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-muted-foreground">Questão {currentQuestion + 1} de {totalQuestions}</div>
            <div className="text-sm font-medium text-primary">{discipline}</div>
        </div>
        <Progress value={progress} className="h-2" />
    </div>
);