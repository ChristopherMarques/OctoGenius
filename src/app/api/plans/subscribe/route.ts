import { supabase } from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { user_id, plan_id } = req.body;

    if (!user_id || !plan_id) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const { data, error } = await supabase
      .from("subscriptions")
      .insert([{ user_id, plan_id, status: "active" }]);

    if (error) return res.status(500).json({ error: error.message });

    return res
      .status(200)
      .json({ message: "Assinatura realizada com sucesso", data });
  }

  return res.status(405).json({ error: "Método não permitido" });
}
