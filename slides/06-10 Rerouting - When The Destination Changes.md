# Rerouting: When The Destination Changes

Imagine a situation where you have a [spec](https://www.aihero.dev/ai-coding-dictionary/spec) and you've put together some [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) for it. Halfway through, maybe you're reviewing the tickets as they come in, and you realize: oh dear, this is just the wrong approach.

What do we do when we get two tickets in and we realize we need to change things?

## Tickets Are Disposable

The thing you need to consider here is that these tickets are disposable.

If we realize that this set of tickets - maybe we've implemented the first two, but the second two we haven't implemented - we can just delete the tickets that we haven't implemented.

![Whiteboard showing 'Tickets - Disposable' and 'Spec - Editable' badges](https://res.cloudinary.com/total-typescript/image/upload/v1785751537/ai-hero-images/ud5qocqqhvme0vkggynn.png)

Then we can go back to the spec, and the spec is editable.

So we can maybe have a [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) session about where we are right now. We've had two tickets and we're not happy with the way they're coming out, so we need to go back to the spec to edit it.

## The Spec Is The Destination

In other words, the spec is the destination and we are changing the destination.

What I would do is go back to the spec, have a new grilling session, and then once I'm happy with my edits to the spec, I would create a new set of tickets.

This new set of tickets might change the scope of the work a little bit, so we end up with maybe just a bit more that we're doing. But it means that we've found the journey to our new destination from where we are.

![Whiteboard showing six ticket boxes with the spec bar extended underneath](https://res.cloudinary.com/total-typescript/image/upload/v1785751538/ai-hero-images/ref3q19ypuciwm4wzrmo.png)

## The Flow

The whole flow looks like this:

**1. "Oh no, this needs to change"**

Realize that you want to change the destination. This is not turning out how you wanted.

**2. Close the tickets**

Delete any existing tickets that haven't yet been implemented. But you keep the spec because you want to modify the spec.

**3. Modify the spec**

Use [`/grill-me`](https://aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs) to adjust the spec, describing what you want changed. Probably in a new [session](https://www.aihero.dev/ai-coding-dictionary/session).

**4. Regenerate the tickets**

Once you're happy with the spec, regenerate the tickets based on where you are. You use `/to-tickets` to regenerate the new tickets.

So you don't throw away your work, probably, unless it's really, really bad. And then you continue implementing from that point.

**5. Continue implementing**

Use `/implement` to implement the new tickets.

![Five-step recipe diagram on the whiteboard](https://res.cloudinary.com/total-typescript/image/upload/v1785751539/ai-hero-images/roiidvegkhlydyfwwtds.png)

This is a nice simple recipe for what you need to do if you need to change direction mid-flow.

## Why Two Documents?

I wanted to add a little video on this because people always ask me this, and it's a relatively simple procedure.

This is also why we have this two-document design: so that you can have the spec as the destination and the tickets are totally disposable.

If they were all part of the same document, then it would get a little bit confusing.

<Quiz>
  <QuizQuestion data={{
    id: "tickets-disposable-spec-editable",
    question: "Two tickets in, you review the work and realise the whole approach is wrong. What do you do first?",
    type: "multiple-choice",
    choices: [
      { answer: "drop", label: "Delete the tickets you have not implemented yet, and keep the spec" },
      { answer: "revert", label: "Revert the two tickets you shipped and start the spec from scratch" },
      { answer: "newspec", label: "Close the spec and write a fresh spec beside the existing tickets" },
      { answer: "finish", label: "Finish the remaining tickets, then fix the direction in the review" }
    ],
    correct: "drop",
    answer: "Tickets are disposable and the spec is editable, so the tickets are what you throw away. The work already implemented is usually kept rather than reverted. A new spec written beside the old tickets leaves those tickets pointing at the destination you just abandoned. And finishing tickets you already know are wrong only buys you more code to undo."
  }} />
  <QuizQuestion data={{
    id: "two-document-split-lifetimes",
    question: "Why do the destination and the plan live in two separate documents rather than one?",
    type: "multiple-choice",
    choices: [
      { answer: "lifetime", label: "So the destination can be edited while the journey is thrown away" },
      { answer: "size", label: "So neither document ever grows too large for one context window" },
      { answer: "owner", label: "So you own one document and the agent owns the other one entirely" },
      { answer: "review", label: "So the destination can be reviewed before any plan has been written" }
    ],
    correct: "lifetime",
    answer: "The two documents have different lifetimes, and one document holding both would make it confusing to discard half of it. Length is not what drives the split. Neither document belongs to only one of you, since you grill the spec with the agent and the agent writes the tickets from it. And a single document could still be reviewed in stages."
  }} />
</Quiz>
