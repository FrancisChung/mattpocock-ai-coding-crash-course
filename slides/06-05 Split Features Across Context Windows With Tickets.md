# Split Features Across Context Windows With Tickets

<CommitMap packageManager="npm">
  <Commit id="to-tickets-skill">Start the lesson: the `/to-tickets` skill added</Commit>
</CommitMap>

You have a [spec](https://www.aihero.dev/ai-coding-dictionary/spec), but you don't yet have a journey. You know the destination, but not how you're going to get there.

You need to create individual [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) for each [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone), each [session](https://www.aihero.dev/ai-coding-dictionary/session). Each ticket will be picked up and implemented one at a time.

But there are good ways to slice up work, and there are bad ways.

## Horizontal Slices Are a Trap

Every application has layers. You might have a database, an API, and a front-end as separate deployable units. Within your application, you might have services that talk to the front-end, and within the front-end you might have components with their own layers.

![Diagram showing application layers: database, API, front-end, services, and components](https://res.cloudinary.com/total-typescript/image/upload/v1785749912/ai-hero-images/mn0uzggkfkztyds0nybu.png)

When an [agent](https://www.aihero.dev/ai-coding-dictionary/agent) looks at breaking up work that involves different layers, it will usually break them into horizontal slices. Each layer gets its own phase.

Phase 1 focuses on the database. Phase 2 hooks it up to the service. Phase 3 hooks everything up to the front-end.

![Diagram illustrating horizontal slices with separate phases for each layer](https://res.cloudinary.com/total-typescript/image/upload/v1785749914/ai-hero-images/wxgun1hajhkycnbnks2n.png)

This looks well-organized and reasonable, but it's a trap. Software developers have known about this for decades.

If you do it this way, all of the code in phase 1, you don't really know if it works or if it's well designed until you're implementing phase 3. You need to cross the layers to work out if the code for that layer is well designed.

With horizontal slices, you get feedback on the whole system far too late.

## Vertical Slices Give Early Feedback

The way to fix this is vertical slices. The agent works across layers from the very first phase.

From the word go, they're touching the database, the API, and the front-end. They're building out a minimal implementation first, then building from there.

![Diagram showing vertical slices cutting across all layers from the first phase](https://res.cloudinary.com/total-typescript/image/upload/v1785749914/ai-hero-images/by0ajypofoikn8ar68bj.png)

This means they're getting feedback on their design, its feasibility, and seeing how all the layers integrate from the first phase.

Every phase that builds on that is pretty trivial because it's just building on work that it already knows is well integrated.

Using the phrase "vertical slices" is actually really good because the agent already understands vaguely what it means. The concept of vertical slices and tracer bullets has been around for a long time - it goes back to [*The Pragmatic Programmer*](https://www.amazon.co.uk/Pragmatic-Programmer-Andrew-Hunt/dp/020161622X).

## The /to-tickets Skill

To get beautifully vertically sliced tickets, you use the `/to-tickets` [skill](https://www.aihero.dev/ai-coding-dictionary/skill).

You can grab it by running `npm run reset` inside the crash course. It's called `/to-tickets` and after you reset your branch, you'll see it inside `.agents/skills`.

![Terminal showing npm run reset command and the /to-tickets skill in .agents/skills directory](https://res.cloudinary.com/total-typescript/image/upload/v1785749915/ai-hero-images/yvuiq1im6getaeq7vs4d.png)

The skill breaks a plan, spec, or conversation into a set of tickets - tracer-bullet vertical slices, each declaring the tickets that block it.

![The /to-tickets skill description showing it breaks plans into tracer-bullet vertical slices](https://res.cloudinary.com/total-typescript/image/upload/v1785749916/ai-hero-images/r00jheuxfqybn8liu0ii.png)

## When to Call /to-tickets

When you reach the end of a phase, you need to decide what to do next. After `/to-spec`, that's definitely the end of a piece of work.

Walk through this decision tree:

**Can you continue?** Do you have enough smart zone left?

If yes, and your [context](https://www.aihero.dev/ai-coding-dictionary/context) is relevant to the next piece of work, you can keep going in the same session.

**Is your context irrelevant?** If the information in your context isn't relevant to the next task, [start fresh](https://www.aihero.dev/ai-coding-dictionary/clearing).

In this case, the context is extremely relevant. All the decisions that went into the spec are in the context. It makes sense to keep this around.

**Do we need to [hand off](https://www.aihero.dev/ai-coding-dictionary/handoff)?** Not if we're staying within the same agent and directory.

**Can this be done [AFK](https://www.aihero.dev/ai-coding-dictionary/afk)?** Not if you need [human review](https://www.aihero.dev/ai-coding-dictionary/human-review).

This situation is a great candidate for [compacting](https://www.aihero.dev/ai-coding-dictionary/compaction) if you're outside the smart zone. However, if you don't need to, you can just continue.

![Decision tree diagram for when to continue, compact, or start fresh at the end of a phase](https://res.cloudinary.com/total-typescript/image/upload/v1785749917/ai-hero-images/bmg4weovualzcxoiu28j.png)

## Steps To Complete

### Install the /to-tickets Skill

- [ ] Run `npm run reset` to install the `/to-tickets` skill

```bash
npm run reset
```

This will pull down the latest skills from the course repository. You should see the `/to-tickets` skill appear in `.agents/skills`.

### Run /to-tickets in the Same Conversation

- [ ] Go back into the conversation where you ran `/to-spec`

This is the same session where you created the spec. All the context and decisions are already there.

- [ ] Compact if you need to

Check your smart zone remaining. If you're running low, compact the conversation. Otherwise, just continue.

![Claude Code status bar showing 64k smart zone remaining](https://res.cloudinary.com/total-typescript/image/upload/v1785749917/ai-hero-images/bweprexs101w0w7szeyp.png)

- [ ] Invoke the `/to-tickets` skill

```
/to-tickets
```

The skill will present you with a breakdown of the different tickets it's going to create, and it will ask for your feedback.

### Review the Ticket Breakdown

- [ ] Check whether the tickets are horizontally sliced or vertically sliced

Each ticket should cut across all layers - database, API, front-end - not focus on just one layer.

Look for tickets that say things like "implement the database schema" or "build the API endpoints" as separate phases. That's horizontal slicing.

Good vertical slices deliver end-to-end behavior in each ticket - a narrow but complete path through every layer.

- [ ] Check that the tickets are not too big

Remember, you've only got one smart zone per session to play with. Each ticket should be sized to fit in a single fresh [context window](https://www.aihero.dev/ai-coding-dictionary/context-window).

If a ticket looks like it's trying to do too much, ask the agent to split it further.

- [ ] Provide feedback to the agent

The agent will iterate with you until you approve the breakdown. Don't move forward until the tickets are properly vertically sliced and appropriately sized.
