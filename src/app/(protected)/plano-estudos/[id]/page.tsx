'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Calendar, Clock, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type StudyPlanData = {
  resumo: string;
  objetivos: { materia: string; objetivo: string }[];
  cronograma: {
    semana: number;
    sessoes: {
      dia: string;
      materia: string;
      topico: string;
      duracao: string;
      prioridade: string;
    }[];
  }[];
  recursos: { materia: string; recursos: string[] }[];
  estrategias: { materia: string; estrategia: string }[];
};

export default function StudyPlanPage() {
  const paramsObj = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [studyPlan, setStudyPlan] = useState<StudyPlanData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Acessar os valores de params no Next.js 15
  const id = paramsObj.id;

  useEffect(() => {
    const fetchStudyPlan = async () => {
      try {
        const response = await fetch(`/api/study-plan/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao carregar o plano de estudos');
        }
        const data = await response.json();
        setStudyPlan(data.studyPlanData);
      } catch (error) {
        console.error('Erro:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o plano de estudos',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchStudyPlan();
    }
  }, [id, toast]);

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch('/api/download-study-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studyPlanId: id }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar PDF');
      }

      const data = await response.json();
      
      // Criar um link para download
      const link = document.createElement('a');
      link.href = data.pdfBase64;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Sucesso',
        description: 'Plano de estudos baixado com sucesso',
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível baixar o plano de estudos',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-8 sm:py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1400px]">
            <div className="flex justify-center items-center h-[60vh]">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-64 bg-muted rounded-md mb-4"></div>
                <div className="h-6 w-48 bg-muted rounded-md"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!studyPlan) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-8 sm:py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1400px]">
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <h2 className="text-2xl font-bold mb-4">Plano de estudos não encontrado</h2>
              <p className="text-muted-foreground mb-6">Não foi possível encontrar o plano de estudos solicitado.</p>
              <Button onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o Dashboard
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1400px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Seu Plano de Estudos Personalizado</h1>
              <p className="text-muted-foreground">Baseado no seu diagnóstico de conhecimento</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button onClick={handleDownloadPDF} disabled={isDownloading}>
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? 'Baixando...' : 'Baixar PDF'}
              </Button>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Resumo do Plano</CardTitle>
              <CardDescription>Análise do seu desempenho e foco do plano de estudos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{studyPlan.resumo}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="cronograma" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
              <TabsTrigger value="objetivos">Objetivos</TabsTrigger>
              <TabsTrigger value="recursos">Recursos</TabsTrigger>
            </TabsList>

            <TabsContent value="cronograma" className="mt-6">
              <div className="space-y-6">
                {studyPlan.cronograma.map((semana) => (
                  <Card key={semana.semana}>
                    <CardHeader>
                      <CardTitle>Semana {semana.semana}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {semana.sessoes.map((sessao, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${
                                  sessao.prioridade === 'alta' ? 'bg-red-100 text-red-600' :
                                  sessao.prioridade === 'média' ? 'bg-yellow-100 text-yellow-600' :
                                  'bg-green-100 text-green-600'
                                }`}>
                                  <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-medium">{sessao.topico}</p>
                                  <p className="text-sm text-muted-foreground">{sessao.materia}</p>
                                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {sessao.dia}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {sessao.duracao}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  sessao.prioridade === 'alta' ? 'bg-red-100 text-red-600' :
                                  sessao.prioridade === 'média' ? 'bg-yellow-100 text-yellow-600' :
                                  'bg-green-100 text-green-600'
                                }`}>
                                  Prioridade {sessao.prioridade}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="objetivos" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Objetivos de Aprendizagem</CardTitle>
                  <CardDescription>Metas específicas para cada matéria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studyPlan.objetivos.map((objetivo, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{objetivo.materia}</p>
                            <p className="text-sm">{objetivo.objetivo}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recursos" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recursos Recomendados</CardTitle>
                    <CardDescription>Materiais para aprofundar seus estudos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studyPlan.recursos.map((recurso, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">{recurso.materia}</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {recurso.recursos.map((item, i) => (
                              <li key={i} className="text-sm">{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Estratégias de Estudo</CardTitle>
                    <CardDescription>Técnicas personalizadas para cada matéria</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studyPlan.estrategias.map((estrategia, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">{estrategia.materia}</h3>
                          <p className="text-sm">{estrategia.estrategia}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}