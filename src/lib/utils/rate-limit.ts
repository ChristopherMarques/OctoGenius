import { supabaseAdmin } from "../supabaseAdmin";

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export class RateLimiter {
  private maxHits: number;
  private windowSeconds: number;

  constructor(maxHits = 10, windowSeconds = 10) {
    this.maxHits = maxHits;
    this.windowSeconds = windowSeconds;
  }

  async limit(identifier: string): Promise<RateLimitResult> {
    try {
      const { data, error } = await supabaseAdmin.rpc("check_rate_limit", {
        p_identifier: identifier,
        p_max_hits: this.maxHits,
        p_window_seconds: this.windowSeconds,
      });

      if (error) throw error;

      const result = data[0];

      return {
        success: result.allowed,
        limit: this.maxHits,
        remaining: result.remaining,
        reset: new Date(result.reset_at).getTime(),
      };
    } catch (error) {
      console.error("Rate limit error:", error);
      // Em caso de erro, permitimos a requisição para evitar falsos negativos
      return {
        success: true,
        limit: this.maxHits,
        remaining: this.maxHits,
        reset: Date.now() + this.windowSeconds * 1000,
      };
    }
  }
}

// Instância global do rate limiter
export const rateLimiter = new RateLimiter();

// Função auxiliar para obter o resultado do rate limiting
export async function getRateLimitResult(
  identifier: string
): Promise<RateLimitResult> {
  return await rateLimiter.limit(identifier);
}
