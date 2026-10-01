# Trying Out Pruning

<CommitMap packageManager="npm">
  <Commit id="init-generated-claude-md">Start the lesson: the bloated `AGENTS.md` that `/init` generated</Commit>
  <Commit id="pruned-claude-md">See my solution: `AGENTS.md` pruned to a navigation layer, with `testing-services` and `adding-a-route` extracted as skills</Commit>
</CommitMap>

An [agent](https://www.aihero.dev/ai-coding-dictionary/agent) can generate an `AGENTS.md` file from scratch using the `/init` command. It will scan your codebase and create steering guidance automatically.

The problem? It usually creates something **enormous**. Generic advice, boilerplate, directory listings, command tables - many things that don't actually change how the agent behaves. And all of it costs [tokens](https://www.aihero.dev/ai-coding-dictionary/token) every time the agent runs.

Your job is to read through a generated file and prune it ruthlessly. Keep only what earns its place in every [session](https://www.aihero.dev/ai-coding-dictionary/session). Delete the rest.

## The Three Tests

Use these three filters from the pruning toolkit to decide what stays and what goes:

**Single source of truth**
Is this fact already true somewhere else in your codebase, or duplicated inside the file itself? If the agent can discover it by reading code, you don't need to steer it toward it.

**Sediment**
Is this actually true of your specific project, or is it generic filler that could apply to any codebase? "Write unit tests for all new utilities" is sediment. "Our tests run on Vitest in watch mode with `npm run test:watch`" is not.

**No-ops**
Does this change the agent's behaviour versus what it already does by default? If it doesn't influence decisions, it's taking up space for nothing.

Everything that fails any of these tests should be cut. Behind what remains, ask yourself: does every line earn a place in every session?

## Steps To Complete

- [ ] Open the generated `AGENTS.md` file and read it through from top to bottom

Get a sense of its structure. Note sections that feel generic, sections that duplicate what's obvious from the code, and sections that repeat information already in the file.

- [ ] Identify no-ops

Look for advice that reads like best practices rather than project-specific guidance. Examples: "Write unit tests for all new utilities", "Provide helpful error messages to users", "Never include sensitive information in commits". These don't steer the agent - they describe what it already does.

Mark them for deletion.

- [ ] Identify sediment

Find lines that could apply to any codebase rather than your specific one. A generic project overview, a command table listing every npm script without context, directory listings, generic development tips. These aren't lies, but they're not earning their tokens.

Mark them for deletion.

- [ ] Identify duplication

Scan for facts repeated within the file. Check if any section duplicates information that lives in a `README.md`, `package.json`, code comments, or type definitions elsewhere in the repo. If the agent can read the source, you don't need to transcribe it.

Mark the redundant copy for deletion.

- [ ] Run `/context` in a fresh terminal to measure token usage

Open a new agent session in the same directory and run `/context`. Note the token count for the Memory Files section - this shows what `AGENTS.md` is costing you per session.

You'll use this number to verify your pruning worked.

- [ ] Delete or refactor marked sections using `/writing-for-agents`

For each section you marked, decide: delete it entirely, or move it behind a [pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer) (a link or reference to where the agent can find the real source)?

Use the `/writing-for-agents` [skill](https://www.aihero.dev/ai-coding-dictionary/skill) to help you edit the file. It will guide you through rewriting sections to be tighter and more precise, or removing them entirely.

If a section is truly important but already documented elsewhere, add a pointer instead. If it's genuinely generic or redundant, delete it outright.

- [ ] Run `/context` again and compare

Open a fresh agent session and run `/context` again. The Memory Files token count should drop noticeably. This is your proof that pruning worked.

- [ ] Verify the file still makes sense

Read through the pruned `AGENTS.md` one more time. Does every remaining line steer the agent toward decisions it wouldn't make otherwise? If yes, you're done. If you spot more that could go, cut it.

