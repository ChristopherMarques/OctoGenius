'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Calendar, Clock, Download, FileText, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type StudyPlan = {
  id: string;
  name: string;
  start_date: string;
  status: string;
  created_at: string;
};

export default function StudyPlansPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);

  useEffect(() => {
    const fetchStudyPlans = async () => {
      try {
        const response = await fetch('/api/study-plans');
        if (!response.ok) {
          throw new Error('Erro ao carregar os planos de estudos');
        }
        const data = await response.json();
        setStudyPlans(data.studyPlans);
      } catch (error) {
        console.error('Erro:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os planos de estudos',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudyPlans();
  }, [toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1400px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Seus Planos de Estudos</h1>
              <p className="text-muted-foreground">Visualize e gerencie todos os seus planos de estudos</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => router.push('/diagnostic')}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Novo Plano
              </Button>
            </div>
          </div>

          {studyPlans.length === 0 ? (
            <Card className="text-center p-8">
              <CardHeader>
                <CardTitle>Nenhum plano de estudos encontrado</CardTitle>
                <CardDescription>Você ainda não possui planos de estudos criados</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6">Faça um teste diagnóstico para gerar seu primeiro plano de estudos personalizado.</p>
                <Button onClick={() => router.push('/diagnostic')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Meu Primeiro Plano
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyPlans.map((plan) => (
                <Card key={plan.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>Início: {formatDate(plan.start_date)}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Clock className="h-4 w-4" />
                      <span>Criado em {formatDate(plan.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        plan.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {plan.status === 'active' ? 'Ativo' : 'Concluído'}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-3 flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/plano-estudos/${plan.id}`)}>
                      Ver Detalhes
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      // Implementar download do PDF
                      router.push(`/api/download-study-plan?studyPlanId=${plan.id}`);
                    }}>
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}