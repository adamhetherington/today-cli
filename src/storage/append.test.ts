import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import { ensureDayFile, appendToSection, readDayFile } from "./append.js";
import { getFilePath } from "./paths.js";

const testDir = path.join(os.tmpdir(), `today-test-${Date.now()}`);

async function ensureTestDir() {
  await fs.mkdir(testDir, { recursive: true });
}

beforeEach(ensureTestDir);
afterEach(async () => {
  await fs.rm(testDir, { recursive: true, force: true });
});

describe("ensureDayFile", () => {
  it("creates file with header and all sections", async () => {
    const filePath = getFilePath(testDir, "2026-02-09");
    await ensureDayFile(filePath, "2026-02-09", ensureTestDir);
    const content = await fs.readFile(filePath, "utf8");
    expect(content).toContain("# 2026-02-09");
    expect(content).toContain("## Progress");
    expect(content).toContain("## Decisions");
    expect(content).toContain("## Notes");
    expect(content).toContain("## Blockers");
  });

  it("does not overwrite existing file", async () => {
    const filePath = getFilePath(testDir, "2026-02-10");
    await fs.writeFile(filePath, "# 2026-02-10\n\ncustom", "utf8");
    await ensureDayFile(filePath, "2026-02-10", ensureTestDir);
    const content = await fs.readFile(filePath, "utf8");
    expect(content).toBe("# 2026-02-10\n\ncustom");
  });
});

describe("appendToSection", () => {
  it("appends to correct section", async () => {
    const filePath = getFilePath(testDir, "2026-02-11");
    await ensureDayFile(filePath, "2026-02-11", ensureTestDir);
    await appendToSection(filePath, "Notes", "First note");
    await appendToSection(filePath, "Notes", "Second note");
    const content = await readDayFile(filePath);
    expect(content).toMatch(/- \[\d{2}:\d{2}\] First note/);
    expect(content).toMatch(/- \[\d{2}:\d{2}\] Second note/);
    const notesIndex = content.indexOf("## Notes");
    const progressIndex = content.indexOf("## Progress");
    expect(notesIndex).toBeGreaterThan(progressIndex);
  });

  it("recreates missing section and appends", async () => {
    const filePath = getFilePath(testDir, "2026-02-12");
    await ensureDayFile(filePath, "2026-02-12", ensureTestDir);
    // Remove Notes section by writing minimal content
    await fs.writeFile(
      filePath,
      "# 2026-02-12\n\n## Progress\n\n## Decisions\n\n## Blockers\n",
      "utf8"
    );
    await appendToSection(filePath, "Notes", "Recovered note");
    const content = await readDayFile(filePath);
    expect(content).toContain("## Notes");
    expect(content).toMatch(/- \[\d{2}:\d{2}\] Recovered note/);
  });
});
