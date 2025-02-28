import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCog, BookOpen, Trophy, BarChart3 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/20 -z-10" />
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Seu caminho para o sucesso no{" "}
              <span className="text-primary">vestibular</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Plano de estudos personalizado, questões adaptativas e estatísticas detalhadas para maximizar seu desempenho no ENEM e vestibulares.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/cadastro">Comece Gratuitamente</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/como-funciona">Saiba Mais</Link>
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <BrainCog className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Inteligência Adaptativa</h3>
                  <p className="text-sm text-muted-foreground">Plano que evolui com você</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Banco de Questões</h3>
                  <p className="text-sm text-muted-foreground">Milhares de exercícios</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Estatísticas Detalhadas</h3>
                  <p className="text-sm text-muted-foreground">Acompanhe seu progresso</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Gamificação</h3>
                  <p className="text-sm text-muted-foreground">Desafios e recompensas</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative bg-background rounded-lg shadow-xl border overflow-hidden">
              <div className="p-1 bg-muted">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Seu Plano de Estudos</h3>
                  <div className="h-2 bg-muted rounded-full w-full mb-4">
                    <div className="h-2 bg-primary rounded-full w-[65%]" />
                  </div>
                  <p className="text-sm text-muted-foreground">65% do plano concluído</p>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Matemática</h4>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Hoje</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Funções Trigonométricas</p>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-muted rounded-full">
                        <div className="h-1.5 bg-primary rounded-full w-[40%]" />
                      </div>
                      <span className="text-xs text-muted-foreground">40%</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Física</h4>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">Amanhã</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Leis de Newton</p>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-muted rounded-full">
                        <div className="h-1.5 bg-primary rounded-full w-[75%]" />
                      </div>
                      <span className="text-xs text-muted-foreground">75%</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Química</h4>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">Quinta</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Equilíbrio Químico</p>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-muted rounded-full">
                        <div className="h-1.5 bg-primary rounded-full w-[20%]" />
                      </div>
                      <span className="text-xs text-muted-foreground">20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -z-10 -bottom-6 -right-6 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -z-10 -top-6 -left-6 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}