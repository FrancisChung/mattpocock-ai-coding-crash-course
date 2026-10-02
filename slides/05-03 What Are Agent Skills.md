# What Are Agent Skills?

The pattern of a document paired with a pointer works well, but it hits an interesting constraint. Everything about it lives just inside one repository. There's no easy way to package it up and ship it to your teammates.

You can't carry these between projects - they have to be manually extracted and pasted in each time. Every instance means copying files by hand, and every team member has to repeat the work.

## Skills: A Pointer, Packaged

This problem is what [skills](https://www.aihero.dev/ai-coding-dictionary/skill) are designed for. A **skill** is the same setup you saw before, a pointer to a document, but packaged and standardized. It's a self-contained folder that does the same job as the doc-plus-pointer approach. You keep the steering files on disk and pull them in only when they're relevant, bundled into one portable, shareable unit.

A skill folder contains a `SKILL.md` file (the main document), alongside any supporting files it needs. Here's what makes skills portable:

![Skill folder structure showing SKILL.md file](https://res.cloudinary.com/total-typescript/image/upload/v1785240639/ai-hero-images/upofvz83alclqqmxpj1a.png)

- **One line always on**: the skill's name and description
- **Everything else loads on demand**: the body and any linked files only load when the agent reaches for them
- **Bundled together**: all files live in one folder, ready to share

The description acts as the [context pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer) for the [agent](https://www.aihero.dev/ai-coding-dictionary/agent). It reads the description to decide whether the skill is relevant right now. Once it sees the description, it decides whether to load that skill into its [context window](https://www.aihero.dev/ai-coding-dictionary/context-window).

For example, a skill called `writing-for-agents` with the description "Writing documents for agents. Use when creating or editing skills, or modifying AGENTS.md or CLAUDE.md." tells the agent exactly when to reach for it.

![writing-for-agents skill showing frontmatter with name and description](https://res.cloudinary.com/total-typescript/image/upload/v1785240640/ai-hero-images/k7kipxybnnpvucxf0931.png)

## More Than One File

A skill isn't limited to a single file. Everything inside the skill folder gets bundled in with it. So a skill might contain:

- `SKILL.md` (the main entry point)
- Supporting files like `SKILL-MECHANICS.md`
- Additional reference materials

The main `SKILL.md` can point to these supporting files with context pointers, and the agent follows those links only when it needs them. This is [progressive disclosure](https://www.aihero.dev/ai-coding-dictionary/progressive-disclosure) one layer down - the agent pays no context load for the supporting files until it commits to using the skill.

For instance, you might write in `SKILL.md`: "When the document you're writing is a skill, read `SKILL-MECHANICS.md` for frontmatter, invocation choice, and router skills."

![SKILL.md showing context pointer to SKILL-MECHANICS.md](https://res.cloudinary.com/total-typescript/image/upload/v1785240641/ai-hero-images/zesddzibslodabbzkaeu.png)

This creates a layered structure:

- Context window → name and description
- Name and description → `SKILL.md`
- `SKILL.md` → `SKILL-MECHANICS.md` (and other files)

![Diagram showing layered structure from context window to SKILL.md to reference files](https://res.cloudinary.com/total-typescript/image/upload/v1785240641/ai-hero-images/pkxlmmnoe4k561xrijtc.png)

## The Open Standard

Skills are an open standard, defined at [agentskills.io](https://agentskills.io/home). This is significant because a skill written once for one agent can work in pretty much any agent that supports skills. They're totally portable.

This portability means you can:

- Write a skill once
- Share it with your team
- Reuse it across projects
- Package huge amounts of information into one portable unit

## Two Ways To Invoke A Skill

There are two main ways a skill can get invoked, and they trade off two different kinds of load:

| Invocation Type   | How It Works                                                                                                 | Context Load | Cognitive Load                |
| ----------------- | ------------------------------------------------------------------------------------------------------------ | ------------ | ----------------------------- |
| **Model-invoked** | Description is in the context window. The agent can see it, notice it's relevant, and pull it in on its own. | Higher       | Lower                         |
| **User-invoked**  | Description is hidden from the agent. Only you can invoke it by typing its name.                             | Zero         | Higher (you must remember it) |

The difference comes down to a single line in the skill's frontmatter.

### Model-Invoked Skills

Keep the description in the frontmatter and the agent can discover the skill autonomously. The agent reads the description, recognizes when it's relevant, and invokes it without you mentioning it. You can still type the skill's name yourself - model-invocation always includes user reach, it just adds agent discovery on top.

The description is the skill's top-level context pointer, and it stays loaded at all times. That's a permanent context load, but you get automatic discoverability.

### User-Invoked Skills

Add `disable-model-invocation: true` to the frontmatter to hide the description from the agent. Now only you can invoke the skill by name - the agent can't reach it at all, even if it would be helpful. Zero context load, but you have to remember the skill exists and remember to use it.

Here's what a user-invoked skill's frontmatter looks like:

```markdown
---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
disable-model-invocation: true
---
```

With `disable-model-invocation: true`, the description becomes human-facing rather than agent-facing - a one-line summary for you to read, not for the agent to parse.

![handoff skill frontmatter showing disable-model-invocation: true](https://res.cloudinary.com/total-typescript/image/upload/v1785240642/ai-hero-images/obx95tezqnbl6wukehfu.png)

## The Trade-Off

The choice between model-invoked and user-invoked is a trade-off:

- **More model-invoked skills** = higher context load, but the agent can discover them
- **More user-invoked skills** = zero additional context load, but higher cognitive load on you

There's something appealing about paying zero context load for user-invoked skills. You can have a lot of them without bloating your context window. This is why many personal skill sets tend to lean toward user-invoked skills - they're "free" in terms of [context](https://www.aihero.dev/ai-coding-dictionary/context).

## Listing Your Skills

To see what skills you have available, run the `/skills` command. This brings up a menu listing the name and description of every skill you have access to. This is the context load you're paying - one line per model-invoked skill.

![/skills command output showing list of available skills](https://res.cloudinary.com/total-typescript/image/upload/v1785240643/ai-hero-images/zduh7hycsbb04qoqwwvy.png)

In that list, you'll see which ones are user-invoked. For example:

- `grill-me` is user-invoked (no description shown to the agent)
- `writing-for-agents` is model-invoked (description shown to the agent)

You can invoke user-invoked skills by typing their name, just like any command.

## Skills as Portable Pointers

A skill is just a pointer, packaged. It's the same setup as a document in your repository with a pointer line in `AGENTS.md`, except here you can:

- Bundle it up
- Pass it to your team
- Distribute it on the web
- Carry it between projects

The concept of something you can easily share is powerful. And now you're ready to build one.

<Quiz>
  <QuizQuestion data={{
    id: "skill-description-is-the-pointer",
    question: "For a skill the agent can discover on its own, what is sitting in the context window at all times?",
    type: "multiple-choice",
    choices: [
      { answer: "namedesc", label: "The skill's name and description, one line" },
      { answer: "skillmd", label: "All of SKILL.md, minus the supporting files" },
      { answer: "folder", label: "Every file bundled inside the skill's folder" }
    ],
    correct: "namedesc",
    answer: "The body of SKILL.md and any file it links to load only when the agent reaches for the skill, so neither is in the window up front. Bundling puts the files in one folder so the skill can be shared - it does not put them in context. One line per discoverable skill is the whole standing cost."
  }} />
  <QuizQuestion data={{
    id: "model-vs-user-invoked-choice",
    question: "You wrote a skill you will need maybe twice a month, and you know you will forget it exists. Which frontmatter do you ship?",
    type: "multiple-choice",
    choices: [
      { answer: "model", label: "Leave the description on, so the agent can find it" },
      { answer: "user", label: "Set disable-model-invocation and invoke it by name" },
      { answer: "inline", label: "Paste the skill's body into AGENTS.md instead of it" }
    ],
    correct: "model",
    answer: "Hiding the description costs zero context load, but the agent cannot reach the skill at all, and the cognitive load lands on you - which is exactly what fails for a skill you will forget. Pasting the body into AGENTS.md pays for the whole document on every request rather than one line. One description line buys the agent the chance to notice it."
  }} />
  <QuizQuestion data={{
    id: "skill-supporting-file-disclosure",
    question: "Your SKILL.md has grown a long section on frontmatter details that matters in one case out of ten. What do you do with that section?",
    type: "multiple-choice",
    choices: [
      { answer: "split", label: "Move it to a second file, pointed at from SKILL.md" },
      { answer: "keep", label: "Keep it in SKILL.md, since the folder ships as one" },
      { answer: "second", label: "Make it a separate skill with its own description" }
    ],
    correct: "split",
    answer: "Leaving it in SKILL.md means it loads every time the skill fires, including the nine cases where it does not apply - the folder shipping as one unit is about sharing, not about what enters the window. A separate skill adds another description line that is loaded permanently. A pointer to a supporting file costs nothing until the agent follows it."
  }} />
</Quiz>
