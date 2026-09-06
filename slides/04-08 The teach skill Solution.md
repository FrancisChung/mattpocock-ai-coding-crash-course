# The /teach Skill Solution

The [agent](https://www.aihero.dev/ai-coding-dictionary/agent) starts by looking through the directories and examining the actual codebase. It reads the readme and `package.json`, diving deeper than a surface-level scan.

No [sub-agent](https://www.aihero.dev/ai-coding-dictionary/subagent) gets spawned for this work — it's all exploration happening in the main [context](https://www.aihero.dev/ai-coding-dictionary/context). Once it has explored enough, the agent says it's got a solid picture and is ready to set up the teaching workspace.

## Setting up the teaching workspace

The `/teach` [skill](https://www.aihero.dev/ai-coding-dictionary/skill) puts together several key files to ground your learning. Here's what gets created:

- `MISSION.md` — Your learning goal and success criteria
- `NOTES.md` — A learner profile describing what you know and what you don't
- `RESOURCES.md` — [Primary sources](https://www.aihero.dev/ai-coding-dictionary/primary-source) like official docs and community links
- `assets/lesson.css` and `assets/quiz.js` — Shared stylesheets and quiz components that every future lesson reuses
- `lessons/` — HTML lessons designed for your exact level
- `reference/glossary.html` — A reference doc you'll return to
- `learning-records/` — [Stateful](https://www.aihero.dev/ai-coding-dictionary/stateful) records of where you are in your learning journey

The agent has found primary sources and written them into `RESOURCES.md`. These include React Router v7 docs about data loading and actions, along with other official documentation.

![MISSION.md file showing the learning goal: understanding the AI Coding Crash Course codebase](https://res.cloudinary.com/total-typescript/image/upload/v1784724046/ai-hero-images/po6rkhaqzm12vkuyisjy.png)

## The first lesson: The Round Trip

The agent creates a glossary and generates the very first lesson, then opens it for you to read.

```
Lesson 01: The Round Trip
What actually happens between typing a URL and seeing a page —
traced through one real file in your repo.
```

The lesson is formatted and designed exactly for where you need to be. It references the exact URLs in the application and describes them in the idiomatic language that the official docs use.

![The Round Trip lesson HTML page open in browser](https://res.cloudinary.com/total-typescript/image/upload/v1784724046/ai-hero-images/fhfsajuywfkojmkcsfon.png)

Here's what the lesson walks you through:

| Step | What happens                                              | Where  |
| ---- | --------------------------------------------------------- | ------ |
| 1    | Router matches the URL against a literal list of patterns | Server |
| 2    | The loader function runs                                  | Server |
| 3    | The component renders                                     | Server |
| 4    | The browser paints the HTML                               | Client |
| 5    | Hydration happens                                         | Client |

The line `route("courses", "routes/courses.tsx")` in `app/routes.ts` tells you that the path `/courses` is handled by that file.

## The tricky bit: Same component, two machines

There's an important callout in the lesson. In steps 3 and 5, the same component function runs twice — once on the server, and once in the browser. The `loader`, by contrast, runs only on the server, every single time.

This asymmetry is the core concept you need to understand.

When the lesson shows you the real file, it strips away everything but what matters:

```typescript
// app/routes/courses.tsx

export const loader = async (args: LoaderFunctionArgs) => {
  // ...
};

export default function CourseCatalog() {
  // ...
}

export const ErrorBoundary = () => {
  // ...
}

export const meta = () => {
  // ...
}
```

Those export names — `loader`, `default`, `ErrorBoundary`, `meta` — are a contract. React Router looks them up by exact name. Renaming `loader` to `fetchData` would break everything.

## Testing your understanding with quizzes

The lesson includes interactive quizzes. Each question tests a single idea:

1. Which file tells you that `/courses` is handled by `courses.tsx`?
    - **The file `app/routes.ts` lists it**

2. How many times does the default-exported component run?
    - **Twice: server first, then browser**

3. Where does a route's loader function actually execute?
    - **Only on the server, every time**

4. Renaming loader to `fetchData` in a route file would...
    - **Break it: the name is a contract**

5. Searching courses filters the list by doing what?
    - **Re-running the loader on the server**

Notice that each answer is the same length. The formatting doesn't give away clues about which one is right.

![Interactive quiz showing multiple choice questions about React Router](https://res.cloudinary.com/total-typescript/image/upload/v1784724047/ai-hero-images/oqwbpoh7xqi9euz3zoia.png)

## Do this now: Prove it to yourself

Reading is not learning. The lesson asks you to run the app and prove the boundary to yourself.

Add this to your loader:

```typescript
console.log("LOADER RAN");
```

And this to your component:

```typescript
function CourseCatalog() {
  console.log("COMPONENT RAN");
  // ...
}
```

Now predict: where will each log appear? The terminal? The browser devtools? Both? Run it and see what surprises you.

## Stateful learning: You can clear context anytime

The `/teach` skill is designed to be stateful. It saves learning records into the `learning-records/` directory — little markdown files that track exactly where you are in your journey.

`MISSION.md` grounds the agent in your goal. These two files together mean you can almost [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) the context at any time and the agent will pick up exactly where you left off.

## The agent is your teacher

Inside the teaching workspace, you can ask the agent follow-up questions:

- "Why does the component run twice?"
- "What breaks if I put a database call in the component?"
- "What's `LoaderArgs`?"

Any of it. Half of learning a codebase is asking the question early instead of guessing for a week.

## Getting the most from /teach

Take a break from the main course and work through the teach skill until you understand deeply everything about the codebase. Become an absolute expert in navigating it.

This gives you a massive leg up when you then go to implement features, which happens very soon.

This is the technique recommended for learning any new repository:

1. Create a new teaching workspace just for that repo
2. Tell the agent where you're at
3. Tell it what you understand
4. Tell it what you don't understand
5. Let it teach you

The `/teach` skill works on all sorts of things. You can use it to learn how to solve a Rubik's Cube, how to feed your kids better food, or how to review an AI-generated codebase with confidence.

This is a good example of how to write a good skill.
