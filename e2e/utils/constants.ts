export const BASE_URL = "http://localhost:3000";

export const ROUTES = {
  landing: "/",
  auth: "/auth",
  dashboard: "/dashboard",
  profile: "/profile",
  document: (id: string) => `/document/${id}`,
} as const;

export const TEST_USER = {
  email: `test-${Date.now()}@inkwell-e2e.test`,
  password: "TestPassword123!",
  name: "E2E Test User",
} as const;

export const TIMEOUTS = {
  navigation: 15_000,
  animation: 1_000,
  convexLoad: 10_000,
} as const;
