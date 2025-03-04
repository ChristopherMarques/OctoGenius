import { supabaseAdmin } from "@/lib/supabaseAdmin";
import stripe from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { error: "Método não permitido" },
        { status: 405 }
      );
    }

    const { user_id, price_id } = await req.json();

    if (!user_id || !price_id) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const { data: plan, error } = await supabaseAdmin
      .from("plans")
      .select("stripe_price_id")
      .eq("stripe_price_id", price_id)
      .single();

    if (error || !plan) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    // Criar checkout session no Stripe
    const session = await stripe.checkout.sessions
      .create({
        payment_method_types: ["card"],
        line_items: [{ price: price_id, quantity: 1 }],
        mode: "subscription",
        success_url: "http://localhost:3000/dashboard",
        cancel_url: "http://localhost:3000/",
        metadata: { user_id: user_id, price_id: price_id },
      })
      .catch((error) => {
        console.error("Erro do Stripe:", error);
        return null;
      });

    if (!session) {
      return NextResponse.json(
        { error: "Erro ao criar sessão de checkout" },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkout_url: session.url }, { status: 200 });
  } catch (error) {
    console.error("Erro ao criar sessão de checkout:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export { handler as POST };
