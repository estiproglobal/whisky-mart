import type { Order, Review, ReviewInput, ReviewSummary } from "@whiskymart/types";
import type { OrderRepository, ReviewRepository } from "./types";

/**
 * In-memory persistence (interface-first). Module-level singletons shared
 * across requests within one running server process.
 *
 * Limitations (acceptable for dev; resolved by the Postgres swap — see
 * DEFERRED.md): data resets on server restart and is not shared across
 * multiple instances. Do not rely on this in production.
 */

const orderStore: Order[] = [];

// A few seeded reviews so product pages aren't empty in development.
const reviewStore: Review[] = [
  {
    id: "rev_seed_1",
    productId: "p_lagavulin16",
    author: "Iain M.",
    rating: 5,
    title: "The benchmark Islay",
    body: "Smoke, sea salt and a long elegant finish. My desert-island dram.",
    verifiedPurchase: true,
    createdAt: "2026-05-02T10:00:00.000Z",
  },
  {
    id: "rev_seed_2",
    productId: "p_lagavulin16",
    author: "Priya S.",
    rating: 4,
    title: "Wonderful, if you love peat",
    body: "Rich and complex. A touch intense for a beginner but superb value.",
    verifiedPurchase: true,
    createdAt: "2026-05-18T14:30:00.000Z",
  },
  {
    id: "rev_seed_3",
    productId: "p_glenfiddich12",
    author: "Tom B.",
    rating: 4,
    title: "Great everyday Speyside",
    body: "Easy, fruity and approachable. The first malt I recommend to friends.",
    verifiedPurchase: false,
    createdAt: "2026-04-21T19:15:00.000Z",
  },
];

export const memoryOrders: OrderRepository = {
  async create(order) {
    orderStore.unshift(order);
    return order;
  },
  async get(id) {
    return orderStore.find((o) => o.id === id) ?? null;
  },
  async listByEmail(email) {
    const e = email.toLowerCase();
    return orderStore.filter((o) => o.email.toLowerCase() === e);
  },
};

export const memoryReviews: ReviewRepository = {
  async create(input: ReviewInput, verifiedPurchase: boolean) {
    const review: Review = {
      id: crypto.randomUUID(),
      productId: input.productId,
      author: input.author,
      rating: input.rating,
      title: input.title,
      body: input.body,
      verifiedPurchase,
      createdAt: new Date().toISOString(),
    };
    reviewStore.unshift(review);
    return review;
  },
  async listByProduct(productId) {
    return reviewStore
      .filter((r) => r.productId === productId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async summary(productId): Promise<ReviewSummary> {
    const list = reviewStore.filter((r) => r.productId === productId);
    if (list.length === 0) return { average: 0, count: 0 };
    const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
    return { average: Math.round(avg * 10) / 10, count: list.length };
  },
};
