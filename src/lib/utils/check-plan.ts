import { supabase } from "@/lib/supabase";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

export default function checkPlanAccess(requiredPlan: string) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextApiHandler
  ) => {
    const { user_id } = req.body || req.query;

    if (!user_id)
      return res.status(401).json({ error: "Usuário não autenticado" });

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*, plans(name)")
      .eq("user_id", user_id)
      .single();

    if (error || !data)
      return res.status(403).json({ error: "Assinatura não encontrada" });

    if (data.plans.name !== requiredPlan) {
      return res
        .status(403)
        .json({ error: "Plano insuficiente para este recurso" });
    }

    next(req, res);
  };
}
