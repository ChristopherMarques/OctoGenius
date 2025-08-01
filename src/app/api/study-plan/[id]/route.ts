import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getServerSession } from 'next-auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
     // 1. Autenticação e Validação
    const session = await getServerSession();
    const email = session?.user?.email;

    const { data } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    console.log("usuario", data);
    if (!data) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const userId = data.id;

    // Usar await params para acessar propriedades no Next.js 15
    const { id: planId } = await params;

    // Validar o ID do plano
    if (!planId) {
      return NextResponse.json(
        { error: 'ID do plano de estudos não fornecido' },
        { status: 400 }
      );
    }

    // Buscar o plano de estudos
    const { data: studyPlan, error: planError } = await supabaseAdmin
      .from('study_plans')
      .select('*, study_sessions(*)')
      .eq('id', planId)
      .single();

    if (planError) {
      return NextResponse.json(
        { error: 'Erro ao buscar plano de estudos' },
        { status: 500 }
      );
    }

    // Verificar se o plano existe e pertence ao usuário
    if (!studyPlan || studyPlan.user_id !== userId) {
      return NextResponse.json(
        { error: 'Plano de estudos não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      studyPlan,
    });
  } catch (error) {
    console.error('Erro ao buscar plano de estudos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar plano de estudos' },
      { status: 500 }
    );
  }
}