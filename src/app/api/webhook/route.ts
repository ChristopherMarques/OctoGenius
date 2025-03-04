import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const secret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");

    if (!secret || !signature) {
      return NextResponse.json(
        { error: "🔴 STRIPE_WEBHOOK_SECRET ou assinatura ausente." },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, secret);
    } catch (err: any) {
      console.error("🔴 Erro ao validar webhook:", err.message);
      return NextResponse.json(
        { error: `Webhook error: ${err.message}` },
        { status: 400 }
      );
    }

    const session = event.data.object as Stripe.Checkout.Session;
    if (!session) {
      return NextResponse.json(
        { error: "🔴 Sessão inválida." },
        { status: 400 }
      );
    }

    const userId = session.metadata?.user_id;
    const priceId = session.metadata?.price_id;
    const stripeSubscriptionId = session.subscription as string;

    if (!userId || !priceId) {
      console.error("🚨 user_id ou price_id ausente no webhook.");
      return NextResponse.json({ error: "Dados ausentes." }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed":
        if (session.payment_status === "paid") {
          console.log(
            `✅ Pagamento confirmado para usuário ${userId} no plano ${priceId}`
          );

          const { error } = await supabaseAdmin.from("subscriptions").upsert([
            {
              user_id: userId,
              price_id: priceId,
              stripe_subscription_id: stripeSubscriptionId,
              status: "active",
              payment_status: "paid",
            },
          ]);

          if (error) {
            console.error(
              "🔴 Erro ao atualizar assinatura no Supabase:",
              error
            );
          }
        }
        break;

      case "checkout.session.expired":
        console.log(`⚠️ Checkout expirado: ${userId}`);
        break;

      case "customer.subscription.deleted":
        console.log(`❌ Assinatura cancelada para usuário ${userId}`);

        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("user_id", userId);

        if (error) {
          console.error("🔴 Erro ao cancelar assinatura no banco:", error);
        }
        break;

      default:
        console.log(`ℹ️ Evento não tratado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("🔴 Webhook error:", error.message);
    return NextResponse.json(
      { message: `Erro no webhook: ${error.message}` },
      { status: 500 }
    );
  }
}
