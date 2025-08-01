import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'; // <-- MUDANÇA 1: Importação direta
import { readFileSync } from "fs";
import path from "path";

// Defina uma interface para a tipagem do autoTable, embora a chamada direta não a necessite mais.
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
  lastAutoTable: { finalY: number };
}

let LOGO_BASE_64 = "";
try {
  const filePath = path.resolve(process.cwd(), "src/assets/logos/logo-chat.png");
  const imageBuffer = readFileSync(filePath);
  LOGO_BASE_64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;
} catch (error) {
  console.error("Erro ao carregar o logo:", error);
}

const downloadStudyPlanSchema = z.object({
  studyPlanId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Autenticação e Validação
    const session = await getServerSession();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("id, full_name") // Ajuste para corresponder à sua estrutura de tabela
      .eq("email", email)
      .single();

    if (!userData) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }
    const userId = userData.id;
    const userName = userData.full_name; // Ajuste para corresponder à sua estrutura de tabela
    
    const { studyPlanId } = downloadStudyPlanSchema.parse(await req.json());

    // 2. Buscar o plano de estudos com validação em duas etapas
    const { data: studyPlan, error: planError } = await supabaseAdmin
      .from("study_plans")
      .select("*")
      .eq("id", studyPlanId)
      .single();

    if (planError || !studyPlan) {
      return NextResponse.json({ error: "Plano de estudos não encontrado." }, { status: 404 });
    }

    if (studyPlan.user_id !== userId) {
      return NextResponse.json({ error: "Você não tem permissão para acessar este plano." }, { status: 403 });
    }
    
    const dayOrder: { [key: string]: number } = { "Segunda-feira": 1, "Terça-feira": 2, "Quarta-feira": 3, "Quinta-feira": 4, "Sexta-feira": 5, "Sábado": 6, "Domingo": 7 };

    const { data: studySessions, error: sessionsError } = await supabaseAdmin
      .from("study_sessions")
      .select("*, subject:subjects(name)")
      .eq("study_plan_id", studyPlanId);

    if (sessionsError) {
      return NextResponse.json({ error: "Erro ao buscar sessões de estudo" }, { status: 500 });
    }

    studySessions.sort((a, b) => {
      if (a.week !== b.week) {
        return (a.week || 0) - (b.week || 0);
      }
      return (dayOrder[a.day_of_week || ''] || 99) - (dayOrder[b.day_of_week || ''] || 99);
    });

    // 3. Gerar o PDF Profissional
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 0;

    // --- PÁGINA 1: CAPA E DICAS ---
    if(LOGO_BASE_64) doc.addImage(LOGO_BASE_64, 'PNG', 15, 15, 25, 25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(33, 33, 33);
    doc.text("Seu Plano de Estudos Personalizado", pageWidth / 2, 28, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Preparado para: ${userName || 'Estudante Dedicado(a)'}`, pageWidth / 2, 36, { align: "center" });
    yPosition = 55;

    if (studyPlan.welcome_message) {
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      const welcomeText = doc.splitTextToSize(studyPlan.welcome_message, pageWidth - 40);
      doc.text(welcomeText, 20, yPosition);
      yPosition += (welcomeText.length * 5) + 15;
    }

    if (studyPlan.study_tips && Array.isArray(studyPlan.study_tips) && studyPlan.study_tips.length > 0) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(33, 33, 33);
      doc.text("Dicas de Ouro para seus Estudos", 20, yPosition);
      yPosition += 10;
      
      doc.setFont("helvetica", "normal");
      studyPlan.study_tips.forEach((tip: any) => {
        if (yPosition > pageHeight - 30) { doc.addPage(); yPosition = 20; }
        doc.setFontSize(12).setFont("helvetica", 'bold');
        doc.text(`• ${tip.tip}:`, 25, yPosition);
        doc.setFontSize(11).setFont("helvetica", 'normal');
        const tipDescription = doc.splitTextToSize(tip.description, pageWidth - 55);
        doc.text(tipDescription, 30, yPosition + 6);
        yPosition += (tipDescription.length * 5) + 8;
      });
    }

    doc.addPage();
    yPosition = 20;

    const sessionsByWeek = studySessions.reduce((acc, session) => {
      const week = session.week || 1;
      if (!acc[week]) acc[week] = [];
      acc[week].push(session);
      return acc;
    }, {} as Record<number, typeof studySessions>);
    
    Object.keys(sessionsByWeek).forEach(weekNumberStr => {
      const weekNumber = parseInt(weekNumberStr, 10);
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(33, 33, 33);
      doc.text(`Cronograma da Semana ${weekNumber}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      const tableData = sessionsByWeek[weekNumber].map(s => [
        s.day_of_week || '',
        s.subject?.name || 'N/A',
        s.topic || '',
        `${s.duration_minutes} min`,
        s.activity || '',
        s.resources || ''
      ]);
      
      // <-- MUDANÇA 2: Chamada direta da função autoTable
      autoTable(doc, {
        startY: yPosition,
        head: [["Dia", "Matéria", "Tópico", "Duração", "Atividade", "Fontes Sugeridas"]],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [63, 81, 181] },
        styles: { fontSize: 9, cellPadding: 2.5 },
        columnStyles: {
          0: { cellWidth: 25 }, 1: { cellWidth: 25 }, 2: { cellWidth: 'auto' },
          3: { cellWidth: 18 }, 4: { cellWidth: 'auto' }, 5: { cellWidth: 35 },
        },
        didDrawPage: (data) => {
          yPosition = data.cursor?.y || 20;
        }
      });
      
      yPosition = doc.lastAutoTable.finalY + 15;
    });

    // --- FUNÇÃO DE RODAPÉ (Corrigida) ---
    const pageCount = doc.internal.getNumberOfPages(); // <-- MUDANÇA 3
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `OctoGenius.ai - Seu Plano para o Sucesso | Página ${i} de ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }
    
    // 4. Retornar o PDF em Base64
    const pdfBase64 = doc.output('datauristring');
    
    return NextResponse.json({
      pdfBase64,
      fileName: `plano-de-estudos-octogenius-${studyPlanId.substring(0, 8)}.pdf`
    });

  } catch (error: any) {
    console.error("Erro na API download-study-plan:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro interno ao gerar o PDF.", details: error.message },
      { status: 500 }
    );
  }
}