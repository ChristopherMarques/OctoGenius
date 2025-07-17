'use client';

import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { MessageCircle } from 'lucide-react';
import WorkingChatbot from '../mvpblocks/working-chatbot';

export function ChatWidget() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="default"
                    className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-lg"
                >
                    <MessageCircle className="h-8 w-8" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                sideOffset={20}
                align="end"
                className="w-[440px] h-[600px] rounded-2xl p-2 shadow-2xl"
            >
                <WorkingChatbot />
            </PopoverContent>
        </Popover>
    );
}