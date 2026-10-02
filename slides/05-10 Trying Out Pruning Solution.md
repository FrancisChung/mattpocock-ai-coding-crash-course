# Trying Out Pruning Solution

<CommitMap packageManager="npm">
  <Commit id="init-generated-claude-md">Start the lesson: the bloated `AGENTS.md` that `/init` generated</Commit>
  <Commit id="pruned-claude-md">See my solution: the 11-line `AGENTS.md`, with the testing and routing procedures behind skills</Commit>
</CommitMap>

The first thing to think about when looking at a bloated `AGENTS.md` file is duplication. Not just duplication within the file itself, but duplication within easily accessible sources inside the codebase.

## Finding the Duplicates

The most obvious duplication appears in the development commands section.

![The development commands section showing npm run dev, npm build, and npm start](https://res.cloudinary.com/total-typescript/image/upload/v1785244400/ai-hero-images/keliqrzuuf7vvwjptaxv.png)

You'll find `npm run dev`, `npm run build`, and `npm run start` listed there, but these commands already live in `package.json`:

```json
{
  "scripts": {
    "dev": "react-router dev",
    "build": "react-router build",
    "start": "react-router-serve ./build/server/index.js"
  }
}
```

It's trivial for an [agent](https://www.aihero.dev/ai-coding-dictionary/agent) to find these commands in `package.json`.

They're the executable source of truth. The descriptions of what each command does can be inferred from the agent's [parametric knowledge](https://www.aihero.dev/ai-coding-dictionary/parametric-knowledge) - it knows that `npm run dev` starts a dev server, and it can verify that from the output it sees. There's no need to duplicate this information.

This is a single source of truth violation. When you have two pieces of information competing to be authoritative, you should keep the executable thing as the source of truth.

## The Overview and Tech Stack Problem

Look at the overview and tech stack sections. That same information already exists in the project's `README.md` at the root:

![README.md showing the overview and tech stack](https://res.cloudinary.com/total-typescript/image/upload/v1785244401/ai-hero-images/yqziayktbkopgjqi29h1.png)

```markdown
> The exercise repo for the AI Coding Crash Course

This is a full-stack course platform (think a mini Udemy) built with React Router, TypeScript, SQLite, and Drizzle ORM.
```

The agent knows the `README.md` exists at the root of the project. It can read it and understand the tech stack from there. It can also look at the directory structure and see that it's a React Router project. If it needs to check the version of React Router being used, it can look inside `package.json` and see the installed version.

These sections don't need to exist in `AGENTS.md` at all.

## The Preamble is a No-Op

![The preamble line in AGENTS.md saying 'This file provides guidance to Claude Code'](https://res.cloudinary.com/total-typescript/image/upload/v1785244401/ai-hero-images/ymygytr82e3dlnibjjfb.png)

The opening line that says "This file provides guidance to the agent when working with code in this repository" - everyone already knows that. The agent knows it. The [harness](https://www.aihero.dev/ai-coding-dictionary/harness) knows it. This is information that adds no value and should be removed entirely.

## Formatting Rules Are Assumed Knowledge

![The Prettier configuration line in AGENTS.md](https://res.cloudinary.com/total-typescript/image/upload/v1785244402/ai-hero-images/n0dftpi4bxuomvzc6rxi.png)

There's a line about Prettier being configured in `.prettierrc`. The agent can tell that Prettier is being used for several reasons:

- It can see `.prettierrc` exists at the root by running `ls`
- It can see Prettier in `package.json` as a dependency
- It already knows Prettier conventions from its [training](https://www.aihero.dev/ai-coding-dictionary/training)

There's no reason to spell this out.

## The Directory Structure Listing

![The entire directory structure section in AGENTS.md](https://res.cloudinary.com/total-typescript/image/upload/v1785244403/ai-hero-images/ids8xjl7pqpf7dkgmhwx.png)

An entire directory structure is listed out, but this just repeats the source of truth that exists in the [filesystem](https://www.aihero.dev/ai-coding-dictionary/filesystem) itself. These [navigation pointers](https://www.aihero.dev/ai-coding-dictionary/context-pointer) can be useful, but only when they point to something that's genuinely hard to find. For example, `scripts/seed.ts` sits outside the `app` directory, so it makes sense to highlight it. But listing out `app/routes/`, `app/services/`, and `app/components/`—these are obvious from a directory listing.

Some of these pointers are worth keeping if they provide real navigation value, but the entire directory structure section is mostly redundant.

## The Architecture Section Contains Inline Documentation

Here's where things get interesting. The architecture section contains lots of detailed information, but much of it is already documented in the code itself.

When you look at `app/db/index.ts`, you find:

```ts
// The connection is opened lazily, on first use. Opening it at module scope
// made this module side-effectful, which meant Rollup could not drop it from
// the client bundle when a route imported a service purely for its loader -
// dragging better-sqlite3 into the browser. Keep this file side-effect free.
```

This exact explanation already exists in the code.

![comment-markdown.server.ts showing the comment header](https://res.cloudinary.com/total-typescript/image/upload/v1785244404/ai-hero-images/omcxouibcxumj3vhu8ya.png)

Look at `app/lib/comment-markdown.server.ts` and you'll see:

```ts
// ─── Comment Rendering ───
// Deliberately separate from renderMarkdown (~/lib/markdown.server).
//
// renderMarkdown handles lesson content and sales copy, which are written by
// instructors - trusted input, raw HTML allowed through. Comments are written by
// students, so the same treatment would be stored XSS against every reader.
```

Again, this documentation is already there, inline with the code. The agent will read it.

## What Actually Earns Its Place

Some information genuinely earns its place in `AGENTS.md`. For example, the fact that routing is config-based, not file-based. If an agent creates a route file and doesn't register it in the route table, the route won't work and returns a 404.

Without this guidance, agents will miss this step consistently. This is behavior-changing information that should stay.

The same goes for the `vi.mock` getter pattern for testing. If you use a plain object instead of a getter function, the test captures the value once at mock time. Every test after the first then runs against a stale, closed database. This fails silently - your tests pass, but they're testing against old data.

## The Testing Block Should Go Behind a Pointer

The testing block in `AGENTS.md` is a full procedure. It teaches you how to write tests with the database mock. This is the natural candidate for a [skill](https://www.aihero.dev/ai-coding-dictionary/skill) extraction.

Instead of keeping this inline in `AGENTS.md`, it should live behind a pointer. When an agent is writing a test, it should be invited to read the `testing-services` skill. When it's adding a new route, it should see the `adding-a-route` skill.

This way, `AGENTS.md` becomes an index with navigation pointers, not a procedure manual.

## Clearing Context and Re-Evaluating

After reading through the whole file once, [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) the [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) and start fresh. This resets your thinking.

![The /context output showing 2.4k tokens](https://res.cloudinary.com/total-typescript/image/upload/v1785244404/ai-hero-images/bcebhm7min7n2ot3mb8h.png)

At this point, `AGENTS.md` is roughly 2.4k [tokens](https://www.aihero.dev/ai-coding-dictionary/token). That's about half of where it started. The question now is: can we get more aggressive?

## Running /writing-for-agents

Ask the `/writing-for-agents` skill to do the pruning work:

```
I want you to find me candidates in AGENTS.md that have single-source-of-truth issues between AGENTS.md and the rest of the stuff on the filesystem. I want you to give me candidates for removal or for putting behind pointers. Basically, I want you to do a whole pruning pass on AGENTS.md, and the ideal state for it should be just a few navigation pointers to different documentation.
```

The agent will read through the file and the filesystem, checking each claim against its actual source.

It should report back with:

- Verbatim duplicates that already exist in code comments
- No-ops that the agent already knows how to do
- Obvious filesystem facts that don't need stating
- Lines that genuinely earn their place

After the first pass, you're down to 51 lines. Much better.

![The pruned AGENTS.md file after the first pass](https://res.cloudinary.com/total-typescript/image/upload/v1785244405/ai-hero-images/moo7kywbgi4av1pb68wz.png)

The agent has aggressively removed things. It kept the config-based routing requirement, the `vi.mock` getter pattern, the TypeScript typegen issue, and the dev UI error message mapping.

![The agent's report showing what it removed and kept](https://res.cloudinary.com/total-typescript/image/upload/v1785244406/ai-hero-images/nc6gl8gj7dt9zhr6gbxb.png)

But there's still more to prune.

## A Second Pass: Putting Things Behind Pointers

Now ask the skill for another pass:

```
I would like you to do another pass for me and look for opportunities where we can take even more stuff out of AGENTS.md and put them behind pointers. I agree with the deletions that you've made, but I think there are more opportunities for putting existing docs behind pointers and writing careful descriptions so that they are grabbed at the right time.
```

On this second pass, the agent will:

1. Extract the testing pattern into a `testing-services` skill
2. Extract the routing pattern into an `adding-a-route` skill
3. Create a triage table for error symptoms and their causes
4. Keep only the navigation layer in `AGENTS.md`

![The final 31-line AGENTS.md file](https://res.cloudinary.com/total-typescript/image/upload/v1785244407/ai-hero-images/xqyju3l1yjpeprmfyoc7.png)

The agent is following a principle: task procedures have predictable triggers. You know when you're adding a route. You know when you're writing a test. These belong behind pointers with clear descriptions. Error recovery has unpredictable triggers, so the triage table stays inline.

## What the Skills Look Like

![The testing-services skill file](https://res.cloudinary.com/total-typescript/image/upload/v1785244408/ai-hero-images/d1dz6jdutgw0f170dws5.png)

The `testing-services` skill contains the full `vi.mock` pattern, explains why the getter specifically matters (stale database on test 2+), and includes the single-test invocations:

```
Use when adding or changing a test under app/services or app/lib, or when a test writes to data.db instead of an in-memory database.
```

![The adding-a-route skill file](https://res.cloudinary.com/total-typescript/image/upload/v1785244409/ai-hero-images/vxmx1qp4e0c6visieztb.png)

The `adding-a-route` skill contains the config-based routing explanation, the two-edit requirement, the filename convention with dots and dollar signs, and the loader/action-authorised-separately rule:

```
Use when adding or removing a page, URL, or route, or when a new route renders a 404.
```

## The Triage Table

![The 'When something breaks' triage table](https://res.cloudinary.com/total-typescript/image/upload/v1785244410/ai-hero-images/un4mulbkpuiqzhdojiuq.png)

What stays in `AGENTS.md` is a simple triage table that maps symptoms to causes:

| Symptom                                         | Cause                                        |
| ----------------------------------------------- | -------------------------------------------- |
| 401 "Select a user from the DevUI panel"        | No user in the session                       |
| `tsc` reports every `./+types/*` import missing | Typegen has not run. Use `npm run typecheck` |
| A test run leaves rows in `data.db`             | The `~/db` mock is wrong                     |

This is exactly what a navigation pointer is for. When something breaks, you don't need the full procedure - you just need to know which lever to pull.

## Deleting the Obvious No-Ops

After the agent's second pass, you'll see some things that are still no-ops:

- A line saying that the comment header convention documents modules
- A directory listing that repeats the filesystem
- A pointer to the database migrations skill when the skill itself is already loaded

These can be deleted. The comment header is already obvious from reading the code. The directory listing is already visible. The database migrations skill is already auto-loaded as a skill, so a line in `AGENTS.md` pointing to it is a third copy of information.

## The Final File

By the end, `AGENTS.md` is just 11 lines:

```
Requests flow route → service → Drizzle. Routes own HTTP concerns and
rendering; services own data access and use the shared db instance
directly rather than receiving a handle.

## When something breaks

| Symptom | Cause |
| 401 "Select a user from the DevUI panel" | No user in session - use the DevUI panel |
| tsc reports ./+types/* missing | Typegen hasn't run - use npm run typecheck |
| Test run leaves rows in data.db | The ~/db mock is wrong - see testing-services skill |
```

Every line is doing work. There's no sediment. There's no duplication. There's no telling the agent things it already knows.

## The Discipline

The real discipline isn't writing more steering documentation. It's keeping what you have honest.

When you write guidance for an agent, you're creating a maintenance burden. Every line you keep needs to stay current. Every claim you make needs to stay true. The longer the file, the more likely it is to rot, to drift from the actual codebase, to become a liability.

The pruning process forces you to ask hard questions:

- Does the agent already know this?
- Is this documented somewhere else?
- Is this a real pitfall or a no-op?
- Will this statement still be true in a month?

By the time you're done, what remains is lean and honest. It's the difference between guidance that actually steers behavior and noise that the agent learns to ignore.

