import { ChatWidget } from "@/components/chat/chat-widget"
import WorkingChatbot from "@/components/mvpblocks/working-chatbot"

export default function ChatPage() {
    return (
        <div className="flex h-svh py-2 flex-col">
            <WorkingChatbot />
            <ChatWidget />
        </div>
    )
}