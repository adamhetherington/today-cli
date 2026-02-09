import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import { runSummary } from "./summary.js";

const testDir = path.join(os.tmpdir(), `today-summary-test-${Date.now()}`);

beforeEach(async () => {
  process.env.TODAY_DIR = testDir;
  await fs.mkdir(testDir, { recursive: true });
});
afterEach(async () => {
  delete process.env.TODAY_DIR;
  await fs.rm(testDir, { recursive: true, force: true });
});

describe("runSummary", () => {
  it("summary output contains expected headings when file exists", async () => {
    const filePath = path.join(testDir, "2026-02-09.md");
    await fs.writeFile(
      filePath,
      `# 2026-02-09

## Progress
- [14:32] Shipped feature

## Notes
- [09:05] Morning standup
`,
      "utf8"
    );
    const log: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => {
      log.push(args.map(String).join(" "));
    };
    try {
      await runSummary({ date: "2026-02-09" });
      const out = log.join("\n");
      expect(out).toContain("# 2026-02-09");
      expect(out).toContain("## Progress");
      expect(out).toContain("## Notes");
      expect(out).toContain("- [14:32] Shipped feature");
      expect(out).toContain("- [09:05] Morning standup");
    } finally {
      console.log = origLog;
    }
  });

  it("prints no entries message when file does not exist", async () => {
    const log: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => {
      log.push(args.map(String).join(" "));
    };
    try {
      await runSummary({ date: "2026-02-09" });
      const out = log.join("\n");
      expect(out).toContain("# 2026-02-09");
      expect(out).toContain("(No entries yet.)");
    } finally {
      console.log = origLog;
    }
  });
});
