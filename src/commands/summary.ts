import * as fs from "fs/promises";
import { validateDate, todayString } from "../utils/date.js";
import { getStorageDir, getFilePath, ensureStorageDir } from "../storage/paths.js";
import { parseDayFile } from "../storage/parse.js";
import { SECTIONS } from "../storage/format.js";

export type SummaryOptions = {
  date?: string;
};

/**
 * Print a clean summary to stdout: date heading and each section with its bullets.
 */
export async function runSummary(options: SummaryOptions): Promise<void> {
  const dateStr = options.date ? validateDate(options.date) : todayString();
  const dir = getStorageDir();
  const filePath = getFilePath(dir, dateStr);
  await ensureStorageDir(dir);
  try {
    const content = await fs.readFile(filePath, "utf8");
    const parsed = parseDayFile(content);
    const lines: string[] = [`# ${parsed.dateHeading || dateStr}`, ""];
    for (const name of SECTIONS) {
      const section = parsed.sections.get(name);
      if (section) {
        const bulletLines = section.content.split(/\r?\n/).filter((l) => l.trim().startsWith("- "));
        if (bulletLines.length > 0) {
          lines.push(`## ${name}`);
          lines.push(...bulletLines);
          lines.push("");
        }
      }
    }
    console.log(lines.join("\n").trimEnd());
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === "ENOENT") {
      console.log(`# ${dateStr}\n\n(No entries yet.)`);
      return;
    }
    throw err;
  }
}
