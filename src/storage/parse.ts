import { SECTIONS, type SectionName } from "./format.js";

export interface ParsedFile {
  dateHeading: string;
  sections: Map<SectionName, { start: number; end: number; content: string }>;
  raw: string;
}

/**
 * Parse a day file and locate each section (start line index, end line index, content).
 * Line indices are 0-based. end is the index of the last line of the section (inclusive).
 */
export function parseDayFile(content: string): ParsedFile {
  const lines = content.split(/\r?\n/);
  const sections = new Map<SectionName, { start: number; end: number; content: string }>();

  let dateHeading = "";
  let i = 0;

  // First line should be # YYYY-MM-DD
  if (lines.length > 0 && lines[0].startsWith("# ")) {
    dateHeading = lines[0].slice(2).trim();
    i = 1;
  }

  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      const name = match[1].trim() as SectionName;
      if (SECTIONS.includes(name)) {
        const start = i;
        let end = i;
        const sectionLines: string[] = [line];
        i++;
        while (i < lines.length && !lines[i].startsWith("## ")) {
          sectionLines.push(lines[i]);
          end = i;
          i++;
        }
        sections.set(name, {
          start,
          end,
          content: sectionLines.join("\n"),
        });
        continue;
      }
    }
    i++;
  }

  return {
    dateHeading,
    sections,
    raw: content,
  };
}
