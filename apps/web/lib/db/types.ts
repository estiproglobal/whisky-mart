import type { Order, Review, ReviewInput, ReviewSummary } from "@whiskymart/types";

/**
 * Persistence interfaces. The app depends only on these — the in-memory
 * implementation used today (`./memory`) swaps for Prisma + Postgres later
 * with no changes to API routes or UI. See DEFERRED.md.
 */

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  get(id: string): Promise<Order | null>;
  listByEmail(email: string): Promise<Order[]>;
}

export interface ReviewRepository {
  create(input: ReviewInput, verifiedPurchase: boolean): Promise<Review>;
  listByProduct(productId: string): Promise<Review[]>;
  summary(productId: string): Promise<ReviewSummary>;
}
