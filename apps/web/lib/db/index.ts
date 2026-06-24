import type { OrderRepository, ReviewRepository } from "./types";
import { memoryOrders, memoryReviews } from "./memory";

/**
 * Active persistence backends.
 *
 * Interface-first: today these point at the in-memory store. When we move to
 * Postgres (see DEFERRED.md), implement Prisma-backed versions and switch the
 * bindings here — no API route or UI changes required.
 */
export const orders: OrderRepository = memoryOrders;
export const reviews: ReviewRepository = memoryReviews;

export type { OrderRepository, ReviewRepository } from "./types";
