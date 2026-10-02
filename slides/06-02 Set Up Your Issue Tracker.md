# Set Up Your Issue Tracker

<CommitMap packageManager="npm">
  <Commit id="setup-skills-skill">Start the lesson: the `/setup-matt-pocock-skills` skill added</Commit>
  <Commit id="run-setup-skill">See my solution: the skill run, with `AGENTS.md` pointing at `docs/agents/issue-tracker.md`</Commit>
</CommitMap>

You now know about [specs](https://www.aihero.dev/ai-coding-dictionary/spec) and [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket), but where do you actually store these documents? Are they local files? Where do they go?

The place I recommend putting both specs and tickets is outside of the repository in an issue tracker. An issue tracker is familiar if you've ever done development - it's used to coordinate work across different teams or across members of your team.

One cool thing about working with an [agent](https://www.aihero.dev/ai-coding-dictionary/agent) is that an agent can read from the same issue tracker that you contribute to. The most famous issue tracker out there is GitHub. You can create GitHub issues which are then able to be accessed by your coding agent via the GitHub CLI.

While this course uses GitHub, you can use any of the concepts we learn here on any issue tracker - Jira, Linear, Todoist, whatever you like. We're going to use GitHub because it's easy to set up, it's free, and you probably already have an account.

![GitHub issues page showing 1,200 closed issues and 28 open issues](https://res.cloudinary.com/total-typescript/image/upload/v1785748085/ai-hero-images/i8bspbkon8hkcywx3sqq.png)

## Steps To Complete

### Install and Authenticate the GitHub CLI

The GitHub CLI is how the agent is going to communicate from your local setup to GitHub to fetch the issues.

- [ ] Install the GitHub CLI

Visit [cli.github.com](https://cli.github.com/) to find installation instructions for your platform.

- [ ] Run `gh auth login` to authenticate

```bash
gh auth login
```

You'll be prompted to choose where you use GitHub (choose `github.com`), your preferred protocol (choose `HTTPS`), and whether to authenticate Git with your GitHub credentials (I recommend yes). Then log in with a web browser to complete the process.

- [ ] Verify your authentication with `gh auth status`

```bash
gh auth status
```

You should see output showing you're logged in to your GitHub account with an active account status.

![Terminal showing gh auth status output with logged in account](https://res.cloudinary.com/total-typescript/image/upload/v1785748086/ai-hero-images/cturn2rdpjgioqtzbexo.png)

```txt
github.com
  ✓ Logged in to github.com account <your-username> (...)
  - Active account: true
  - Git operations protocol: https
  - Token: gho_************************************
```

### Fork the Course Repo

By default, any issues you raise will be against the main version of the crash course repo, which means everything's going to be very messy because we'll all be reading each other's issues. That would be a disaster.

So you need to fork the repo to create your own private copy.

- [ ] Run `npx ai-hero-cli fork`

```bash
npx ai-hero-cli fork
```

- [ ] Provide a name for your private GitHub repo

You'll be prompted for a new name for your repo. You can use the default or provide your own.

- [ ] Confirm the operation

The CLI will warn you that it's going to replace this folder's git history with a single fresh commit and create a new private GitHub repo. Agree to continue.

Once complete, you'll see a success message with a link to your new private repo on GitHub. All of the previous commands like `pull`, `reset`, and `cherry-pick` still work - the crucial difference is you now have your own set of issues.

![Browser showing the newly created private GitHub repo](https://res.cloudinary.com/total-typescript/image/upload/v1785748087/ai-hero-images/lj5tidngy4u2txfhjsmt.png)

### Configure the Repo to Use GitHub Issues

Now you need to set up this repo to use the correct issue tracker.

- [ ] Run `npm run reset`

```bash
npm run reset
```

- [ ] Search for "setup skills skill"

This will add the `/setup-matt-pocock-skills` [skill](https://www.aihero.dev/ai-coding-dictionary/skill) to the repo.

- [ ] Run `/setup-matt-pocock-skills` in Claude Code

The skill will do a brief exploration of the repo's current state and provide a recommendation on the issue tracker to use.

- [ ] When prompted, confirm you want to use GitHub

Type something like "yes, GitHub - write both files" to confirm.

The skill will add infrastructure to your setup so that the agent knows GitHub is the issue tracker. It writes two files:

- An `## Agent skills` section in `AGENTS.md` with a [pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer) to the issue tracker documentation
- `docs/agents/issue-tracker.md` with the full GitHub conventions

![Claude Code showing the AGENTS.md file with the new Agent skills section](https://res.cloudinary.com/total-typescript/image/upload/v1785748088/ai-hero-images/mtm3i1chq1y3tyuvde4z.png)

```markdown
## Agent skills

### Issue tracker

Issues and PRDs live as GitHub issues on <your-username>/<your-repo>, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.
```

The `docs/agents/issue-tracker.md` file contains all the conventions for how the agent should interact with GitHub - commands for creating, reading, listing, commenting on, labeling, and closing issues.

### Test Your Setup

Now let's verify everything works by creating a test issue.

- [ ] Run `/clear` to [clear](https://www.aihero.dev/ai-coding-dictionary/clearing) the [context](https://www.aihero.dev/ai-coding-dictionary/context)

- [ ] Ask the agent to add a test issue

```
Add an issue to the issue tracker just as a test, just for a dummy.
```

The agent should read `docs/agents/issue-tracker.md`, see that issues live in GitHub, and run:

```bash
gh issue create --title "Test issue (dummy)" --body "Dummy issue created as a test of the issue tracker. Safe to close."
```

- [ ] Verify the issue was created

Click the GitHub URL returned by the command to see your new issue in your repo's issue tracker.

![GitHub issue page showing the test dummy issue](https://res.cloudinary.com/total-typescript/image/upload/v1785748088/ai-hero-images/vuxjykubewybv7fggomi.png)

You are now ready to use GitHub as your issue tracker for specs and tickets. If you have any issues with this, ask in the Discord.
