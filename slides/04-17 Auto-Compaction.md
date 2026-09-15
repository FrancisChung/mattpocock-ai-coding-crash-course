# Auto-Compaction

You might be wondering: what happens if you try to push past the [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) limit? Opus 4.8, which is what we're using, has 1 million [tokens](https://www.aihero.dev/ai-coding-dictionary/token) of context. What happens if you go for 1 million and 1?

If you send a [request](https://www.aihero.dev/ai-coding-dictionary/model-provider-request) to Anthropic that has 1,000,001 tokens in it, you will get an error. The [model](https://www.aihero.dev/ai-coding-dictionary/model) simply cannot process that many tokens.

Your [agent](https://www.aihero.dev/ai-coding-dictionary/agent) has built-in protections against hitting this hard limit. When you get to a certain point, it will [automatically compact](https://www.aihero.dev/ai-coding-dictionary/autocompact) your [session](https://www.aihero.dev/ai-coding-dictionary/session).

## Finding Auto-Compact in Your Agent

You can see this setting in your agent by typing the `/config` command and then searching for `auto-compact`. The matching settings appear at the top.

![The /config panel showing Auto-compact set to true](https://res.cloudinary.com/total-typescript/image/upload/v1784731270/ai-hero-images/pa2wue1yhap7ovlnbo1o.png)

The relevant configuration shows:

```
Auto-compact: true
```

with a description: "Automatically compact conversation when context fills"

Auto-compaction exists in every single agent [harness](https://www.aihero.dev/ai-coding-dictionary/harness), because every harness has this problem. Every harness has a window in which, if you hit it, the system will pause your session and automatically compact what's in there.

You used to be able to see this by typing `/context` to view the autocompact buffer inside the context breakdown. But it appears that teams have made it slightly more obscure.

## Customizing the Auto-Compact Window

One interesting thing you can do is customize the auto-compact window itself. Inside your `~/.claude/settings.json` file, you can adjust when auto-compaction fires:

![The settings.json file showing the autoCompactWindow setting](https://res.cloudinary.com/total-typescript/image/upload/v1784731271/ai-hero-images/mto9trx4ba4a2ujvszyn.png)

```json
{
  "autoCompactWindow": 250000
}
```

If you want it to automatically compact after 250,000 tokens, you can totally do that. The setting accepts values from 100,000 to 1,000,000 tokens.

## The Promise: Context Management Goes Away

The promise of auto-compaction is really quite nice. Imagine a world where you didn't have to think about phase boundaries at all, didn't have to think about the [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone), didn't have to think about [context](https://www.aihero.dev/ai-coding-dictionary/context) at all.

This decision tree would simply not be needed:

![The decision tree diagram showing all five options](https://res.cloudinary.com/total-typescript/image/upload/v1784731272/ai-hero-images/ipudznemkdjkzyecigin.png)

- Continue the session
- [Clear](https://www.aihero.dev/ai-coding-dictionary/clearing) the session
- [Hand it off](https://www.aihero.dev/ai-coding-dictionary/handoff)
- Spawn a [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent)
- [Compact](https://www.aihero.dev/ai-coding-dictionary/compaction)

You would just auto-compact at the right moments. In fact, you will see a lot of people online saying that auto-compaction just handles all of their problems for them.

## Why Auto-Compaction Is Actually Really Difficult

However, it turns out that auto-compaction is an incredibly difficult problem to solve. And it's really, really painful to get wrong.

### Compacting in the Middle of a Phase Is Dangerous

Think back to a typical session with a [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) phase and an implementation phase, separated by a phase boundary.

![Diagram showing grilling phase, implementation phase, and phase boundary](https://res.cloudinary.com/total-typescript/image/upload/v1784731273/ai-hero-images/fkutnevmvdbrbrmq5e5v.png)

If someone forced you to put in a compact somewhere in this session, you would probably say that the safest place to do it would be at the phase boundary, between grilling and implementation.

But what would happen if you compacted in the middle of a grilling session? You'd be working with only a summary of what had been done before. What I've found when this has occasionally happened is that the agent really does lose its way quite often and just forgets stuff you were talking about just before.

The same is true in implementation, and it's often worse:

- The agent will often lose its way completely
- The second half of the implementation phase will use a totally different coding style from the first part
- It will lose its train of thought and forget features it was supposed to implement

### You Lose Control of the Handoff

There's another problem: when you automatically compact, there's no opportunity for you to say what you should compact and what the intention of the next session is going to be.

The little summarization notes that you pass to the [handoff document](https://www.aihero.dev/ai-coding-dictionary/handoff-artifact) or you pass to `/compact` are really key for getting it to compact the correct things. Auto-compaction gives you no equivalent hook.

## The Better Approach: Human Control

So will mid-phase compacting always be bad? Probably not, although it feels like it's going to be a hard problem no matter what the model is. It's a very tricky, difficult problem to solve.

My attitude in general is to increase the skill of the human instead of increasing the demand on the harness and the model. I tend to prefer the human having control of this decision tree, rather than just passing it off to the agent.

It's a one-time learning curve that the human has to go through, and it will just get you better and better results the better you get at it. More of your sessions are going to be in the smart zone and you're going to have better control.

## The Real Rule

In my opinion, if you're hitting the auto-compact buffer, if you're automatically compacting, then something is probably going wrong.

Instead, you should be in control. You should be the one deciding whether you continue the session, clear the session, hand it off, spawn a subagent, or compact.

When you own that decision, you get better code.

<Quiz>
  <QuizQuestion data={{
    id: "autocompact-firing-is-a-smell",
    question: "Halfway through implementing a feature, your session pauses and compacts itself. What should you take from that?",
    type: "multiple-choice",
    choices: [
      { answer: "too-late", label: "You left the boundary decision too late - own it yourself" },
      { answer: "fine", label: "The harness dealt with it, so there is nothing to change" },
      { answer: "window", label: "Your context window is too small for work of this size" },
      { answer: "model", label: "The model is not capable enough for a feature this large" }
    ],
    correct: "too-late",
    answer: "The harness did rescue you, but it compacted mid-phase, which is where the agent most often loses the thread. Raising the auto-compact window only moves when that happens rather than adding capacity, and the model is not the thing that failed - the phase boundary went unclaimed."
  }} />
  <QuizQuestion data={{
    id: "mid-phase-compaction-loses-the-thread",
    question: "A compaction has to happen somewhere in a session that runs grilling then implementation. Where does it do the least damage?",
    type: "multiple-choice",
    choices: [
      { answer: "boundary", label: "At the phase boundary, between grilling and implementing" },
      { answer: "mid-impl", label: "Midway through implementation, once the style is settled" },
      { answer: "mid-grill", label: "Midway through grilling, once the questions are all asked" },
      { answer: "anywhere", label: "Anywhere at all - the summary keeps the same information" }
    ],
    correct: "boundary",
    answer: "Cutting into implementation is often the worst case: the second half comes back in a different coding style and forgets features it was meant to build. Cutting into grilling makes the agent forget what you were discussing moments earlier. And the summary is lossy, so where it lands genuinely matters."
  }} />
  <QuizQuestion data={{
    id: "autocompact-window-is-configurable",
    question: "You want your agent to compact automatically at 250,000 tokens rather than wherever it currently fires. What do you change?",
    type: "multiple-choice",
    choices: [
      { answer: "setting", label: "Set autoCompactWindow to 250000 in your settings file" },
      { answer: "threshold", label: "Set compactThreshold to 250000 in your settings file" },
      { answer: "flag", label: "Pass a token budget to the /compact command each time" },
      { answer: "off", label: "Turn auto-compact off in /config and compact by hand" }
    ],
    correct: "setting",
    answer: "autoCompactWindow is the setting that moves the trigger, and it accepts anything from 100,000 up to 1,000,000 tokens. No such compactThreshold key controls this, /compact only compacts on demand rather than setting a future trigger, and switching auto-compact off removes the automatic behaviour instead of moving it."
  }} />
</Quiz>

