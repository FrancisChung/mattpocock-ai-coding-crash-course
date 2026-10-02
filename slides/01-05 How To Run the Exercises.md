# How To Run the Exercises

<CommitMap>
  <Commit id="main">Start the lesson: the course repo exactly as you clone it</Commit>
  <Commit id="try-the-cli">Verify the tooling: the checkpoint that changes the `description` field in `package.json`</Commit>
</CommitMap>

This course works by giving you exercises to complete - plan this feature, add this change, fix this bug. The challenge with any code course is drift: you make a change the video didn't make, and three lessons later your codebase and the one on screen are different.

To fix that, there are three CLI tools built into the project. They let you jump to any exercise's starting state on demand.

| Command               | What it does to your work                    |
| --------------------- | -------------------------------------------- |
| `npm run reset`       | Replaces it - your commits are gone          |
| `npm run cherry-pick` | Adds to it - checkpoint lands on top         |
| `npm run pull`        | Updates around it - fetches upstream changes |

## Steps To Complete

### Create Your Development Branch

- [ ] Create a new `dev` branch to work from

This is your throwaway learning branch. All three tools work on this branch, and it keeps `main` clean.

```bash
git checkout -b dev
```

> ⚠️ If you skip this step, the tools will refuse to run. You'll see errors like `Cannot reset to main while on the main branch.`

### Reset to an Exercise Checkpoint

- [ ] Run `npm run reset` to see the full list of course checkpoints

```bash
npm run reset
```

This opens an interactive picker showing every checkpoint in the course, in order. You can type to search - for example, typing `try the cli` will narrow to `try-the-cli`.

![The npm run reset interactive picker showing the list of course checkpoints](https://res.cloudinary.com/total-typescript/image/upload/v1786013951/ai-hero-images/mv0uyjie1uuavdlghzsi.png)

- [ ] Select a checkpoint and choose **Reset current branch**

The tool will rewind your branch to that exact commit. You'll see output like:

```txt
Resetting to try-the-cli...
✓ Reset to try-the-cli
```

You can also pass the checkpoint name directly to skip the picker:

```bash
npm run reset try-the-cli
```

> ⚠️ **Reset is destructive.** It rewinds the entire working branch - not just the files an exercise touches. Uncommitted work is gone. Commit or stash anything you want to keep _before_ you reset.

### Keep Your Own Work With Cherry-Pick

- [ ] Add a script to `package.json` to experiment with, for example:

```json
"foobar": "echo 'foobar'"
```

- [ ] Commit that change via VS Code's Source Control panel (`Ctrl+Shift+G`) or the terminal

- [ ] Run `npm run cherry-pick` instead of `reset`

```bash
npm run cherry-pick
```

This shows the same picker, but instead of rewinding your branch, it **applies the checkpoint's commit on top of your existing work**. Your commits stay underneath it.

```txt
Cherry-picking c4a46e5 onto current branch...
✓ Successfully cherry-picked lesson try-the-cli
```

| Command               | What it does to your work                    |
| --------------------- | -------------------------------------------- |
| `npm run reset`       | Replaces it - your commits are gone          |
| `npm run cherry-pick` | Adds to it - checkpoint lands on top         |
| `npm run pull`        | Updates around it - fetches upstream changes |

> If you're not comfortable with Git and resolving merge conflicts, stick to `reset` throughout the course.

### Pull in Course Updates

- [ ] Run `npm run pull` to fetch any updates shipped to the course

```bash
npm run pull
```

This fetches from the upstream repo and brings changes into your branch. It does **not** reset, and it does not touch your commits. You'll mostly need this when a fix is announced in Discord.

```txt
Fetching main from upstream...
Merging upstream/main into dev...
✓ Successfully merged upstream/main into dev
```

### Verify the Setup

- [ ] Run `npm run reset`, pick `try-the-cli`, and confirm that `package.json` updates its `description` field from `"An awesome horse platform"` to `"An awesome course platform"`
- [ ] Run `npm run reset` again, pick `main`, and confirm it reverts back to `"An awesome horse platform"`

If you see those two strings swap back and forth, the tooling is working correctly.
