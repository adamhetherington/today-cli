import { describe, it, expect } from "vitest";
import { createDailyContent, SECTIONS, sectionHeading } from "./format.js";

describe("createDailyContent", () => {
  it("creates file with date and all sections", () => {
    const content = createDailyContent("2026-02-09");
    expect(content).toContain("# 2026-02-09");
    expect(content).toContain("## Progress");
    expect(content).toContain("## Decisions");
    expect(content).toContain("## Notes");
    expect(content).toContain("## Blockers");
  });

  it("includes all required section names", () => {
    expect(SECTIONS).toEqual(["Progress", "Decisions", "Notes", "Blockers"]);
  });
});

describe("sectionHeading", () => {
  it("returns ## Name", () => {
    expect(sectionHeading("Notes")).toBe("## Notes");
  });
});
