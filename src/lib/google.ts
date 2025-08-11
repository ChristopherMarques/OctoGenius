import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getGoogleAccessToken(userId: string) {
  const { data } = await supabaseAdmin    .from("google_credentials")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!data) {
    throw new Error("Credenciais do Google não encontradas. Reautentique com permissões de Calendário.");
  }

  const now = Date.now();
  const expiry = data.expiry_date ? new Date(data.expiry_date).getTime() : 0;

  if (data.access_token && expiry && expiry > now + 60_000) {
    return data.access_token as string;
  }

  if (!data.refresh_token) {
    throw new Error("Refresh token ausente. Reautentique com permissões de Calendário.");
  }

  const params = new URLSearchParams();
  params.set("client_id", process.env.GOOGLE_CLIENT_ID as string);
  params.set("client_secret", process.env.GOOGLE_CLIENT_SECRET as string);
  params.set("grant_type", "refresh_token");
  params.set("refresh_token", data.refresh_token as string);

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!resp.ok) {
    throw new Error("Falha ao renovar o token do Google");
  }

  const json = await resp.json();

  const newExpiry = json.expires_in ? new Date(Date.now() + json.expires_in * 1000).toISOString() : null;

  await supabaseAdmin
    .from("google_credentials")
    .upsert({
      user_id: userId,
      access_token: json.access_token ?? null,
      refresh_token: data.refresh_token,
      scope: json.scope ?? data.scope,
      token_type: json.token_type ?? data.token_type,
      expiry_date: newExpiry,
    });

  return json.access_token as string;
}

export async function createCalendarEvent(accessToken: string, summary: string, description: string, startIso: string, endIso: string, timeZone = "America/Sao_Paulo") {
  const body = {
    summary,
    description,
    start: { dateTime: startIso, timeZone },
    end: { dateTime: endIso, timeZone },
  };

  const resp = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`Erro Google Calendar: ${resp.status} ${t}`);
  }

  return resp.json();
}
