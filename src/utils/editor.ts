import { execa } from "execa";
import * as os from "os";
import * as path from "path";

/**
 * Resolves editor command in order: option, VISUAL, EDITOR, OS fallback.
 * Returns [command, args] for execa; args may be empty.
 */
export function resolveEditor(optionEditor?: string): [string, string[]] {
  const env = process.env;
  const candidate = optionEditor ?? env.VISUAL ?? env.EDITOR ?? getOsFallback();

  if (!candidate || typeof candidate !== "string") {
    throw new Error("No editor found. Set EDITOR or VISUAL, or use --editor <command>.");
  }

  const parts = candidate.trim().split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  // Resolve command if it's a bare name (e.g. "code" -> full path when needed)
  return [cmd, args];
}

function getOsFallback(): string {
  const platform = os.platform();
  if (platform === "win32") {
    return "notepad";
  }
  if (platform === "darwin") {
    return "open -t";
  }
  return "nano";
}

/**
 * Open the given file path in the user's editor.
 * On Windows with "open -t" we'd use macOS; we use the resolved command as-is.
 */
export async function openInEditor(filePath: string, optionEditor?: string): Promise<void> {
  const [cmd, args] = resolveEditor(optionEditor);
  const absolutePath = path.resolve(filePath);

  if (cmd === "open" && args[0] === "-t") {
    await execa(cmd, ["-t", absolutePath], { stdio: "inherit" });
    return;
  }

  await execa(cmd, [...args, absolutePath], { stdio: "inherit" });
}
