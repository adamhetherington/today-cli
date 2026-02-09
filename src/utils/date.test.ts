import { describe, it, expect } from "vitest";
import { validateDate, todayString, timeStamp } from "./date.js";

describe("validateDate", () => {
  it("accepts valid YYYY-MM-DD", () => {
    expect(validateDate("2026-02-09")).toBe("2026-02-09");
    expect(validateDate("2024-01-01")).toBe("2024-01-01");
    expect(validateDate("2030-12-31")).toBe("2030-12-31");
  });

  it("trims whitespace", () => {
    expect(validateDate("  2026-02-09  ")).toBe("2026-02-09");
  });

  it("rejects invalid format", () => {
    expect(() => validateDate("02-09-2026")).toThrow(/YYYY-MM-DD/);
    expect(() => validateDate("2026/02/09")).toThrow(/YYYY-MM-DD/);
    expect(() => validateDate("2026-2-9")).toThrow(/YYYY-MM-DD/);
    expect(() => validateDate("")).toThrow(/YYYY-MM-DD/);
  });

  it("rejects invalid calendar date", () => {
    expect(() => validateDate("2026-02-30")).toThrow(/Invalid date/);
    expect(() => validateDate("2026-13-01")).toThrow(/YYYY-MM-DD/);
  });
});

describe("todayString", () => {
  it("returns YYYY-MM-DD format", () => {
    const s = todayString();
    expect(s).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("timeStamp", () => {
  it("returns HH:mm format", () => {
    const t = timeStamp();
    expect(t).toMatch(/^\d{2}:\d{2}$/);
  });
});
