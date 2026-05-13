import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import {
  IntelligenceProvider,
  useIntelligence,
} from "@/lib/IntelligenceContext";

// ─── Test Helpers ─────────────────────────────────────────────────────────────

function TestConsumer() {
  const ctx = useIntelligence();
  return (
    <div>
      <span data-testid="signal-count">{ctx.signals.length}</span>
      <span data-testid="rec-count">{ctx.recommendations.length}</span>
      <span data-testid="is-simulating">{ctx.isSimulating.toString()}</span>
      <span data-testid="brand-count">{ctx.brands.length}</span>
      <button data-testid="start" onClick={ctx.startSimulation}>Start</button>
      <button data-testid="stop" onClick={ctx.stopSimulation}>Stop</button>
      <button data-testid="trigger" onClick={ctx.triggerMockEvent}>Trigger</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <IntelligenceProvider>
      <TestConsumer />
    </IntelligenceProvider>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("IntelligenceContext", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("provides initial signals from mockInitialSignals", () => {
    renderWithProvider();
    const count = parseInt(screen.getByTestId("signal-count").textContent ?? "0");
    expect(count).toBeGreaterThan(0);
  });

  it("provides initial recommendations", () => {
    renderWithProvider();
    const count = parseInt(screen.getByTestId("rec-count").textContent ?? "0");
    expect(count).toBeGreaterThan(0);
  });

  it("starts simulation when startSimulation is called", async () => {
    renderWithProvider();
    expect(screen.getByTestId("is-simulating").textContent).toBe("false");

    await act(async () => {
      fireEvent.click(screen.getByTestId("start"));
    });

    expect(screen.getByTestId("is-simulating").textContent).toBe("true");
  });

  it("stops simulation when stopSimulation is called", async () => {
    renderWithProvider();

    await act(async () => {
      fireEvent.click(screen.getByTestId("start"));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("stop"));
    });

    expect(screen.getByTestId("is-simulating").textContent).toBe("false");
  });

  it("adds a new signal when triggerMockEvent fires", async () => {
    renderWithProvider();
    const initialCount = parseInt(screen.getByTestId("signal-count").textContent ?? "0");

    await act(async () => {
      fireEvent.click(screen.getByTestId("trigger"));
    });

    const newCount = parseInt(screen.getByTestId("signal-count").textContent ?? "0");
    expect(newCount).toBe(initialCount + 1);
  });

  it("adds a signal every 3 seconds when simulating", async () => {
    renderWithProvider();
    const initialCount = parseInt(screen.getByTestId("signal-count").textContent ?? "0");

    await act(async () => {
      fireEvent.click(screen.getByTestId("start"));
    });

    await act(async () => {
      vi.advanceTimersByTime(9000); // 3 ticks
    });

    const newCount = parseInt(screen.getByTestId("signal-count").textContent ?? "0");
    // Allow for some variance since all 3 might produce signals
    expect(newCount).toBeGreaterThan(initialCount);
  });

  it("does not exceed MAX_SIGNALS", async () => {
    renderWithProvider();

    await act(async () => {
      fireEvent.click(screen.getByTestId("start"));
      vi.advanceTimersByTime(200_000); // Trigger many events
    });

    const count = parseInt(screen.getByTestId("signal-count").textContent ?? "0");
    expect(count).toBeLessThanOrEqual(50);
  });

  it("throws if useIntelligence is used outside of IntelligenceProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useIntelligence must be used within an IntelligenceProvider"
    );
    consoleSpy.mockRestore();
  });
});
