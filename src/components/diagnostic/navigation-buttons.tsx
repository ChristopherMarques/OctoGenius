import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";

interface NavigationButtonsProps {
    onPrevious: () => void;
    onNext: () => void;
    canAdvance: boolean;
    canBack: boolean;
    canFinish: boolean;
    isFinishing: boolean;
}

export const NavigationButtons = ({ onPrevious, onNext, canAdvance, canBack, canFinish, isFinishing }: NavigationButtonsProps) => (
    <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} disabled={!canBack}>Anterior</Button>
        <Button onClick={onNext} disabled={!canAdvance}>
            {isFinishing ? "Finalizando..." : canFinish ? "Finalizar" : "Próxima"}
        </Button>
    </CardFooter>
);