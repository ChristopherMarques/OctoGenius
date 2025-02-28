"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Search, Filter, BookOpen, CheckCircle, XCircle, ArrowRight, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dados simulados para o banco de questões
const disciplinas = [
  { id: "matematica", nome: "Matemática" },
  { id: "portugues", nome: "Português" },
  { id: "fisica", nome: "Física" },
  { id: "quimica", nome: "Química" },
  { id: "biologia", nome: "Biologia" },
  { id: "historia", nome: "História" },
  { id: "geografia", nome: "Geografia" }
];

const questoes = [
  {
    id: 1,
    disciplina: "Matemática",
    tema: "Funções",
    subtema: "Funções Trigonométricas",
    enunciado: "Se f(x) = 2sen(x) + cos(x), então f(π/4) é igual a:",
    alternativas: [
      { id: "a", texto: "√2" },
      { id: "b", texto: "2√2" },
      { id: "c", texto: "1 + √2" },
      { id: "d", texto: "2 - √2" },
      { id: "e", texto: "√2 + 1/√2" }
    ],
    resposta: "e",
    dificuldade: "Médio",
    vestibular: "ENEM",
    ano: 2019
  },
  {
    id: 2,
    disciplina: "Física",
    tema: "Mecânica",
    subtema: "Leis de Newton",
    enunciado: "Um bloco de massa 2 kg está em repouso sobre uma superfície horizontal sem atrito. Uma força horizontal constante de 4 N é aplicada ao bloco. Qual será a velocidade do bloco após 3 segundos?",
    alternativas: [
      { id: "a", texto: "2 m/s" },
      { id: "b", texto: "4 m/s" },
      { id: "c", texto: "6 m/s" },
      { id: "d", texto: "8 m/s" },
      { id: "e", texto: "12 m/s" }
    ],
    resposta: "c",
    dificuldade: "Fácil",
    vestibular: "FUVEST",
    ano: 2020
  },
  {
    id: 3,
    disciplina: "Português",
    tema: "Gramática",
    subtema: "Análise Sintática",
    enunciado: "Assinale a alternativa em que a oração subordinada substantiva está corretamente classificada:",
    alternativas: [
      { id: "a", texto: "\"Desejo que você seja feliz.\" (objetiva direta)" },
      { id: "b", texto: "\"Tenho medo de que ele não venha.\" (completiva nominal)" },
      { id: "c", texto: "\"A verdade é que ele não estudou.\" (predicativa)" },
      { id: "d", texto: "\"Lembro-me de que éramos felizes.\" (objetiva indireta)" },
      { id: "e", texto: "\"Ele correu tanto que ficou cansado.\" (subjetiva)" }
    ],
    resposta: "a",
    dificuldade: "Difícil",
    vestibular: "UNICAMP",
    ano: 2021
  },
  {
    id: 4,
    disciplina: "Química",
    tema: "Físico-Química",
    subtema: "Equilíbrio Químico",
    enunciado: "Em um recipiente fechado, estabeleceu-se o seguinte equilíbrio: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + calor. Assinale a alternativa que indica corretamente o que ocorre quando se aumenta a pressão do sistema:",
    alternativas: [
      { id: "a", texto: "O equilíbrio se desloca para a esquerda, diminuindo a produção de NH₃." },
      { id: "b", texto: "O equilíbrio se desloca para a direita, aumentando a produção de NH₃." },
      { id: "c", texto: "O equilíbrio não é afetado pela variação de pressão." },
      { id: "d", texto: "A constante de equilíbrio aumenta." },
      { id: "e", texto: "A velocidade da reação diminui." }
    ],
    resposta: "b",
    dificuldade: "Médio",
    vestibular: "ENEM",
    ano: 2018
  },
  {
    id: 5,
    disciplina: "Biologia",
    tema: "Genética",
    subtema: "Primeira Lei de Mendel",
    enunciado: "Em ervilhas, a cor amarela das sementes é dominante sobre a cor verde. Do cruzamento entre plantas heterozigóticas para essa característica, a proporção esperada de plantas com sementes amarelas é:",
    alternativas: [
      { id: "a", texto: "1/4" },
      { id: "b", texto: "1/2" },
      { id: "c", texto: "2/3" },
      { id: "d", texto: "3/4" },
      { id: "e", texto: "1/1" }
    ],
    resposta: "d",
    dificuldade: "Médio",
    vestibular: "FUVEST",
    ano: 2019
  }
];

export default function QuestoesPage() {
  const { toast } = useToast();
  const [filtro, setFiltro] = useState({
    disciplina: "",
    dificuldade: "",
    vestibular: "",
    busca: ""
  });
  
  const [questaoAtual, setQuestaoAtual] = useState<number | null>(null);
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(null);
  const [respostaEnviada, setRespostaEnviada] = useState(false);
  
  const questoesFiltradas = questoes.filter(questao => {
    return (
      (filtro.disciplina === "" || questao.disciplina === filtro.disciplina) &&
      (filtro.dificuldade === "" || questao.dificuldade === filtro.dificuldade) &&
      (filtro.vestibular === "" || questao.vestibular === filtro.vestibular) &&
      (filtro.busca === "" || 
        questao.enunciado.toLowerCase().includes(filtro.busca.toLowerCase()) ||
        questao.tema.toLowerCase().includes(filtro.busca.toLowerCase()) ||
        questao.subtema.toLowerCase().includes(filtro.busca.toLowerCase()))
    );
  });
  
  const abrirQuestao = (id: number) => {
    setQuestaoAtual(id);
    setRespostaSelecionada(null);
    setRespostaEnviada(false);
  };
  
  const fecharQuestao = () => {
    setQuestaoAtual(null);
    setRespostaSelecionada(null);
    setRespostaEnviada(false);
  };
  
  const verificarResposta = () => {
    if (!respostaSelecionada) return;
    
    setRespostaEnviada(true);
    
    const questao = questoes.find(q => q.id === questaoAtual);
    const correta = questao?.resposta === respostaSelecionada;
    
    toast({
      title: correta ? "Resposta correta!" : "Resposta incorreta",
      description: correta 
        ? "Parabéns! Você acertou a questão." 
        : `A resposta correta é a alternativa ${questao?.resposta.toUpperCase()}.`,
      variant: correta ? "default" : "destructive",
    });
  };
  
  const questaoSelecionada = questoes.find(q => q.id === questaoAtual);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Banco de Questões</h1>
              <p className="text-muted-foreground">Pratique com questões de vestibulares e ENEM</p>
            </div>
          </div>
          
          {questaoAtual === null ? (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Filtros</CardTitle>
                  <CardDescription>
                    Encontre questões específicas para praticar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <Label htmlFor="disciplina">Disciplina</Label>
                      <Select 
                        value={filtro.disciplina} 
                        onValueChange={(value) => setFiltro({...filtro, disciplina: value})}
                      >
                        <SelectTrigger id="disciplina">
                          <SelectValue placeholder="Todas as disciplinas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todas as disciplinas</SelectItem>
                          {disciplinas.map(disc => (
                            <SelectItem key={disc.id} value={disc.nome}>{disc.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="dificuldade">Dificuldade</Label>
                      <Select 
                        value={filtro.dificuldade} 
                        onValueChange={(value) => setFiltro({...filtro, dificuldade: value})}
                      >
                        <SelectTrigger id="dificuldade">
                          <SelectValue placeholder="Qualquer dificuldade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Qualquer dificuldade</SelectItem>
                          <SelectItem value="Fácil">Fácil</SelectItem>
                          <SelectItem value="Médio">Médio</SelectItem>
                          <SelectItem value="Difícil">Difícil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="vestibular">Vestibular</Label>
                      <Select 
                        value={filtro.vestibular} 
                        onValueChange={(value) => setFiltro({...filtro, vestibular: value})}
                      >
                        <SelectTrigger id="vestibular">
                          <SelectValue placeholder="Todos os vestibulares" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos os vestibulares</SelectItem>
                          <SelectItem value="ENEM">ENEM</SelectItem>
                          <SelectItem value="FUVEST">FUVEST</SelectItem>
                          <SelectItem value="UNICAMP">UNICAMP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="busca">Busca</Label>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="busca"
                          placeholder="Buscar por tema ou conteúdo"
                          className="pl-8"
                          value={filtro.busca}
                          onChange={(e) => setFiltro({...filtro, busca: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questoesFiltradas.length > 0 ? (
                  questoesFiltradas.map(questao => (
                    <Card key={questao.id} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => abrirQuestao(questao.id)}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <BookOpen className="h-4 w-4 text-primary" />
                            </div>
                            <CardTitle className="text-lg">{questao.disciplina}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                              {questao.dificuldade}
                            </span>
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                              {questao.vestibular} {questao.ano}
                            </span>
                          </div>
                        </div>
                        <CardDescription>
                          {questao.tema} - {questao.subtema}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-3 text-sm">
                          {questao.enunciado}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" size="sm" className="w-full" onClick={() => abrirQuestao(questao.id)}>
                          Resolver questão
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">Nenhuma questão encontrada com os filtros selecionados.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setFiltro({disciplina: "", dificuldade: "", vestibular: "", busca: ""})}
                    >
                      Limpar filtros
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        {questaoSelecionada?.disciplina}
                      </span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        {questaoSelecionada?.tema} - {questaoSelecionada?.subtema}
                      </span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        {questaoSelecionada?.dificuldade}
                      </span>
                    </div>
                    <CardTitle>Questão {questaoSelecionada?.id}</CardTitle>
                    <CardDescription>
                      {questaoSelecionada?.vestibular} {questaoSelecionada?.ano}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={fecharQuestao}>
                    Voltar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border rounded-md bg-muted/30">
                    <p className="whitespace-pre-line">{questaoSelecionada?.enunciado}</p>
                  </div>
                  
                  <RadioGroup
                    value={respostaSelecionada || ""}
                    onValueChange={setRespostaSelecionada}
                    className="space-y-4"
                    disabled={respostaEnviada}
                  >
                    {questaoSelecionada?.alternativas.map((alternativa) => {
                      const isCorrect = respostaEnviada && alternativa.id === questaoSelecionada.resposta;
                      const isIncorrect = respostaEnviada && respostaSelecionada === alternativa.id && alternativa.id !== questaoSelecionada.resposta;
                      
                      return (
                        <div 
                          key={alternativa.id} 
                          className={`flex items-start space-x-2 border p-4 rounded-md transition-colors ${
                            isCorrect ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" :
                            isIncorrect ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800" :
                            "hover:bg-muted/50"
                          }`}
                        >
                          <RadioGroupItem 
                            value={alternativa.id} 
                            id={`alternativa-${alternativa.id}`} 
                            className={isCorrect ? "text-green-600" : isIncorrect ? "text-red-600" : ""}
                          />
                          <Label 
                            htmlFor={`alternativa-${alternativa.id}`} 
                            className="flex-1 cursor-pointer flex justify-between items-start"
                          >
                            <span>
                              <span className="font-semibold">{alternativa.id.toUpperCase()})</span> {alternativa.texto}
                            </span>
                            {isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                            {isIncorrect && <XCircle className="h-5 w-5 text-red-600" />}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={fecharQuestao}>
                  Voltar para a lista
                </Button>
                <Button 
                  onClick={verificarResposta} 
                  disabled={!respostaSelecionada || respostaEnviada}
                >
                  {respostaEnviada ? "Resposta enviada" : "Verificar resposta"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}