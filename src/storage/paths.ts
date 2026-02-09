import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";

const DEFAULT_DIR = ".today";

export function getStorageDir(): string {
  const override = process.env.TODAY_DIR;
  if (override && override.trim()) {
    return path.resolve(override.trim());
  }
  const home = os.homedir();
  return path.join(home, DEFAULT_DIR);
}

export function getFilePath(storageDir: string, dateStr: string): string {
  return path.join(storageDir, `${dateStr}.md`);
}

export async function ensureStorageDir(storageDir: string): Promise<void> {
  await fs.mkdir(storageDir, { recursive: true });
}
