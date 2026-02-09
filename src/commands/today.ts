import { openInEditor } from "../utils/editor.js";
import { todayString, validateDate } from "../utils/date.js";
import { getStorageDir, getFilePath, ensureStorageDir } from "../storage/paths.js";
import { ensureDayFile } from "../storage/append.js";

export type TodayOptions = {
  date?: string;
  editor?: string;
};

export async function runToday(options: TodayOptions): Promise<void> {
  const dateStr = options.date ? validateDate(options.date) : todayString();
  const dir = getStorageDir();
  const filePath = getFilePath(dir, dateStr);
  await ensureDayFile(filePath, dateStr, () => ensureStorageDir(dir));
  await openInEditor(filePath, options.editor);
}
