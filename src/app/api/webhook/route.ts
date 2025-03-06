import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Stripe } from "stripe";

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

    console.log(`📩 Evento recebido: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session; // 🔹 Correção do namespace
        if (!session) {
          return NextResponse.json(
            { error: "🔴 Sessão inválida." },
            { status: 400 }
          );
        }

        const metadata = session.metadata || {};
        const userId = metadata.user_id;
        const priceId = metadata.price_id;
        const stripeSubscriptionId = session.subscription as string;

        console.log("session.metadata", metadata);

        if (!userId || !priceId) {
          console.error("🚨 user_id ou price_id ausente no webhook.");
          return NextResponse.json(
            { error: "Dados ausentes." },
            { status: 400 }
          );
        }

        if (session.payment_status === "paid") {
          console.log(
            `✅ Pagamento confirmado para usuário ${userId} no plano ${priceId}`
          );

          const { data: plan, error: planError } = await supabaseAdmin
            .from("plans")
            .select("id")
            .eq("stripe_price_id", priceId)
            .single();

          if (planError) {
            console.error("🔴 Erro ao encontrar plano no Supabase:", planError);
            return NextResponse.json(
              { error: "Plano não encontrado." },
              { status: 404 }
            );
          }

          const { error: subscriptionError } = await supabaseAdmin
            .from("subscriptions")
            .upsert([
              {
                user_id: userId,
                plan_id: plan.id,
                stripe_subscription_id: stripeSubscriptionId,
                status: "active",
                payment_status: "paid",
              },
            ]);

          if (subscriptionError) {
            console.error(
              "🔴 Erro ao atualizar assinatura no Supabase:",
              subscriptionError
            );
          }
        }
        break;
      }

      case "checkout.session.expired": {
        console.log(`⚠️ Checkout expirado`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription; // 🔹 Correção do namespace
        const stripeSubscriptionId = subscription.id;

        console.log(`❌ Assinatura cancelada: ${stripeSubscriptionId}`);

        // Buscar `user_id` no banco
        const { data, error } = await supabaseAdmin
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", stripeSubscriptionId)
          .single();

        if (error || !data) {
          console.error("🔴 Erro ao encontrar assinatura no banco:", error);
          return NextResponse.json(
            { error: "Assinatura não encontrada." },
            { status: 404 }
          );
        }

        const userId = data.user_id;

        // Atualiza status da assinatura
        const { error: updateError } = await supabaseAdmin
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("user_id", userId);

        if (updateError) {
          console.error(
            "🔴 Erro ao cancelar assinatura no banco:",
            updateError
          );
        }
        break;
      }

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
