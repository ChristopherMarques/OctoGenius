"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// Dados simulados para estatísticas
const desempenhoMensal = [
  { mes: "Jan", acertos: 65 },
  { mes: "Fev", acertos: 70 },
  { mes: "Mar", acertos: 68 },
  { mes: "Abr", acertos: 72 },
  { mes: "Mai", acertos: 75 },
  { mes: "Jun", acertos: 78 },
  { mes: "Jul", acertos: 82 },
  { mes: "Ago", acertos: 85 }
];

const desempenhoPorDisciplina = [
  { disciplina: "Matemática", acertos: 75, media: 68 },
  { disciplina: "Português", acertos: 82, media: 70 },
  { disciplina: "Física", acertos: 65, media: 62 },
  { disciplina: "Química", acertos: 70, media: 65 },
  { disciplina: "Biologia", acertos: 78, media: 72 }
];

const distribuicaoErros = [
  { name: "Funções", value: 25 },
  { name: "Geometria", value: 15 },
  { name: "Álgebra", value: 10 },
  { name: "Trigonometria", value: 30 },
  { name: "Estatística", value: 20 }
];

const tempoEstudo = [
  { dia: "Seg", horas: 2.5 },
  { dia: "Ter", horas: 3.0 },
  { dia: "Qua", horas: 2.0 },
  { dia: "Qui", horas: 3.5 },
  { dia: "Sex", horas: 2.5 },
  { dia: "Sáb", horas: 4.0 },
  { dia: "Dom", horas: 1.0 }
];

const habilidades = [
  { subject: "Interpretação", A: 80, B: 70 },
  { subject: "Cálculo", A: 65, B: 60 },
  { subject: "Memorização", A: 75, B: 68 },
  { subject: "Raciocínio Lógico", A: 85, B: 72 },
  { subject: "Resolução de Problemas", A: 78, B: 70 }
];

const CORES = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function EstatisticasPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Estatísticas de Desempenho</h1>
            <p className="text-muted-foreground">Acompanhe sua evolução e identifique áreas para melhorar</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Taxa de Acertos</CardTitle>
                <CardDescription>Média geral</CardDescription>
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
                        strokeDasharray="201 251"
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <span className="absolute text-3xl font-bold">80%</span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">Sua taxa de acertos nas últimas 100 questões</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tempo de Estudo</CardTitle>
                <CardDescription>Total semanal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="text-4xl font-bold">18.5</div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">Horas de estudo nos últimos 7 dias</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Posição no Ranking</CardTitle>
                <CardDescription>Entre todos os usuários</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="text-4xl font-bold">127</div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">Você está entre os 10% melhores</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="desempenho" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
              <TabsTrigger value="desempenho">Desempenho</TabsTrigger>
              <TabsTrigger value="disciplinas">Disciplinas</TabsTrigger>
              <TabsTrigger value="tempo">Tempo de Estudo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="desempenho" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Evolução Mensal</CardTitle>
                    <CardDescription>Taxa de acertos ao longo dos meses (%)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={desempenhoMensal}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="mes" />
                          <YAxis domain={[50, 100]} />
                          <Tooltip 
                            formatter={(value) => [`${value}%`, 'Taxa de acertos']}
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="acertos" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Distribuição de Erros</CardTitle>
                    <CardDescription>Temas com maior índice de erro em Matemática</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={distribuicaoErros}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {distribuicaoErros.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value}%`, 'Porcentagem de erros']}
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))'
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Análise de Habilidades</CardTitle>
                    <CardDescription>Comparação entre você e a média dos usuários</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={habilidades}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar 
                            name="Você" 
                            dataKey="A" 
                            stroke="hsl(var(--primary))" 
                            fill="hsl(var(--primary))" 
                            fillOpacity={0.2} 
                          />
                          <Radar 
                            name="Média" 
                            dataKey="B" 
                            stroke="hsl(var(--muted-foreground))" 
                            fill="hsl(var(--muted-foreground))" 
                            fillOpacity={0.2} 
                          />
                          <Legend />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))'
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="disciplinas" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Desempenho por Disciplina</CardTitle>
                  <CardDescription>Comparação entre seu desempenho e a média geral</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={desempenhoPorDisciplina} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="disciplina" type="category" width={100} />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, '']}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))'
                          }}
                        />
                        <Legend />
                        <Bar 
                          dataKey="acertos" 
                          name="Seu desempenho" 
                          fill="hsl(var(--primary))" 
                          radius={[0, 4, 4, 0]} 
                        />
                        <Bar 
                          dataKey="media" 
                          name="Média geral" 
                          fill="hsl(var(--muted-foreground))" 
                          radius={[0, 4, 4, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tempo" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tempo de Estudo Semanal</CardTitle>
                  <CardDescription>Horas dedicadas por dia da semana</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={tempoEstudo}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="dia" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} horas`, 'Tempo de estudo']}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))'
                          }}
                        />
                        <Bar 
                          dataKey="horas" 
                          fill="hsl(var(--primary))" 
                          radius={[4, 4, 0, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}