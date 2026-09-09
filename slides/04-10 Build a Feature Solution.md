# Build a Feature Solution

<CommitMap packageManager="npm">
  <Commit id="make-a-schema-change">Start the lesson: the repo before any rating feature exists</Commit>
  <Commit id="course-star-ratings">See my solution: the star rating feature, with the bundling bug fixed</Commit>
</CommitMap>

The foundation for this [session](https://www.aihero.dev/ai-coding-dictionary/session) is a clear feature request: a course review system where students can leave star ratings (no written reviews, just ratings). These ratings should be visible everywhere courses appear, with average ratings shown on both the course list page and individual course pages.

## Starting the Build

With a solid prompt in hand, the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) begins exploration. It starts by reading the codebase structure to understand how to implement this feature effectively. Within the first few interactions, it's already consumed about 20k [tokens](https://www.aihero.dev/ai-coding-dictionary/token), exploring config files, testing files, and the overall structure.

![Agent starting to explore the codebase structure](https://res.cloudinary.com/total-typescript/image/upload/v1784724339/ai-hero-images/offqibxtnjm9ktobkjdx.png)

## Implementation Begins

The agent jumps straight into implementation with confidence, no clarifying questions asked. Here's the order it tackles the feature:

1. **Schema** - Creates a `course_ratings` table in SQLite with fields for `userId`, `courseId`, and `rating` (1-5 whole numbers). It adds a migration script to apply the schema change.

2. **Service layer** - Builds `courseRatingService` with functions like `rateCourse` (insert-or-update), `findRating`, and `getCourseRatingSummary` for calculating the average rating.

3. **Test coverage** - Writes 17 tests for the service to verify behavior.

4. **React components** - Creates `StarRating` for displaying average ratings and `StarRatingInput` for interactive rating submission.

5. **Integration** - Wires the rating widget into the course list page and course detail page.

![The generated schema showing the course_ratings table structure](https://res.cloudinary.com/total-typescript/image/upload/v1784724340/ai-hero-images/vpatmro2t99njzlcu5rn.png)

## Verification and Testing

Rather than just shipping code, the agent goes the extra mile:

- Runs the full test suite, 295 tests passing
- Uses TypeScript's `typecheck` to verify all types are correct
- Improves the seed script so test data includes ratings
- Starts a dev server and performs smoke tests using `curl`

To verify the implementation actually works, it makes HTTP requests to the running dev server and greps the response for "Rated" text to confirm ratings appear on the pages.

```bash
curl -s http://localhost:5173/courses | grep -o 'Rated [^"]*' | head -5
```

This kind of [automated verification](https://www.aihero.dev/ai-coding-dictionary/automated-check) shows the agent is thinking about whether its work actually solves the problem, not just whether it compiles.

## The Build Summary

After all this work, the agent provides a summary of what was built:

- Schema with a `course_ratings` table and unique index on `(user_id, course_id)` so users can only rate a course once
- Service with validation, upsert logic, and batch lookup functions
- Components for both displaying and submitting ratings
- Integration into course list and course detail pages
- Updated seed data with ratings for 6 courses
- Full end-to-end verification

The entire feature consumed about 75k tokens, well within the "[smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)" for agent work.

## Viewing the Results

![The course list page now shows star ratings under each course](https://res.cloudinary.com/total-typescript/image/upload/v1784724341/ai-hero-images/hhdvz51fog3l8baszycu.png)

Loading the application in the browser shows the ratings working as expected. Each course displays its average rating prominently.

## The Critical Bug

But there's a problem. When testing interactively, the dev UI stops responding, the user switcher no longer works. Clicking to change a rating causes the entire page to refresh instead of updating instantly. Something is seriously wrong.

![Browser console showing the promisify error](https://res.cloudinary.com/total-typescript/image/upload/v1784724342/ai-hero-images/tjvdpvmbmvrxc4rdp5nq.png)

## Diagnosing the Issue

Opening the browser developer console reveals the smoking gun: an uncaught `TypeError: promisify is not a function`. This is a classic React Router / Vite bundling issue.

```txt
Uncaught TypeError: promisify is not a function
    at node_modules/better-sqlite3/lib/methods/backup.js
```

The error shows that `better-sqlite3` (the database driver) somehow got bundled into the browser JavaScript. The browser environment doesn't have Node.js utilities like `util.promisify`, so the code fails.

## Posting the Bug Back

I copy the console error and paste it back into the agent with a message: "This is happening in the browser console, and it's making things go weird."

## The Agent's Diagnosis

The agent quickly identifies the root cause:

> Good catch, that's my bug. `star-rating.tsx` (a client component) imports `MAX_RATING` from `courseRatingService`, which imports the database module. That drags the whole database driver into the browser bundle.

The problem is architectural: client-side components shouldn't import from modules that depend on server-only code. While React Router normally strips out `loader` and `action` functions from the client build, it can't protect against a component directly importing from a service that uses the database.

## The Fix

The solution is clean and minimal. Move the rating constants to a module with zero server dependencies:

```typescript
// app/lib/ratings.ts
// Rating bounds live here rather than in courseRatingService so that client
// components can import them without pulling the database driver into the
// browser bundle.

export const MIN_RATING = 1;
export const MAX_RATING = 5;
```

Now `star-rating.tsx` imports from `app/lib/ratings.ts` instead of from the service. The component gets what it needs without triggering a massive dependency chain.

## Verification After the Fix

After updating the code, the agent verifies the fix by:

- Checking the Vite dev server's module transform output
- Grepping the production bundle for `better-sqlite3` (finds zero instances)
- Testing the application again to confirm interactive features work

![The course page now updates ratings instantly without full page refresh](https://res.cloudinary.com/total-typescript/image/upload/v1784724343/ai-hero-images/ggnsayu4mauz2wt74895.png)

The dev UI responds properly, the user switcher works, and clicking a star to rate a course updates the average instantly instead of triggering a full page reload.

## Summary: What Went Right and Wrong

| Aspect         | Result                                                     |
| -------------- | ---------------------------------------------------------- |
| Exploration    | Thorough, no [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) needed                               |
| Implementation | Complete end-to-end feature                                |
| Testing        | Comprehensive: unit, type, integration, smoke tests        |
| Token usage    | ~75k for build, ~90k total (smart zone)                    |
| Production bug | Shipped a critical bundling issue                          |
| Bug fix        | Identified and resolved quickly once feedback was provided |

The agent demonstrated solid engineering practices: exploration, test-driven development, verification, and the ability to learn from feedback. However, it did ship a bug that broke interactive features, suggesting gaps in how it reasons about client vs. server boundaries in modern frameworks.

Overall, I would say not a great showing. However, I think there's definitely some improvements to be made, and we'll tackle those next.

