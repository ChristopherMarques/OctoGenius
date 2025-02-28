import Link from "next/link";
import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1400px] py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">OctoGenius.ai</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Plataforma adaptativa de estudos para vestibulares e ENEM, com planos personalizados e inteligência artificial.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/plano-estudos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Plano de Estudos
                </Link>
              </li>
              <li>
                <Link href="/questoes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Banco de Questões
                </Link>
              </li>
              <li>
                <Link href="/estatisticas" className="text-muted-foreground hover:text-foreground transition-colors">
                  Estatísticas
                </Link>
              </li>
              <li>
                <Link href="/desafios" className="text-muted-foreground hover:text-foreground transition-colors">
                  Desafios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Vestibulares</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/enem" className="text-muted-foreground hover:text-foreground transition-colors">
                  ENEM
                </Link>
              </li>
              <li>
                <Link href="/fuvest" className="text-muted-foreground hover:text-foreground transition-colors">
                  FUVEST
                </Link>
              </li>
              <li>
                <Link href="/unicamp" className="text-muted-foreground hover:text-foreground transition-colors">
                  UNICAMP
                </Link>
              </li>
              <li>
                <Link href="/outros-vestibulares" className="text-muted-foreground hover:text-foreground transition-colors">
                  Outros Vestibulares
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sobre" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} OctoGenius.ai. Todos os direitos reservados.
          </p>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Instagram
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}