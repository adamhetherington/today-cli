import { validateDate, todayString } from "../utils/date.js";
import { getStorageDir, getFilePath } from "../storage/paths.js";

export type RawOptions = {
  date?: string;
};

export async function runRaw(options: RawOptions): Promise<void> {
  const dateStr = options.date ? validateDate(options.date) : todayString();
  const dir = getStorageDir();
  const filePath = getFilePath(dir, dateStr);
  console.log(filePath);
}
