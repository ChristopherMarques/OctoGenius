import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { userId, priceId } = await req.json();

    if (!userId || !priceId) {
      return NextResponse.json({ error: "Missing userId or priceId" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .select("*, plans(stripe_price_id)")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return NextResponse.json({ alreadyHasPlan: false, subscription: null });
    }

    const alreadyHasPlan = (data as any).plans?.stripe_price_id === priceId;

    return NextResponse.json({ alreadyHasPlan, subscription: data });
  } catch (e) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
