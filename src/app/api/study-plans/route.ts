import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  try {
    // 1. Autenticação
    const session = await getServerSession();
    const email = session?.user?.email;

    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!userData) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const userId = userData.id;

    // 2. Buscar todos os planos de estudos do usuário
    const { data: studyPlans, error: plansError } = await supabaseAdmin
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (plansError) {
      return NextResponse.json(
        { error: 'Erro ao buscar planos de estudos' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      studyPlans,
    });
  } catch (error: any) {
    console.error('Erro na API study-plans:', error);
    return NextResponse.json(
      { error: error.message || 'Ocorreu um erro interno no servidor.' },
      { status: 500 }
    );
  }
}