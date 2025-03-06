import { supabaseAdmin } from "../supabaseAdmin";

export const checkPlan = async (userId: string, priceId: string) => {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select("*, plans(stripe_price_id)")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return { alreadyHasPlan: false, subscription: null };
  }

  const alreadyHasPlan = data.plans.stripe_price_id === priceId;

  return {
    alreadyHasPlan,
    subscription: data,
  };
};
