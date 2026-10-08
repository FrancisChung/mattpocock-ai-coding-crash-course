# Should You Keep Your Specs?

One question I get all the time is: what should I do with my [specs](https://www.aihero.dev/ai-coding-dictionary/spec) once I've completed them? Once they exist in the code, what should I do with them?

![GitHub issue #4 showing the Instructor Analytics Dashboard spec with its detailed user stories and implementation decisions](https://res.cloudinary.com/total-typescript/image/upload/v1785751440/ai-hero-images/srlqoogz2du9bbbq3p6b.png)

This spec is like a pretty nice representation of how the code actually works and looks. It's just written in plain text that the user can understand and that the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) could understand.

It feels like there's some value in keeping them around, surely, as maybe documentation for how the code works, or even just a historical record.

## The Shocking Answer

Well, let me shock you. Now that this is represented in the code, I'm going to close the spec.

![Matt closing issue #4 as completed on GitHub](https://res.cloudinary.com/total-typescript/image/upload/v1785751441/ai-hero-images/au0geneqexmxfx2sxxrl.png)

## Primary and Secondary Sources

We can think about specs and codebases as the primary and secondary source thing that we looked at before.

![Whiteboard diagram showing Codebase labeled as Primary Source and Spec labeled as Secondary Source](https://res.cloudinary.com/total-typescript/image/upload/v1785751441/ai-hero-images/dqdb6twh4u9cym5uouow.png)

A spec is really a condensed version of how a codebase works or even just a part of a codebase works.

And of course, the issue with a [secondary source](https://www.aihero.dev/ai-coding-dictionary/secondary-source) is it's only a projection. It's a summary of how the thing actually works.

## The Drift Problem

And the worst part is the codebase can very quickly move away from the spec.

In other words, if you're not constantly keeping the spec up to date with the codebase, they are going to drift apart.

## Why Not Spec-Driven Development?

There's a very popular approach called spec-driven development. One of the ways you can do spec-driven development is you take these specs, save them in the repo, and they become the source of truth instead of the code.

However, it's this exact drift risk that makes me terrified of that approach. If your agent is exploring your local repo and finding these old, ancient specs on how the code works, it's very likely to trust the out-of-date spec - the secondary source - instead of the [primary source](https://www.aihero.dev/ai-coding-dictionary/primary-source).

The secondary source is often easier to explore, smaller, denser. So it's unlikely to go and actually touch the primary source, which is more verbose and harder to explore, if it's seen that.

## The Code Doesn't Lie

The issue is, of course, that the codebase doesn't lie about itself. If you look at the executable parts of the codebase - the functions themselves - they are unlikely to lie about what the code actually does.

This is assuming you don't have weird, stale parts of your codebase, like:

- Functions that are no longer called
- A part of the system that's kept there for legacy purposes
- Throwaway [prototypes](https://www.aihero.dev/ai-coding-dictionary/prototyping) in the repo

## Archive, Don't Delete

All this to say: get rid of your specs as soon as they are put into code.

![GitHub issues list showing closed issue #4 alongside its five child tickets, all marked as completed](https://res.cloudinary.com/total-typescript/image/upload/v1785751442/ai-hero-images/fwluyvj2rlasfonp5z1b.png)

I really like this issues approach because you can close an issue, it gets moved out of the way of the main views, and it's kind of archived, specifically marked as archived. But if the agent needs to come back to it to have a look at how something was implemented or why something was implemented, then the spec is there for it to explore.

## Why GitHub Issues Work

Not only that, but your team can see them. If your spec is local markdown on your laptop, then it's just yours. Whereas a spec in the tracker is the team's. It's reviewable, commentable, and findable by someone who was not in the room.

Not only that, but if you keep these [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) out of the local setup, it means that they're durable if you're switching worktrees, if you're switching laptops. The state is not colliding with your local setup.

## The Verdict

So that is my message to you: archive your specs.

![Closing title card reading 'Archive Your Specs' with subtitle about specs being temporary artifacts](https://res.cloudinary.com/total-typescript/image/upload/v1785751443/ai-hero-images/vl6ngbevkhqarw0rfzv3.png)

Your specs are meant to be temporary artifacts that define a piece of work. They are not the source of truth for how the code works.

I'm very happy to debate you in Discord if you feel otherwise. There are lots of frameworks who say persist your specs, use them as a source of truth. I have found that doesn't work very well.

So hopefully that makes sense for what you should do with your specs once you've finished a multi-session piece of work.

Nice work, and I will see you in the next one.

<Quiz>
  <QuizQuestion data={{
    id: "close-the-spec-once-shipped",
    question: "The last ticket under your spec is merged and the work is live. What do you do with the spec?",
    type: "multiple-choice",
    choices: [
      { answer: "close", label: "Close it in the tracker, so it is archived but still findable" },
      { answer: "commit", label: "Commit it into the repo as documentation of how the code works" },
      { answer: "delete", label: "Delete it outright, so nothing stale can ever be read again" },
      { answer: "maintain", label: "Keep it open and update it each time the code changes underneath" }
    ],
    correct: "close",
    answer: "A closed issue moves out of the main views but stays there for the agent or a teammate to revisit. Committing it into the repo is what makes an agent trust an ageing summary instead of the code. Deleting it throws away the historical record you get for free. And keeping it in sync by hand is the maintenance you were trying to avoid."
  }} />
  <QuizQuestion data={{
    id: "spec-drift-secondary-source",
    question: "Why is an old spec sitting in the repo risky once the code has moved on?",
    type: "multiple-choice",
    choices: [
      { answer: "secondary", label: "It is a secondary source, and the agent trusts it over the code itself" },
      { answer: "tokens", label: "It is verbose, so reading it burns a large share of the window" },
      { answer: "conflict", label: "It conflicts with the tickets, and the agent cannot resolve that" },
      { answer: "private", label: "It is local to your laptop, so nobody on the team can read it" }
    ],
    correct: "secondary",
    answer: "A spec is a projection of the codebase, and it is smaller and denser than the code, so an agent that finds it stops there and never reads the primary source that cannot lie about itself. Size is not the danger, since the spec is the compact one. Tickets are gone by then. And being private is an argument for the tracker, not the reason drift bites."
  }} />
</Quiz>
