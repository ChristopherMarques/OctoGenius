import { Vestibulares } from "@/lib/utils/constants";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { useTheme } from "next-themes";
import { cn } from "@/lib/design-utils";

interface IntentionOnProps {
    value: string;
    onChange: (value: string) => void;
}

export const IntentionOn = ({ value, onChange }: IntentionOnProps) => {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";

    const className = cn(
        "max-h-[300px] overflow-y-auto bg-[black || white] z-50 ",
        isDarkMode ? "bg-black" : "bg-white"
    );
    return (

        <Select onValueChange={onChange} value={value}>
            <SelectTrigger className="bg-background my-4">
                <SelectValue placeholder="Selecione um vestibular" />
            </SelectTrigger>
            <SelectContent className={className}>
                {Vestibulares.map((vestibular) => (
                    <SelectItem key={vestibular} value={vestibular}>{vestibular}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
};