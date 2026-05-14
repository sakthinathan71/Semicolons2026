import { test, expect } from "@playwright/test";

/**
 * LuxeLens AI — End-to-End Test Suite
 * Tests the critical user journeys using Playwright.
 *
 * Run with: npx playwright test
 */

// ─── Configuration ─────────────────────────────────────────────────────────────

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function navigateTo(page: Parameters<typeof test>[1] extends (...args: infer P) => unknown ? P[0] : never, tab: string) {
  await page.getByRole("navigation", { name: "Dashboard sections" })
    .getByRole("button", { name: tab })
    .click();
  await page.waitForLoadState("networkidle");
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe("LuxeLens AI Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Wait for the main nav to be visible
    await page.waitForSelector('[aria-label="Main navigation"]');
  });

  // ── Page Load ──────────────────────────────────────────────────────────────

  test("loads the dashboard with Intelligence Hub by default", async ({ page }) => {
    await expect(page).toHaveTitle(/LuxeLens AI/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Intelligence Hub");
  });

  test("shows initial market signals on load", async ({ page }) => {
    // There should be at least 1 signal card visible without starting the simulation
    const signals = page.locator("article[aria-label]");
    await expect(signals.first()).toBeVisible();
  });

  // ── Navigation ─────────────────────────────────────────────────────────────

  test("navigates to Price Watch and shows signal table", async ({ page }) => {
    await page.getByRole("button", { name: "Price Watch" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Price Watch");
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("navigates to Social Velocity", async ({ page }) => {
    await page.getByRole("button", { name: "Social Velocity" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Social Velocity");
  });

  test("navigates to Strategy AI", async ({ page }) => {
    await page.getByRole("button", { name: "Strategy AI" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Strategy AI");
    await expect(page.getByRole("button", { name: /Generate Weekly Brief/i })).toBeVisible();
  });

  test("navigates to Settings and shows brand list", async ({ page }) => {
    await page.getByRole("button", { name: "Settings" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Settings");
    await expect(page.getByText("Olivela")).toBeVisible();
    await expect(page.getByText("Net-a-Porter")).toBeVisible();
  });

  // ── Keyboard Navigation ────────────────────────────────────────────────────

  test("sidebar supports arrow key navigation", async ({ page }) => {
    // Focus the first nav button
    await page.getByRole("button", { name: "Intelligence Hub" }).focus();
    // Arrow Down should move focus to Price Watch
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("button", { name: "Price Watch" })).toBeFocused();
    // Arrow Down again to Social Velocity
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("button", { name: "Social Velocity" })).toBeFocused();
  });

  // ── Simulation ─────────────────────────────────────────────────────────────

  test("starts simulation and adds new signals", async ({ page }) => {
    const startBtn = page.getByRole("button", { name: /Start Simulation/i });
    const initialCount = await page.locator("article[aria-label]").count();

    await startBtn.click();
    await expect(page.getByRole("status")).toContainText("AI Pulse Active");

    // Wait for at least one new signal to appear
    await page.waitForFunction(
      (count) => document.querySelectorAll("article[aria-label]").length > count,
      initialCount,
      { timeout: 8000 }
    );

    const newCount = await page.locator("article[aria-label]").count();
    expect(newCount).toBeGreaterThan(initialCount);

    // Stop simulation
    await page.getByRole("button", { name: /End Simulation/i }).click();
    await expect(page.getByRole("status")).toContainText("Feed Paused");
  });

  // ── Settings ───────────────────────────────────────────────────────────────

  test("adds a new competitor brand in Settings", async ({ page }) => {
    await page.getByRole("button", { name: "Settings" }).click();

    await page.getByLabel("Brand Name *").fill("Louis Vuitton");
    await page.getByLabel("Storefront URL").fill("louisvuitton.com");
    await page.getByLabel("Instagram Handle").fill("@louisvuitton");
    await page.getByRole("button", { name: "Register Brand Scrapers" }).click();

    await expect(page.getByText("Louis Vuitton")).toBeVisible();
  });

  test("shows validation error for short brand name", async ({ page }) => {
    await page.getByRole("button", { name: "Settings" }).click();
    await page.getByLabel("Brand Name *").fill("X");
    await page.getByRole("button", { name: "Register Brand Scrapers" }).click();
    await expect(page.getByText(/at least 2 characters/i)).toBeVisible();
  });

  // ── API Health ─────────────────────────────────────────────────────────────

  test("health endpoint returns ok status", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/health`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.service).toBe("LuxeLens AI");
  });

  test("generate-brief API rejects missing signals", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/generate-brief`, {
      data: { notSignals: [] },
    });
    expect(res.status()).toBe(400);
  });
});
