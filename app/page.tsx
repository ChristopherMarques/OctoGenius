import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCog, BookOpen, Trophy, BarChart3, Rocket } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { FeatureSection } from "@/components/feature-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        
        <section className="py-12 px-4 md:px-6 bg-muted/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Como funciona o OctoGenius.ai</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 border-primary/20 hover:border-primary/50 transition-all">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <BrainCog className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Diagnóstico Inicial</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Realize um teste diagnóstico para mapearmos seu nível de conhecimento em cada disciplina e criar um plano personalizado.</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-primary/20 hover:border-primary/50 transition-all">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Plano Adaptativo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Receba um cronograma de estudos que se adapta ao seu desempenho, priorizando áreas que precisam de mais atenção.</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-primary/20 hover:border-primary/50 transition-all">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Evolua e Conquiste</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Acompanhe seu progresso, participe de desafios e ganhe recompensas enquanto se prepara para o sucesso nos vestibulares.</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <Link href="/cadastro">Comece Agora</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 px-4 md:px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Explore Nossos Recursos</h2>
            
            <Tabs defaultValue="plano" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="plano">Plano de Estudos</TabsTrigger>
                <TabsTrigger value="questoes">Banco de Questões</TabsTrigger>
                <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="plano" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Plano de Estudos Personalizado</CardTitle>
                    <CardDescription>
                      Cronograma adaptativo que evolui com você
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Rocket className="h-5 w-5 mr-2 text-primary" />
                          Inteligência Adaptativa
                        </h4>
                        <p className="text-muted-foreground">
                          Nossos algoritmos ajustam seu plano de estudos com base no seu desempenho, focando nas áreas que precisam de mais atenção.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <BookOpen className="h-5 w-5 mr-2 text-primary" />
                          Revisões Estratégicas
                        </h4>
                        <p className="text-muted-foreground">
                          O sistema programa revisões periódicas dos temas com maior índice de erro, garantindo que você fixe o conteúdo.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href="/cadastro">Criar Meu Plano</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="questoes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Banco de Questões Abrangente</CardTitle>
                    <CardDescription>
                      Milhares de questões de vestibulares e ENEM
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <BookOpen className="h-5 w-5 mr-2 text-primary" />
                          Questões Reais
                        </h4>
                        <p className="text-muted-foreground">
                          Pratique com questões de provas anteriores dos principais vestibulares e ENEM, organizadas por tema e nível de dificuldade.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <BrainCog className="h-5 w-5 mr-2 text-primary" />
                          Recomendações Inteligentes
                        </h4>
                        <p className="text-muted-foreground">
                          Receba sugestões de questões personalizadas com base no seu histórico de acertos e erros.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href="/cadastro">Acessar Questões</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="estatisticas" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas Detalhadas</CardTitle>
                    <CardDescription>
                      Acompanhe sua evolução com dados precisos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                          Análise de Desempenho
                        </h4>
                        <p className="text-muted-foreground">
                          Visualize gráficos e relatórios que mostram sua evolução em cada disciplina e tema ao longo do tempo.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Trophy className="h-5 w-5 mr-2 text-primary" />
                          Comparação Competitiva
                        </h4>
                        <p className="text-muted-foreground">
                          Compare seu desempenho com outros estudantes e veja onde você se posiciona em relação à média geral.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href="/cadastro">Ver Estatísticas</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}