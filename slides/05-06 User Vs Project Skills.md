# User Vs Project Skills

[Skills](https://www.aihero.dev/ai-coding-dictionary/skill) can live in one of two places, and the choice matters.

## Two Levels for Skills

The first level is your **user directory** at `~/.agents/skills`. A skill there is personal to you and follows you everywhere: every project you open on your machine has it available.

The second level is the **project itself**, in its `.agents/skills` folder. A skill there is checked into the repo, scoped to that one project, but shared with anyone who clones the repository.

![User-level skills directory at ~/.agents/skills/](https://res.cloudinary.com/total-typescript/image/upload/v1785242729/ai-hero-images/bhc0ovk7ovgjqph5rz4m.png)

**Personal and portable, versus shared and checked in.** That's the choice.

## Where Skills Live

| Level   | Location            | Scope                 | Sharing                         |
| ------- | ------------------- | --------------------- | ------------------------------- |
| User    | `~/.agents/skills/` | Personal to you       | Global across all your projects |
| Project | `.agents/skills/`   | Scoped to one project | Shared with everyone who clones |

Skills at the user level are the same under two conventions, you'll also see them referred to as living in `~/.claude/skills/`. Both paths refer to the same set of skills on your machine.

![Project-level skills directory inside the repository](https://res.cloudinary.com/total-typescript/image/upload/v1785242730/ai-hero-images/d8pqicjizgx7okziz1vs.png)

At the project level, skills are checked into the repository. This means they're part of the git history and automatically shared with everyone who clones the project. The project `ai-coding-crash-course` includes five skills at this point:

```
.agents/skills/database-migrations/
.agents/skills/grill-me/
.agents/skills/grilling/
.agents/skills/handoff/
.agents/skills/writing-for-agents/
```

## How to Choose: Personal or Team?

Here's the rule: If it's a personal quality-of-life thing, the way you like to work or a shortcut that's yours, put it in your user directory.

The moment a skill is something the team relies on, something that encodes how this project is meant to be worked, it belongs in the project. The project is the stronger default, because:

- It's version-controlled
- It evolves with the codebase
- Everyone who clones the repo gets it automatically
- You never have to tell a teammate to install anything

When in doubt, and it's about the work rather than about you, put it in the project.

## Two Different Flavors

| User-Level | Project-Level  |
| ---------- | -------------- |
| Personal   | Checked-in     |
| Global     | Single-project |
|            | Communal       |

**Personal:** It's yours alone, nobody else sees it, and nobody else has to use it.

**Global:** It follows you everywhere. Install it once in your user directory, and it's available in every project you open on your machine with no setup and no copying.

**Checked-in:** The skill is part of your repository. It's tracked in git history and travels with the project.

**Single-project:** It won't follow you to your next project, but it's scoped to this one for good reason.

**Communal:** Everyone who edits the project can also contribute to the skill. The skill automatically grows with the project, and everyone on the team gets to build it up over time.

![Whiteboard diagram showing user-level vs project-level skill characteristics](https://res.cloudinary.com/total-typescript/image/upload/v1785242731/ai-hero-images/uazwufxlurewh35auiec.png)

## Solo or Team?

If you're working mostly solo, user-level skills are probably going to be more convenient because they follow you everywhere.

As soon as you have a team or multiple people contributing to the same project, project-level skills are the way to go. They become really beneficial for everyone working in the codebase.

<Quiz>
  <QuizQuestion data={{
    id: "skill-scope-team-vs-personal",
    question: "A skill encodes how database migrations must be run in this repo, and two teammates keep getting it wrong. Where does it belong?",
    type: "multiple-choice",
    choices: [
      { answer: "project", label: "The project's .agents/skills, checked into the repo" },
      { answer: "user", label: "Your ~/.agents/skills, so it follows you everywhere" },
      { answer: "copy", label: "Your user directory, and you tell them to copy it" }
    ],
    correct: "project",
    answer: "A skill in your user directory is personal to you and nobody else sees it, so the two teammates getting it wrong still get nothing. Telling them to copy it makes every person repeat the work by hand and lets the copies drift apart. Checked in, it arrives with the clone, sits in git history, and anyone on the team can improve it."
  }} />
  <QuizQuestion data={{
    id: "user-level-skill-follows-the-machine",
    question: "You have a shortcut for how you personally like to phrase things, and you want it in every repo you open. Where does it belong?",
    type: "multiple-choice",
    choices: [
      { answer: "user", label: "Your user directory, global across your projects" },
      { answer: "project", label: "Each project's skills folder, checked in one by one" },
      { answer: "template", label: "A repo you clone into every new project you start" }
    ],
    correct: "user",
    answer: "Checking a personal quality-of-life habit into each project puts your taste in everyone's repository and makes you redo it per project - the project level is for what the team relies on. Cloning it in each time is the manual copying the user directory exists to remove. Installed once in your user directory, it is there in every project with no setup."
  }} />
</Quiz>
