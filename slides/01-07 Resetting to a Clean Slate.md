# Resetting to a Clean Slate

Most folks who take this course have already tried fiddling around with some kind of [agentic](https://www.aihero.dev/ai-coding-dictionary/agent) setup.

You've maybe tried:

- Some [MCP](https://www.aihero.dev/ai-coding-dictionary/mcp) servers
- Fiddling with settings
- Installing a bunch of [skills](https://www.aihero.dev/ai-coding-dictionary/skill)
- Plugins

All of this probably means you've **over-configured your setup**. Most people come into this course with way too much config already there.

## Delete It (Or Back It Up)

The recommendation here is probably to **delete all of it**. A lot of it you simply don't need. It's best to work from a small starting point.

But if you're precious about it and want to retain it, make sure you back it up first.

## Let Your Agent Do It

The recommended way to do this is to **get your agent to do it**. Your agent should be an expert on its own configuration.

Use the prompt below, copy and paste it to your agent to tell it to revert things to a blank slate, with everything backed up.

```
You are the expert on your own configuration. Reset me to a clean slate (the config a fresh install would have) with everything I have now preserved so you can restore it on request later.

**1. Inventory.** Consult your own documentation for where your configuration lives, then find every piece of it that applies to me, both global (user-level) and local (this project). Cover settings files, instruction/memory files, MCP servers, skills, plugins/extensions, subagents, custom commands, hooks, and output styles. Report every path you find with a one-line description of what it does. Done when every location named in your docs has been checked and reported, including the ones that turned out to be empty.

**2. Back it up.** Create `~/agent-config-backup-<today's date>/` and MOVE each item there, mirroring its original path inside the backup so the layout is self-describing. The backup is the only surviving copy, so verify each move landed before continuing.

**3. Write the restore instructions.** Add `RESTORE.md` at the root of the backup listing every backed-up item, its original absolute path, and the exact commands to put it all back. Written well enough that a future agent with no memory of this conversation can restore everything from that file alone.

**4. Verify.** Re-run the inventory from step 1. Report what remains and confirm each remaining item is a genuine default rather than something I configured.

Keep me signed in - leave auth, credential, and session files exactly where they are. Keep this project's source code untouched; only configuration moves.

Finish with a table of what was moved and the one-line command I can give you later to restore it.
```

That way you can remind it later to restore from that backup. It should be pretty simple since most of this configuration is file-based, it'll save everything in a separate directory and be able to rehydrate back whenever needed.

## What Happens When You Run It

![Claude Code terminal running the reset prompt](https://res.cloudinary.com/total-typescript/image/upload/v1786014395/ai-hero-images/gnvt1xnkq3waicwbvawu.png)

In Claude Code, it's going to check its own documentation for where configuration lives, and then inventory everything.

Once the inventory is done, it starts backing up your config to a safe place.

Here's an example of what the inventory table looks like:

| Path | What it does |
|---|---|
| `~/.claude/settings.json` | Main settings: tool denies, `defaultMode`, `effortLevel`, `tui`, auto-memory, etc. |
| `~/.claude/settings.local.json` | `WebFetch` allow rules + `WebSearch` |
| `~/.claude/CLAUDE.md` | Global memory file |
| `~/.claude/skills/` | User skills (often symlinks) |
| `~/.claude/hooks/` | Executable hook scripts |
| `~/.claude/plugins/` | Installed plugins |
| `~/.claude.json` | MCP servers, per-project permissions/trust, plus auth + identity |

It also checks locations that turned out to be empty, such as `~/.claude/agents/`, `commands/`, `output-styles/`, and `rules/`.

## After the Backup

Once the backup is done, your agent will give you a short prompt you can use later to restore everything. Something like:

```
Restore my config from ~/agent-config-backup-<date>/RESTORE.md
```

## Trying the Restore

![Claude Code terminal after running /clear, about to restore config](https://res.cloudinary.com/total-typescript/image/upload/v1786014396/ai-hero-images/cye0fumy5jso6ho4smbz.png)

To test it, [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) your agent [session](https://www.aihero.dev/ai-coding-dictionary/session) (don't worry if you don't know what this means yet, it'll be covered later), then paste that restore command in. Your agent will read `RESTORE.md` and put everything back.

## Why Bother?

If you have a very in-depth configuration that you've worked hard on, you don't want to lose it. But it's worth seeing what it's like without it.

Run the prompt above, do the course, and then afterwards you can choose exactly what you want to restore.

Doing this will mean the course material doesn't interact with your dumpster fire.

…sorry, not dumpster fire. Your very carefully curated Olympic torch.
