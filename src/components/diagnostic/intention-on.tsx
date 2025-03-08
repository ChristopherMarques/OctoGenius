import { Vestibulares } from "@/lib/utils/constants";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";

interface IntentionOnProps {
    value: string;
    onChange: (value: string) => void;
}

export const IntentionOn = ({ value, onChange }: IntentionOnProps) => (
    <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="bg-white my-4">
            <SelectValue placeholder="Selecione um vestibular" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto bg-white z-50 opacity-100">
            {Vestibulares.map((vestibular) => (
                <SelectItem key={vestibular} value={vestibular}>{vestibular}</SelectItem>
            ))}
        </SelectContent>
    </Select>
);