// Edge Function: valida o captcha (Cloudflare Turnstile) e só então grava a inscrição.
// Segredos usados (configurados no Supabase, nunca no site):
//   TURNSTILE_SECRET_KEY  -> chave secreta do Turnstile
//   SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY -> já vêm prontos dentro das Edge Functions
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // depois de publicar o site, troque pelo domínio dele
  "Access-Control-Allow-Headers": "content-type, apikey, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ erro: "método inválido" }, 405);

  let corpo;
  try {
    corpo = await req.json();
  } catch {
    return json({ erro: "json inválido" }, 400);
  }

  const { token, ...dados } = corpo;
  if (!token) return json({ erro: "captcha ausente" }, 400);

  // 1) Pergunta ao Cloudflare se o token do captcha é válido
  const ip = req.headers.get("cf-connecting-ip") ?? "";
  const verificacao = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: Deno.env.get("TURNSTILE_SECRET_KEY")!,
        response: token,
        remoteip: ip,
      }),
    },
  ).then((r) => r.json());

  if (!verificacao.success) return json({ erro: "captcha inválido" }, 403);

  // 2) Grava só os campos esperados (ignora qualquer campo extra enviado)
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { error } = await supabase.from("inscricoes").insert({
    nome: dados.nome,
    email: dados.email,
    telefone: dados.telefone ?? null,
    nascimento: dados.nascimento ?? null,
    idade: dados.idade ?? null,
  });

  // Os `check` do banco rejeitam dados inválidos e caem aqui
  if (error) return json({ erro: "dados inválidos" }, 400);
  return json({ ok: true });
});
