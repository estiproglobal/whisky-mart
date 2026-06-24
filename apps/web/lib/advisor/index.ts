import { GroundedMockAdvisor } from "./mock-advisor";
import type { Advisor } from "./types";

/**
 * Returns the active Sommelier. Grounded mock today; a Claude-backed advisor
 * swaps in when ANTHROPIC_API_KEY is configured (see DEFERRED.md):
 *
 *   if (process.env.ANTHROPIC_API_KEY) return new ClaudeAdvisor();
 */
export function getAdvisor(): Advisor {
  return new GroundedMockAdvisor();
}

export * from "./types";
