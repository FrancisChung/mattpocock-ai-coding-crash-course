# Enforcing Your Coding Standards

<CommitMap packageManager="npm">
  <Commit id="add-coding-standards">Start the lesson: a one-line `CODING_STANDARDS.md` added to the repo</Commit>
</CommitMap>

There is a line inside the `/implement` [skill](https://www.aihero.dev/ai-coding-dictionary/skill) that is easy to gloss over:

```
Once done, use /code-review to review the work.
```

It is worth stopping on. Code review is where you get to impose your own coding standards on the [agent](https://www.aihero.dev/ai-coding-dictionary/agent).
![The /implement skill showing the code review line](https://res.cloudinary.com/total-typescript/image/upload/v1786109399/ai-hero-images/ikostxyi7dtrewrfwqwn.png)

## Three Levels Of Checks

There are really three levels of checks you want running on your code before you ship it.

| Level | What it catches | What it costs |
|-------|-----------------|---------------|
| Automated checks | Mechanical failures | Nothing |
| Automated review | Judgement-shaped problems | [Tokens](https://www.aihero.dev/ai-coding-dictionary/token) |
| Human review | Everything else | Your attention |

### Automated Checks

[Automated checks](https://www.aihero.dev/ai-coding-dictionary/automated-check) are linting, typecheck, and unit tests. They matter because they are deterministic. The agent can run them and always get back the same pass or fail.

They also cost you no tokens to run. They are essentially free. If everything could be done in automated checks, we would live in a dream world.

But you cannot catch every bug in an automated check. A test suite proves only the properties you asserted. So you need some kind of reviewing system on top.

### Human Review

Before AI, that reviewing system was a human. Someone looked at the pull request and said: that does not look right. That test is not doing what we think it is doing. Have you considered this approach?

In other words, the human was providing qualitative feedback. Saying, I am not sure about this.

And [human review](https://www.aihero.dev/ai-coding-dictionary/human-review) was always everyone's least favourite part of development. You would always have a stack of pull requests you needed to review, and it was painful.
![Stack of pull requests waiting for review](https://res.cloudinary.com/total-typescript/image/upload/v1786109399/ai-hero-images/sdnryyet4az1ro9akv85.png)

### Automated Review

Now agents can help. [Automated review](https://www.aihero.dev/ai-coding-dictionary/automated-review) means the agent reviews your work and provides the qualitative feedback itself.

Crucially, this does not replace human review. It makes human review easier, because the agent has already walked through the diff and done a first pass. Automated review catches more than you would catch without it. You still want a human doing a sanity check on top for most types of work.

That is what the code review skill is doing. You implement in one [context window](https://www.aihero.dev/ai-coding-dictionary/context-window), then you review in a fresh one.

## The Two Axes

The review runs along two axes. The Spec axis asks whether the code faithfully implements what was asked for:

```
- **Spec** — does the code faithfully implement the originating issue / PRD / spec?
```

The other axis is standards. Coding standards matter because you do not want your agent making the same mistake again and again and again. Those steering instructions have to live somewhere.

Slotting them into `CLAUDE.md` is painful, and it has real downsides. Code review is an interesting case, though, because the skill lets you customise it. You create your own `CODING_STANDARDS.md` file.
## CODING_STANDARDS.md

The file just sits there and captures the coding standards for the repo. When you notice the agent doing something weird, you put it in the standards file, and the review catches it next time.

A brand new one can be a single line:

```
Don't do stupid stuff.
```

The skill finds it during its third step, when it works out where this repo documents how code should be written:

```
Anything in the repo that documents how code should be written, such as `CODING_STANDARDS.md` or `CONTRIBUTING.md`.
```

That step is the seam you are writing into.

## Why Standards Belong In Review

The reason this makes sense is that code review is a lot less constrained than implementation is.

When you implement something, you have to explore where it fits in the codebase, write all the files, and then debug it to see whether it actually works. Three demands, all in one context window.

Code review has none of them. You do not need the exploration, because the exploration has already been done and you are handed the right file straight away. You do not need to make many changes, because you are reading what is there. And you carry no burden for testing that everything works, because the tests have been written and run already.

| | `/implement` | Code review |
|---|---|---|
| Explore the codebase | Yes | No |
| Write the files | Yes | No |
| Debug and test | Yes | No |

So it makes much more sense to load the coding standards into code review than to try to make the implementer get it right first time. The review agent has a lot more space in its context window, and far fewer demands on it.

![Comparison of demands on the implementer vs the code review agent](https://res.cloudinary.com/total-typescript/image/upload/v1786109400/ai-hero-images/aufn60fjsehd37ywisn9.png)

## What A Real Standards File Looks Like

A mature standards file is loose, and that is fine. Every line in one arrives the same way: you noticed the agent do something stupid, and you wrote it down.
![A real CODING_STANDARDS.md file from the course video manager repo](https://res.cloudinary.com/total-typescript/image/upload/v1786109402/ai-hero-images/c2vq3ht40orxwv9vjyke.png)

```
Context menu items should always include a leading icon (from `lucide-react`), matching the style of the surrounding items. When adding a new menu item, pick an icon that conveys the action.
```

That one exists because, for some reason, the agent just was not adding icons.

```
All files in `./app/routes` will be exposed publicly as routes. Do not include test files or utility files there.
```

You could break a file like this down and put parts of it behind [context pointers](https://www.aihero.dev/ai-coding-dictionary/context-pointer). If a rule only makes sense for front-end work, that is where it belongs. But since the standards file is only ever loaded during code review, its size matters much less than it would in an always-on steering file. It is fine for it to get quite large.

## The Baseline You Get For Free

Even with no standards file at all, the Standards axis still carries a set of code smells drawn from Martin Fowler's *Refactoring*:
![Code smells from Martin Fowler's Refactoring book listed in the skill](https://res.cloudinary.com/total-typescript/image/upload/v1786109403/ai-hero-images/hr71xvfksiwidzt3m4s2.png)

```
- **Feature Envy** — a method that reaches into another object's data more than its own. → move the method onto the data it envies.
```

Shotgun Surgery. Divergent Change. Mysterious Name. These are classic coding terms, so agents already know all about them. The review will often find something even when you have documented nothing.

Your own file sits on top of that baseline and overrides it. Where your repo endorses something the baseline would flag, the flag goes away.

## Don't Shout At The Agent

Here is the habit worth building. Next time you finish an implementation and notice something you do not like, do not shout at the agent.

Write it into `CODING_STANDARDS.md` instead, so the reviewer catches it.

Nice work, and I will see you in the next one.

<Quiz>
  <QuizQuestion data={{
    id: "standards-live-in-review-not-implement",
    question: "You keep noticing the agent write code that breaks one of your repo conventions. Where do you write the rule down?",
    type: "multiple-choice",
    choices: [
      { answer: "standards", label: "In CODING_STANDARDS.md, so the review catches it" },
      { answer: "claude", label: "In CLAUDE.md, so the implementer reads it every time" },
      { answer: "prompt", label: "In the prompt, restated for each piece of work" },
      { answer: "lint", label: "Nowhere, because the linter should catch it" }
    ],
    correct: "standards",
    answer: "Implementation already carries three demands on one context window: explore, write, debug. Review carries none of them, so it has the room to hold your standards. CLAUDE.md pays for the rule in every window whether it applies or not, a per-task prompt is a rule you have to remember, and a convention that a linter can enforce would not have needed writing down."
  }} />
  <QuizQuestion data={{
    id: "automated-check-vs-automated-review",
    question: "What separates an automated check from an automated review?",
    type: "multiple-choice",
    choices: [
      { answer: "deterministic", label: "A check is deterministic and free; a review is qualitative and costs tokens" },
      { answer: "speed", label: "A check runs faster, but they catch the same class of problem" },
      { answer: "stage", label: "A check runs before the commit; a review runs after it" },
      { answer: "human", label: "A check is run by tooling; a review is only ever run by a human" }
    ],
    correct: "deterministic",
    answer: "Linting, typecheck and tests give the same pass or fail every run and cost nothing, which is exactly why they cannot deliver judgement. Review is the judgement layer, and it is paid for in tokens. Both can run at the same stage, and a review can be run by an agent or a human."
  }} />
  <QuizQuestion data={{
    id: "code-review-smell-baseline",
    question: "You run the code review skill in a repo with no CODING_STANDARDS.md. What does the Standards axis have to work with?",
    type: "multiple-choice",
    choices: [
      { answer: "baseline", label: "A built-in set of code smells drawn from Refactoring" },
      { answer: "nothing", label: "Nothing, so the Standards axis reports no findings" },
      { answer: "claude", label: "Whatever happens to be in CLAUDE.md at the time" },
      { answer: "infer", label: "Conventions it infers by reading the whole codebase first" }
    ],
    correct: "baseline",
    answer: "Feature Envy, Shotgun Surgery, Divergent Change and the rest ship with the skill, so a repo that documents nothing still gets a review. Your own file sits on top and overrides that baseline rather than replacing it."
  }} />
</Quiz>

