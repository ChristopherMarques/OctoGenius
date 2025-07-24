"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookOpen, CheckCircle, Clock, Trophy, BarChart3, Calendar, ArrowRight, Brain } from "lucide-react";
import { useUser } from "@/contexts/user-context";
import { useGetDiagnostic } from "@/lib/hooks/queries/useDiagnostic";
import { useRouter } from "next/navigation";

// Dados simulados para o dashboard
const disciplinas = [
  { nome: "Matemática", progresso: 65, cor: "hsl(var(--chart-1))" },
  { nome: "Português", progresso: 78, cor: "hsl(var(--chart-2))" },
  { nome: "Física", progresso: 42, cor: "hsl(var(--chart-3))" },
  { nome: "Química", progresso: 53, cor: "hsl(var(--chart-4))" },
  { nome: "Biologia", progresso: 70, cor: "hsl(var(--chart-5))" }
];

const atividadesHoje = [
  { id: 1, tipo: "Estudo", titulo: "Funções Trigonométricas", disciplina: "Matemática", duracao: "45 min", concluido: true },
  { id: 2, tipo: "Exercícios", titulo: "Leis de Newton", disciplina: "Física", duracao: "30 min", concluido: false },
  { id: 3, tipo: "Revisão", titulo: "Análise Sintática", disciplina: "Português", duracao: "20 min", concluido: false }
];

const desempenhoSemanal = [
  { dia: "Seg", acertos: 75 },
  { dia: "Ter", acertos: 82 },
  { dia: "Qua", acertos: 68 },
  { dia: "Qui", acertos: 79 },
  { dia: "Sex", acertos: 85 },
  { dia: "Sáb", acertos: 90 },
  { dia: "Dom", acertos: 72 }
];

const distribuicaoEstudos = [
  { name: "Matemática", value: 35 },
  { name: "Português", value: 25 },
  { name: "Física", value: 15 },
  { name: "Química", value: 10 },
  { name: "Biologia", value: 15 }
];

const CORES = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function DashboardPage() {
  const [atividadesConcluidas, setAtividadesConcluidas] = useState<number[]>([1]);
  const { user } = useUser();
  const { data: diagnosticData } = useGetDiagnostic(user?.id);
  const router = useRouter()
  const name = user?.full_name?.split(" ")[0];

  if (!diagnosticData) {
    router.replace('/welcome');
  }

  const marcarConcluida = (id: number) => {
    if (atividadesConcluidas.includes(id)) {
      setAtividadesConcluidas(atividadesConcluidas.filter(item => item !== id));
    } else {
      setAtividadesConcluidas([...atividadesConcluidas, id]);
    }
  };

  const progressoGeral = Math.round(
    disciplinas.reduce((acc, disciplina) => acc + disciplina.progresso, 0) / disciplinas.length
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1400px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Olá, {name}!</h1>
              <p className="text-muted-foreground">Bem-vindo ao seu painel de estudos personalizado</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild>
                <Link href="/plano-estudos">Ver Plano Completo</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Progresso Geral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-muted stroke-current"
                        strokeWidth="10"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      />
                      <circle
                        className="text-primary stroke-current"
                        strokeWidth="10"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeDasharray={`${progressoGeral * 2.51} ${251 - progressoGeral * 2.51}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <span className="absolute text-3xl font-bold">{progressoGeral}%</span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">Seu progresso no plano de estudos</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Atividades de Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {atividadesHoje.map((atividade) => {
                    const concluida = atividadesConcluidas.includes(atividade.id);
                    return (
                      <div
                        key={atividade.id}
                        className={`flex items-center justify-between p-2 rounded-md ${concluida ? "bg-primary/10" : "bg-muted"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 rounded-full ${concluida ? "text-primary" : "text-muted-foreground"
                              }`}
                            onClick={() => marcarConcluida(atividade.id)}
                          >
                            <CheckCircle className={`h-5 w-5 ${concluida ? "fill-primary/20" : ""}`} />
                          </Button>
                          <div>
                            <p className={`font-medium ${concluida ? "line-through text-muted-foreground" : ""}`}>
                              {atividade.titulo}
                            </p>
                            <p className="text-xs text-muted-foreground">{atividade.disciplina}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{atividade.duracao}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/plano-estudos/hoje">
                    Ver todas as atividades
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Próximos Desafios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Desafio de Matemática</p>
                      <p className="text-sm text-muted-foreground">Resolva 10 questões em 15 minutos</p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Hoje</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-muted p-2 rounded-full">
                      <Brain className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Simulado Parcial</p>
                      <p className="text-sm text-muted-foreground">45 questões de múltipla escolha</p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Amanhã</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/desafios">
                    Ver todos os desafios
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Tabs defaultValue="desempenho" className="mb-8">
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
              <TabsTrigger value="desempenho">Desempenho</TabsTrigger>
              <TabsTrigger value="disciplinas">Disciplinas</TabsTrigger>
            </TabsList>

            <TabsContent value="desempenho" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Desempenho Semanal</CardTitle>
                    <CardDescription>Taxa de acertos nas atividades (%)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={desempenhoSemanal}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="dia" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip
                            formatter={(value) => [`${value}%`, 'Taxa de acertos']}
                            contentStyle={{
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))'
                            }}
                          />
                          <Bar dataKey="acertos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Distribuição de Estudos</CardTitle>
                    <CardDescription>Tempo dedicado por disciplina</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={distribuicaoEstudos}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {distribuicaoEstudos.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value}%`, 'Tempo dedicado']}
                            contentStyle={{
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="disciplinas" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progresso por Disciplina</CardTitle>
                  <CardDescription>Acompanhe seu avanço em cada matéria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {disciplinas.map((disciplina) => (
                      <div key={disciplina.nome} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: disciplina.cor }} />
                            <span className="font-medium">{disciplina.nome}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{disciplina.progresso}%</span>
                        </div>
                        <Progress value={disciplina.progresso} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/estatisticas">
                      Ver estatísticas detalhadas
                      <BarChart3 className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recomendações Personalizadas</CardTitle>
                <CardDescription>Com base no seu desempenho recente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Reforçar Leis de Newton</p>
                        <p className="text-sm text-muted-foreground">
                          Você teve dificuldades nas últimas questões sobre este tema. Recomendamos revisar os conceitos básicos.
                        </p>
                        <Button variant="link" className="px-0 h-auto" asChild>
                          <Link href="/conteudo/fisica/leis-newton">Ver material de revisão</Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Praticar Funções Trigonométricas</p>
                        <p className="text-sm text-muted-foreground">
                          Você está indo bem neste tema, mas mais prática ajudará a consolidar o conhecimento.
                        </p>
                        <Button variant="link" className="px-0 h-auto" asChild>
                          <Link href="/questoes/matematica/trigonometria">Resolver exercícios</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conquistas Recentes</CardTitle>
                <CardDescription>Seus últimos marcos alcançados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border rounded-lg bg-primary/5">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Mestre em Matemática Básica</p>
                      <p className="text-sm text-muted-foreground">
                        Completou 100 exercícios de matemática básica com mais de 80% de acertos.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Conquistado há 2 dias</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="bg-muted p-3 rounded-full">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">Estudante Consistente</p>
                      <p className="text-sm text-muted-foreground">
                        Completou atividades de estudo por 7 dias consecutivos.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Conquistado há 5 dias</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/conquistas">
                    Ver todas as conquistas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}