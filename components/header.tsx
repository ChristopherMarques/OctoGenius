"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Brain } from "lucide-react";
import { SocialLogin } from "./auth/SocialLogin";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">OctoGenius.ai</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/plano-estudos" className="text-sm font-medium hover:text-primary transition-colors">
            Plano de Estudos
          </Link>
          <Link href="/questoes" className="text-sm font-medium hover:text-primary transition-colors">
            Banco de Questões
          </Link>
          <Link href="/estatisticas" className="text-sm font-medium hover:text-primary transition-colors">
            Estatísticas
          </Link>
          <Link href="/desafios" className="text-sm font-medium hover:text-primary transition-colors">
            Desafios
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" asChild>
              <SocialLogin />
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/plano-estudos" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                  Plano de Estudos
                </Link>
                <Link href="/questoes" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                  Banco de Questões
                </Link>
                <Link href="/estatisticas" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                  Estatísticas
                </Link>
                <Link href="/desafios" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                  Desafios
                </Link>
                <div className="flex flex-col gap-2 mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/login" onClick={() => setIsOpen(false)}>Entrar</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/cadastro" onClick={() => setIsOpen(false)}>Cadastrar</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}