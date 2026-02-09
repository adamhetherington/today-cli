export const SECTIONS = ["Progress", "Decisions", "Notes", "Blockers"] as const;
export type SectionName = (typeof SECTIONS)[number];

export function createDailyContent(dateStr: string): string {
  const lines = [
    `# ${dateStr}`,
    "",
    "## Progress",
    "",
    "## Decisions",
    "",
    "## Notes",
    "",
    "## Blockers",
    "",
  ];
  return lines.join("\n");
}

export function sectionHeading(name: SectionName): string {
  return `## ${name}`;
}
