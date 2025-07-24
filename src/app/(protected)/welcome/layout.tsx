import React from "react";

export default function PageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-dvw h-dvh bg-[#171717]">{children}</div>
    )
}