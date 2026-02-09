import * as fs from "fs/promises";
import { type SectionName, createDailyContent } from "./format.js";
import { parseDayFile } from "./parse.js";
import { timeStamp } from "../utils/date.js";

/**
 * Ensure the day file exists with full template; return its path.
 */
export async function ensureDayFile(
  filePath: string,
  dateStr: string,
  ensureDir: () => Promise<void>
): Promise<string> {
  await ensureDir();
  try {
    await fs.access(filePath);
  } catch {
    const content = createDailyContent(dateStr);
    await fs.writeFile(filePath, content, "utf8");
  }
  return filePath;
}

/**
 * Append a timestamped bullet to the given section.
 * If the section is missing, add it at the end (after all known sections) and append there.
 */
export async function appendToSection(
  filePath: string,
  sectionName: SectionName,
  text: string
): Promise<void> {
  const raw = await fs.readFile(filePath, "utf8");
  const lines = raw.split(/\r?\n/);
  const parsed = parseDayFile(raw);
  const ts = timeStamp();
  const bullet = `- [${ts}] ${text.trim()}`;

  const existing = parsed.sections.get(sectionName);
  if (existing) {
    // Insert bullet after the last line of the section
    lines.splice(existing.end + 1, 0, bullet, "");
    await fs.writeFile(filePath, lines.join("\n"), "utf8");
    return;
  }

  // Section missing: append at end with new section header
  const toAppend = ["", `## ${sectionName}`, "", bullet, ""];
  const trimmed = lines.length > 0 && lines[lines.length - 1] === "" ? lines : [...lines, ""];
  await fs.writeFile(filePath, [...trimmed, ...toAppend].join("\n"), "utf8");
}

export async function readDayFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf8");
}
