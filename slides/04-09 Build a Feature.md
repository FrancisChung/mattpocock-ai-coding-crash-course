# Build a Feature

<CommitMap packageManager="npm">
  <Commit id="make-a-schema-change">Start the lesson: the repo before any rating feature exists</Commit>
  <Commit id="course-star-ratings">See my solution: the star rating system the agent built</Commit>
</CommitMap>

You now understand the codebase and how exploration works. It's time to actually build something.

You're going to create a course review system where students can leave star ratings on courses. This is a deliberately meaty feature - it touches the database schema, migrations, service layer, routes, and UI components. But it's well scoped and doesn't demand complex UI work.

Before you start building, this exercise is a baseline for the rest of the course. You'll see what happens when you prompt an [agent](https://www.aihero.dev/ai-coding-dictionary/agent) directly. Later lessons will teach you techniques to improve on this approach. For now, pay close attention to [context](https://www.aihero.dev/ai-coding-dictionary/context) usage as the agent works, and observe how your setup explores the codebase.

## Your Task

Build a course review system with these requirements:

- Students can leave a **1-5 star rating** on courses (no written reviews yet)
- Ratings appear as a **global average** visible to all users
- The average rating displays on both the course list page and the course detail page
- Students should see a way to select a star rating on the course page

Think about what the user will see, then work backwards from there.

## Steps To Complete

### Set Up Your Prompt

- [ ] Open your agent in the repository

The repo is already set up and ready. You'll be prompting the agent to build the feature.

### Think About the Feature

Before you write your prompt, consider:

- Where should the star-rating widget appear?
- How should the average rating be calculated and stored?
- Which database tables and API routes will need to change?
- Should there be any restrictions on who can rate (for example, should instructors be able to rate their own courses)?

Don't over-engineer this, just think through the user flow.

### Write Your Prompt

- [ ] Write a clear, concise prompt asking the agent to build the course review system

Keep it focused. Mention:

- That students can leave a star rating (1-5 stars)
- That ratings should be visible as an average on the course list and course page
- That this is star-rating only (no written reviews)

### Run the Build

- [ ] Send your prompt to the agent and let it build

As the agent works, observe:

- **Context usage**: Watch the context counter tick upward. What kinds of changes drain the most context?
- **Exploration**: Does the agent spawn a [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) to explore, or does it explore in its main window?
- **File changes**: How many files does it touch? Is it adding new files or modifying existing ones?

### Verify the Feature Works

- [ ] Run the dev server with `npm run dev`

Once the build completes, test the feature:

- Log in as a student (use the dev UI to switch users if available)
- Navigate to a course page
- Find the star-rating widget
- Leave a rating
- Check that the average rating displays on the course list and course detail page
- Verify the rating persists when you refresh the page

### Observe the Baseline

- [ ] Take notes on what happened

This is your baseline. In later lessons, you'll learn techniques to make this process smoother and more efficient. For now, document:

- How many files were modified or created?
- What was the quality of the implementation?
- Did the agent make any assumptions you didn't expect?
- What would you improve about this approach?

