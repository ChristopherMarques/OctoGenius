import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCog, BookOpen, Trophy, BarChart3, Rocket, Target, Zap, Clock } from "lucide-react";

export function FeatureSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1400px]">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Por que escolher o OctoGenius.ai?</h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Nossa plataforma combina tecnologia avançada e metodologias pedagógicas para oferecer a melhor experiência de preparação para vestibulares.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <Card>
            <CardHeader>
              <BrainCog className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Inteligência Adaptativa</CardTitle>
              <CardDescription>
                Algoritmos que aprendem com você
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Nossa tecnologia analisa seu desempenho e adapta o plano de estudos em tempo real, priorizando os temas que você mais precisa revisar.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Diagnóstico Preciso</CardTitle>
              <CardDescription>
                Mapeamento detalhado de conhecimentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Testes diagnósticos identificam com precisão suas forças e fraquezas em cada disciplina, criando um ponto de partida personalizado.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Banco de Questões</CardTitle>
              <CardDescription>
                Milhares de exercícios categorizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Acesse questões de vestibulares anteriores e do ENEM, organizadas por tema, dificuldade e relevância para seu perfil de aprendizado.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Análise de Desempenho</CardTitle>
              <CardDescription>
                Estatísticas detalhadas e comparativas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Visualize seu progresso com gráficos intuitivos e compare seu desempenho com outros estudantes para identificar oportunidades de melhoria.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Trophy className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Gamificação</CardTitle>
              <CardDescription>
                Desafios e recompensas motivadoras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Mantenha-se motivado com um sistema de conquistas, rankings e recompensas que tornam o processo de estudo mais engajador e divertido.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Otimização do Tempo</CardTitle>
              <CardDescription>
                Estude de forma eficiente e produtiva
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Economize tempo com um plano que prioriza o que realmente importa, eliminando a necessidade de estudar conteúdos que você já domina.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Revisão Espaçada</CardTitle>
              <CardDescription>
                Técnica científica de memorização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Utilizamos o método de repetição espaçada para programar revisões nos momentos ideais, maximizando a retenção de conteúdo a longo prazo.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Rocket className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Simulados Realistas</CardTitle>
              <CardDescription>
                Prepare-se para o dia da prova
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Faça simulados que reproduzem o formato e o tempo das provas reais, desenvolvendo resistência mental e familiaridade com o ambiente de exame.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}