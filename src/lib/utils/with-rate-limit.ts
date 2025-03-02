import { NextRequest, NextResponse } from "next/server";
import { getRateLimitResult } from "./rate-limit";

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options?: {
    identifier?: (request: NextRequest) => string;
  }
) {
  return async (request: NextRequest) => {
    const identifier =
      options?.identifier?.(request) ||
      `${request.headers.get("x-forwarded-for")}:${request.nextUrl.pathname}`;

    const result = await getRateLimitResult(identifier);

    if (!result.success) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "retry-after": Math.ceil(
            (result.reset - Date.now()) / 1000
          ).toString(),
          "x-ratelimit-limit": result.limit.toString(),
          "x-ratelimit-remaining": result.remaining.toString(),
          "x-ratelimit-reset": result.reset.toString(),
        },
      });
    }

    const response = await handler(request);

    // Adicionar headers de rate limit na resposta
    response.headers.set("x-ratelimit-limit", result.limit.toString());
    response.headers.set("x-ratelimit-remaining", result.remaining.toString());
    response.headers.set("x-ratelimit-reset", result.reset.toString());

    return response;
  };
}
