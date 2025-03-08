import { RadioGroupItem } from "../ui/radio-group";
import { CardContent, CardTitle } from "../ui/card";
import { RadioGroup } from "../ui/radio-group";
import { DiagnosticQuestion } from "@/types/diagnostic-tests.types";
import { Label } from "../ui/label";


interface QuestionCardProps {
    question: DiagnosticQuestion;
    answer: string;
    onAnswerChange: (answer: string) => void;
}

export const QuestionCard = ({ question, answer, onAnswerChange }: QuestionCardProps) => (
    <CardContent>
        <CardTitle className="my-6 text-xl">{question?.enunciado}</CardTitle>
        <RadioGroup value={answer} onValueChange={onAnswerChange} className="space-y-4">
            {question?.alternativas.map((alt) => (
                <div key={alt.id} className="flex items-start space-x-2 border p-4 rounded-md hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={alt.id} id={`alternativa-${alt.id}`} />
                    <Label htmlFor={`alternativa-${alt.id}`} className="flex-1 cursor-pointer">
                        <span className="font-semibold">{alt.id.toUpperCase()})</span> {alt.texto}
                    </Label>
                </div>
            ))}
        </RadioGroup>
    </CardContent>
);