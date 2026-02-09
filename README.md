# today

A minimal CLI for capturing **what actually happened today** - notes, decisions, progress, blockers-without becoming a task manager. One Markdown file per day, timestamped entries, no tasks, no due dates, no status.

## Philosophy

**today** is a daily log, not a todo list. It answers “what did I do?” and “what did I decide?” with minimal friction. Data lives as plain Markdown in `~/.today` (or `TODAY_DIR`), so you own it and can edit or grep anytime.

## Install

```bash
npm install -g today-cli
```

For local development: `npm link` from the repo root so the `today` binary is available globally.

## Usage

| Command | Description |
|--------|-------------|
| `today` | Open today’s file in your editor (default) |
| `today note <text>` | Append to **Notes** with `[HH:mm]` |
| `today decision <text>` | Append to **Decisions** |
| `today progress <text>` | Append to **Progress** |
| `today blocker <text>` | Append to **Blockers** |
| `today summary` | Print a clean summary for the day |
| `today raw` | Print the full path to the day’s file |

Use the **subcommand** name without a hyphen (e.g. `today note "..."`, not `today -note "..."`).

**Global options** (one hyphen, for flags only):

- `-d, --date YYYY-MM-DD` — Use this date instead of today
- `--editor <command>` — Editor to open (overrides `VISUAL` / `EDITOR`)

### Examples

```bash
today                                    # open today's file
today note Fixed login bug               # append to Notes
today decision Use REST for new API      # append to Decisions
today progress Deployed v2               # append to Progress
today blocker Waiting on design review    # append to Blockers
today summary                            # print summary to stdout
today summary -d 2026-02-08              # summary for another day
today raw                                # e.g. /Users/you/.today/2026-02-09.md
```

### Storage

- **Default directory:** `~/.today`
- **Override:** set `TODAY_DIR` to a full path
- **File per day:** `YYYY-MM-DD.md` with sections: Progress, Decisions, Notes, Blockers

### Editor

Resolved in order: `--editor` → `$VISUAL` → `$EDITOR` → OS fallback (Windows: `notepad`, macOS: `open -t`, Linux: `nano`).

## Requirements

- Node.js 20+

## Publishing

1. **Log in to npm** (one-time):  
   `npm login`

2. **Bump version** (before publishing):  
   `npm version patch` | `npm version minor` | `npm version major`

3. **Publish**:  
   `npm publish`

The `prepublishOnly` script runs `npm run build` so the `dist/` output is up to date.

## License

MIT
