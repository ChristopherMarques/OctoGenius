import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
  if (req.method === "POST") {
    const { user_id, plan_id } = await req.json();

    if (!user_id || !plan_id) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .insert([{ user_id, plan_id, status: "active" }]);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(
      { message: "Assinatura realizada com sucesso", data },
      { status: 200 }
    );
  }

  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}

export { handler as POST };
