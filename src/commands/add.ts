import { validateDate, todayString } from "../utils/date.js";
import { getStorageDir, getFilePath, ensureStorageDir } from "../storage/paths.js";
import { ensureDayFile, appendToSection } from "../storage/append.js";
import type { SectionName } from "../storage/format.js";

export type AddOptions = {
  date?: string;
};

export async function runAdd(
  section: SectionName,
  text: string,
  options: AddOptions
): Promise<void> {
  const dateStr = options.date ? validateDate(options.date) : todayString();
  const dir = getStorageDir();
  const filePath = getFilePath(dir, dateStr);
  await ensureDayFile(filePath, dateStr, () => ensureStorageDir(dir));
  await appendToSection(filePath, section, text);
}
