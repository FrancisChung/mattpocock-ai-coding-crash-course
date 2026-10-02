# Navigation Pointers

<CommitMap packageManager="npm">
  <Commit id="migration-steps-skill">Start the lesson: `AGENTS.md` emptied out, with the migration steps living in a skill</Commit>
  <Commit id="seed-script-nav-pointer">See my solution: the navigation pointer to `scripts/seed.ts` added to `AGENTS.md`</Commit>
</CommitMap>

Imagine your codebase as a satellite map. When an [agent](https://www.aihero.dev/ai-coding-dictionary/agent) needs to find something, it doesn't have a birds-eye view. Instead, it travels on what we can call **local roads**.

The agent scans directories, opens files one at a time, and follows chains of references to find what it's looking for. It gets there eventually, but the journey is slow. Every file opened along the way adds to the [context window](https://www.aihero.dev/ai-coding-dictionary/context-window), consuming [tokens](https://www.aihero.dev/ai-coding-dictionary/token) that could be used for solving the actual problem.

But there's another way. A **highway** is different from a local road.

## Navigation Pointers: Highways for Your Agent

A **navigation pointer** is a short line in `AGENTS.md` that sends the agent straight to an important part of the codebase with no scanning in between. It's a [context pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer) with a specific job: instead of telling the agent what to do, it tells the agent where to look.

You don't build highways to everywhere. That would push your entire file tree into [context](https://www.aihero.dev/ai-coding-dictionary/context), imposing serious context load. You build highways to the places the agent needs often, and let it take local roads for the final stretch once it's arrived.

## The Quiz Example

![Searching for 'quiz' in the codebase showing multiple file matches](https://res.cloudinary.com/total-typescript/image/upload/v1785243611/ai-hero-images/ze6o4bqd3nnshafwsrjj.png)

When searching for "quiz" in a codebase, an agent might find hits scattered across many files:

```
app/db/schema.ts
app/routes.ts
app/services/quizService.ts
scripts/seed.ts
...and more
```

The agent then has to follow chains of references to understand the structure.

In `app/db/schema.ts`, it might find:

```ts
export const quizzes = sqliteTable("quizzes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessons.id),
  title: text("title").notNull(),
  passingScore: real("passing_score").notNull(),
});

export const quizQuestions = sqliteTable("quiz_questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull().$type<QuestionType>(),
  position: integer("position").notNull(),
});
```

The agent has to travel down these chains of references one by one. With a navigation pointer, it knows exactly where to go.

## Adding a Navigation Pointer to the Seed Script

In recent lessons, migrations kept breaking because the agent wasn't updating `scripts/seed.ts`. The seed script is a critical file that the agent lands in often, but it tends to miss it when searching.

![Prompting the agent to add a navigation pointer to AGENTS.md](https://res.cloudinary.com/total-typescript/image/upload/v1785243612/ai-hero-images/lhn7rc5nqyph5ll33hrb.png)

The solution is to add a navigation pointer. Instead of letting the agent discover the seed script through exploration, we point it there directly in `AGENTS.md`:

```md
# Navigation

- `scripts/seed.ts` - the definition of the database's starting data, rebuilt from scratch on every `npm run db:seed`. Every schema change lands here too.
```

This is extremely light. Three lines. One bullet point. But it gives the agent a crucial leg up for a file that's hard to discover but essential to change.

When the agent is editing the schema, it now knows: "Every schema change lands in the seed script too." That's the trigger. The agent goes looking for it without needing a [skill](https://www.aihero.dev/ai-coding-dictionary/skill) to fire.

## A Real-World Example: My Skills Repo

Consider a more complex repository where navigation pointers earn their weight.

In [my skills repository](https://github.com/mattpocock/skills), the structure looks like this:

```
skills/
  engineering/
  productivity/
  misc/
  personal/
  in-progress/
  deprecated/

docs/
  engineering/
  productivity/

.claude-plugin/
  plugin.json
```

Every skill that gets created has non-obvious dependencies:

1. It goes into a bucket folder under `skills/` (e.g., `skills/productivity/`)
2. If it's in `engineering/` or `productivity/`, it must have an entry in `.claude-plugin/plugin.json`
3. If it's in `engineering/` or `productivity/`, it must have a human-facing docs page at `docs/<bucket>/<skill-name>.md`
4. If it's in `engineering/` or `productivity/`, it must be referenced in the top-level `README.md`
5. Skills in `misc/`, `personal/`, `in-progress/`, or `deprecated/` must not appear in the plugin manifest or docs

These are invisible on the [filesystem](https://www.aihero.dev/ai-coding-dictionary/filesystem). An agent scanning the directory tree won't understand why a new skill in `productivity/` also needs entries in three other places.

![The AGENTS.md file showing navigation pointers and bucket rules](https://res.cloudinary.com/total-typescript/image/upload/v1785243612/ai-hero-images/ni1nndzee7eawspsk1is.png)

A detailed `AGENTS.md` with navigation pointers makes the dependencies explicit:

```md
Every skill in `engineering/` or `productivity/` (the promoted buckets) must
have a reference in the top-level `README.md` and an entry in
`.claude-plugin/plugin.json`'s `skills` array. Skills in `misc/`, `personal/`,
`in-progress/`, and `deprecated/` must not appear in either.
```

## The Cost of Stale Pointers

Navigation pointers go out of date. Here's the danger: if you move a file but forget to update its pointer in `AGENTS.md`, the pointer doesn't error. It doesn't warn you. It just keeps pointing at the old location.

Now you have a highway to nowhere. The agent trusts the information in your steering files. It acts on it. A stale pointer sends it to the wrong place, wasting tokens as it tries to figure out why the file isn't there.

The rule is simple: **whenever you change your project structure, check your navigation pointers**. A stale highway is worse than no highway, because the agent believes it.

## Navigation Pointers in a Single Prompt

![Using an @-mention to add a file to context](https://res.cloudinary.com/total-typescript/image/upload/v1785243613/ai-hero-images/ixxmc9rauigey7subet2.png)

The same idea works inside a single message. When you **@-mention** a file in a prompt, you're creating a navigation pointer scoped to one [turn](https://www.aihero.dev/ai-coding-dictionary/turn):

| Scope         | Mechanism          | Location     |
| ------------- | ------------------ | ------------ |
| Every session | Navigation pointer | `AGENTS.md`  |
| One turn      | @-mention          | Chat message |

Both send the agent straight to a file without scanning. A navigation pointer in `AGENTS.md` is permanent and applies to every task. An @-mention applies to a single prompt. Same mechanism, different scope.

## When to Use Navigation Pointers

Use navigation pointers for files that are:

- Hard to discover by scanning
- Critical to change when solving a problem
- Part of non-obvious workflows

Don't use them for everything. Fewer pointers means less maintenance when your codebase changes. But for repositories where structure matters and dependencies are invisible, a good `AGENTS.md` with navigation pointers can be the difference between an agent that explores effectively and one that keeps missing key files.

<Quiz>
  <QuizQuestion data={{
    id: "navigation-pointer-for-hard-to-find-file",
    question: "Migrations keep breaking because the agent never updates the seed script, a file it does not turn up when it searches. What do you add?",
    type: "multiple-choice",
    choices: [
      { answer: "nav", label: "A one-line navigation pointer to it in AGENTS.md" },
      { answer: "inline", label: "The seed script's contents, pasted into AGENTS.md" },
      { answer: "harder", label: "A rule telling it to search harder before editing" }
    ],
    correct: "nav",
    answer: "Pasting the file pushes its whole contents into context in every session, for a file the agent only sometimes needs. Telling it to search harder leaves it on local roads - opening files one at a time - which is the thing that already failed here. One bullet naming the file and why every schema change lands there is enough to send it straight."
  }} />
  <QuizQuestion data={{
    id: "stale-pointer-costs-more-than-none",
    question: "You moved three files during a refactor. Nothing errored, the build is green, and the agent seems fine. What still needs checking?",
    type: "multiple-choice",
    choices: [
      { answer: "pointers", label: "The pointers in AGENTS.md that name the old paths" },
      { answer: "nothing", label: "Nothing - the agent will find the new paths itself" },
      { answer: "tests", label: "Whether the tests still cover the files you moved" }
    ],
    correct: "pointers",
    answer: "A stale pointer never errors and never warns, so a green build tells you nothing about it - the agent trusts it, acts on it, and burns tokens working out why the file is not there. Leaving it to find the paths by scanning gives up the reason the pointer existed. Whenever project structure changes, the pointers get checked."
  }} />
  <QuizQuestion data={{
    id: "at-mention-is-a-one-turn-pointer",
    question: "You need the agent to read one particular config file for this task, and you will not need it again after today. What matches that scope?",
    type: "multiple-choice",
    choices: [
      { answer: "atmention", label: "@-mention the file in the message you are writing" },
      { answer: "navpointer", label: "Add the file to the Navigation section of AGENTS.md" },
      { answer: "describe", label: "Describe the folder and let the agent scan for it" }
    ],
    correct: "atmention",
    answer: "A pointer in AGENTS.md is permanent and applies to every task, so a file you need once would ride along in every session after this one, and would be one more line to keep current. Leaving it to scan puts the agent back on local roads, spending tokens on the journey. An @-mention is the same mechanism scoped to a single turn."
  }} />
</Quiz>

