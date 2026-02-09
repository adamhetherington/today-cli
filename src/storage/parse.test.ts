import { describe, it, expect } from "vitest";
import { parseDayFile } from "./parse.js";

describe("parseDayFile", () => {
  it("parses date heading and sections", () => {
    const content = `# 2026-02-09

## Progress
- [14:32] Did something

## Notes
- [09:05] A note
`;
    const parsed = parseDayFile(content);
    expect(parsed.dateHeading).toBe("2026-02-09");
    expect(parsed.sections.get("Progress")?.content).toContain("- [14:32] Did something");
    expect(parsed.sections.get("Notes")?.content).toContain("- [09:05] A note");
  });

  it("identifies section boundaries", () => {
    const content = `# 2026-02-09

## Progress
- one
- two

## Notes
- three
`;
    const parsed = parseDayFile(content);
    const progress = parsed.sections.get("Progress");
    expect(progress).toBeDefined();
    expect(progress!.content).toContain("## Progress");
    expect(progress!.content).toContain("- one");
    expect(progress!.content).toContain("- two");
  });
});
