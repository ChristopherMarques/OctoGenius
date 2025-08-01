import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

// Zod Schema para validação
const downloadStudyPlanSchema = z.object({
  studyPlanId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Autenticação e Validação
    const session = await getServerSession();
    const email = session?.user?.email;

    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!userData) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const userId = userData.id;

    const body = await req.json();
    const validation = downloadStudyPlanSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validation.error.errors },
        { status: 400 }
      );
    }
    const { studyPlanId } = validation.data;

    // 2. Buscar o plano de estudos
    const { data: studyPlan, error: planError } = await supabaseAdmin
      .from("study_plans")
      .select("*")
      .eq("id", studyPlanId)
      .eq("user_id", userId)
      .single();

    if (planError || !studyPlan) {
      return NextResponse.json(
        { error: "Plano de estudos não encontrado" },
        { status: 404 }
      );
    }

    // 3. Buscar as sessões de estudo
    const { data: studySessions, error: sessionsError } = await supabaseAdmin
      .from("study_sessions")
      .select("*, subject:subject_id(name)")
      .eq("study_plan_id", studyPlanId)
      .order("scheduled_date", { ascending: true });

    if (sessionsError) {
      return NextResponse.json(
        { error: "Erro ao buscar sessões de estudo" },
        { status: 500 }
      );
    }

    // 4. Gerar o PDF
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text("Plano de Estudos Personalizado", 105, 20, { align: "center" });
    
    // Informações do plano
    doc.setFontSize(12);
    doc.text(`Nome: ${studyPlan.name}`, 20, 40);
    doc.text(`Data de início: ${new Date(studyPlan.start_date).toLocaleDateString('pt-BR')}`, 20, 50);
    
    // Organizar sessões por semana
    const sessionsByWeek = {};
    const startDate = new Date(studyPlan.start_date);
    
    studySessions.forEach((session) => {
      const sessionDate = new Date(session.scheduled_date);
      const diffTime = Math.abs(sessionDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weekNumber = Math.floor(diffDays / 7) + 1;
      
      if (!sessionsByWeek[weekNumber]) {
        sessionsByWeek[weekNumber] = [];
      }
      
      sessionsByWeek[weekNumber].push(session);
    });
    
    // Adicionar tabelas por semana
    let yPosition = 60;
    
    Object.keys(sessionsByWeek).forEach((weekNumber) => {
      // Título da semana
      doc.setFontSize(14);
      doc.text(`Semana ${weekNumber}`, 20, yPosition);
      yPosition += 10;
      
      // Tabela de sessões
      const tableData = sessionsByWeek[weekNumber].map((session) => [
        new Date(session.scheduled_date).toLocaleDateString('pt-BR'),
        session.subject?.name || "Matéria não especificada",
        `${session.duration_minutes} minutos`,
        session.status === "completed" ? "Concluída" : "Pendente"
      ]);
      
      // @ts-ignore - jspdf-autotable não está tipado corretamente
      doc.autoTable({
        startY: yPosition,
        head: [["Data", "Matéria", "Duração", "Status"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        margin: { top: 10 }
      });
      
      // @ts-ignore - jspdf-autotable não está tipado corretamente
      yPosition = doc.lastAutoTable.finalY + 15;
      
      // Verificar se precisa adicionar nova página
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    // Rodapé
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `OctoGenius.ai - Plano de Estudos - Página ${i} de ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }
    
    // Converter para base64
    const pdfBase64 = doc.output('datauristring');
    
    return NextResponse.json({
      pdfBase64,
      fileName: `plano-estudos-${studyPlanId.substring(0, 8)}.pdf`
    });

  } catch (error: any) {
    console.error("Erro na API download-study-plan:", error);
    return NextResponse.json(
      { error: error.message || "Ocorreu um erro interno no servidor." },
      { status: 500 }
    );
  }
}