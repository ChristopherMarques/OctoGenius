import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { user_id } = req.query;

    if (!user_id)
      return res.status(400).json({ error: "Usuário não especificado" });

    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .select("*, plans(*)")
      .eq("user_id", user_id)
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: "Método não permitido" });
}
