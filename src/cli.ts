#!/usr/bin/env node

const { Command } = require("commander");
const { runToday } = require("./commands/today.js");
const { runAdd } = require("./commands/add.js");
const { runSummary } = require("./commands/summary.js");
const { runRaw } = require("./commands/raw.js");
const { exitWithError } = require("./utils/errors.js");

const pkg = require("../package.json");

// Catch common mistake: -note instead of note (and similar)
const hyphenCommands: Record<string, string> = {
  "-note": "note",
  "-decision": "decision",
  "-progress": "progress",
  "-blocker": "blocker",
};
const arg2 = process.argv[2];
if (arg2 && hyphenCommands[arg2]) {
  console.error(
    `Unknown option '${arg2}'. Did you mean the '${hyphenCommands[arg2]}' command?`
  );
  console.error(`Usage: today ${hyphenCommands[arg2]} "<text>"`);
  process.exit(1);
}

// When no subcommand is given, run "open" (so `today` and `today -d YYYY-MM-DD` work)
const knownCommands = ["open", "note", "decision", "progress", "blocker", "summary", "raw"];
if (
  process.argv.length === 2 ||
  (arg2 && !knownCommands.includes(arg2) && arg2.startsWith("-"))
) {
  process.argv.splice(2, 0, "open");
}

const program = new Command();

program
  .name("today")
  .description(
    "Capture what actually happened today (notes, decisions, progress) without becoming a task manager."
  )
  .version(pkg.version)
  .option("-d, --date <YYYY-MM-DD>", "Use this date instead of today")
  .option("--editor <command>", "Editor to open (overrides VISUAL/EDITOR)");

program
  .command("open")
  .description("Open today's file in your editor (default when no command given)")
  .action(async () => {
    try {
      const opts = program.opts();
      await runToday({
        date: opts.date,
        editor: opts.editor,
      });
    } catch (err) {
      exitWithError((err as Error).message);
    }
  });

program
  .command("note <text...>")
  .description("Append a note with timestamp")
  .action(async (text: string[]) => {
    try {
      await runAdd("Notes", text.join(" ").trim(), {
        date: program.opts().date,
      });
    } catch (err) {
      exitWithError((err as Error).message);
    }
  });

program
  .command("decision <text...>")
  .description("Append a decision with timestamp")
  .action(async (text: string[]) => {
    try {
      await runAdd("Decisions", text.join(" ").trim(), {
        date: program.opts().date,
      });
    } catch (err) {
      exitWithError((err as Error).message);
    }
  });

program
  .command("progress <text...>")
  .description("Append a progress item with timestamp")
  .action(async (text: string[]) => {
    try {
      await runAdd("Progress", text.join(" ").trim(), {
        date: program.opts().date,
      });
    } catch (err) {
      exitWithError((err as Error).message);
    }
  });

program
  .command("blocker <text...>")
  .description("Append a blocker with timestamp")
  .action(async (text: string[]) => {
    try {
      await runAdd("Blockers", text.join(" ").trim(), {
        date: program.opts().date,
      });
    } catch (err) {
      exitWithError((err as Error).message);
    }
  });

program
  .command("summary")
  .description("Print a clean summary for the day")
  .action(async () => {
    try {
      await runSummary({ date: program.opts().date });
    } catch (err) {
      exitWithError((err as Error).message);
    }
  });

program
  .command("raw")
  .description("Print the full path to the day's markdown file")
  .action(async () => {
    try {
      await runRaw({ date: program.opts().date });
    } catch (err) {
      exitWithError((err as Error).message);
    }
  });

program.parse();
