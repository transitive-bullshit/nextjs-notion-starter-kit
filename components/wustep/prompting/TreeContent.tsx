import { ChapterBody } from './ChapterBody'
import { ExamplePrompt, Figure, Lever, Note } from './parts'
import styles from './PromptingPage.module.css'
import { TreeDemo } from './TreeDemo'

export function TreeContent() {
  return (
    <ChapterBody>
      <p>
        Every change lives somewhere on a 2D map: how much of the codebase it
        touches (<em>breadth</em>), and at what level of abstraction (
        <em>depth</em>). At any point on that map, you have three moves you can
        make: <strong>ask</strong>, <strong>plan</strong>, or{' '}
        <strong>delegate</strong>.
      </p>

      <Figure
        num='4.1'
        caption='The 2D map: breadth across the codebase, depth of abstraction, and a generated prompt for the selected cell.'
      >
        <TreeDemo />
      </Figure>

      <p>
        Prompting is moving around this map. The axes are usually fixed by the
        task. The interesting choice is which of the three moves you make.
      </p>

      <Lever num='4.1' name='ASK' tagline="When you don't know yet.">
        <p>
          Use <strong>Ask</strong> when you need to understand something before
          you act. It&apos;s the cheapest move: a few seconds and a few tokens
          to widen what you know.
        </p>
        <ExamplePrompt
          note='From a real session. The repro and the trace did most of the work.'
          text={`The middleware in apps/api/src/auth/check.ts is intermittently returning 401 in staging, about 1 in 30 requests. Trace attached. I see the call to verifyToken returns null but the function looks idempotent to me. What am I missing?`}
        />
        <p>
          The classic failure is asking too narrowly. You phrase the question
          around what you <em>think</em> the issue is; the model answers that
          question, confidently; you walk away with a clean, wrong answer. The
          fix is to include what&apos;s actually happening, not what you&apos;ve
          decided is the problem. Paste the error. Show the file. Describe the
          symptom before you propose the cause.
        </p>
      </Lever>

      <Lever
        num='4.2'
        name='PLAN'
        tagline='When you know roughly what, but not how.'
      >
        <p>
          <strong>Plan</strong> is the move that pays for itself most often. The
          model proposes an approach; you push back on bad assumptions; you
          converge; <em>then</em> code gets written. Much cheaper to revise a
          paragraph than a refactor.
        </p>
        <ExamplePrompt
          note='Cross-cutting change with multiple plausible approaches. Plan first, code later.'
          text={`I want to migrate our notification logic out of the request handlers into a queue. Don't write code yet. Propose 2–3 approaches, then pick one and explain the trade-offs. Constraints: must keep delivery semantics at-least-once, must not block API responses, can use the existing Redis instance.`}
        />
        <p>
          The trap is treating the first plan as binding. The model will defend
          whatever it proposed first unless you push back. Treat the plan as a
          draft, and make it argue for the choices you&apos;re skeptical of.
        </p>
      </Lever>

      <Lever
        num='4.3'
        name='DELEGATE'
        tagline='When the path is clear and you can verify the result.'
      >
        <p>
          <strong>Delegate</strong> works for bug fixes with a clear repro,
          mechanical refactors, boilerplate, tests for known behavior. Anything
          well-scoped and easy to grade.
        </p>
        <ExamplePrompt
          note='Narrow scope, obvious success criteria. Easy to verify.'
          text={`In components/ui/Button.tsx, add a 'loading' boolean prop. When true, disable the button and show a small spinner to the left of the children. Use the existing Spinner component from components/ui/Spinner. Don't change the public API otherwise. Update the stories in Button.stories.tsx to cover the new state.`}
        />
        <p>
          It works badly the moment any of that breaks: the task touches taste
          (UX, copy, naming), the change is cross-cutting, or you can&apos;t
          easily tell whether the result is right. Don&apos;t delegate what you
          can&apos;t grade. The discipline is bounding the blast radius first:
          smaller diffs, narrower scope, clearer success criteria.
        </p>
      </Lever>

      <Note title='Choosing your move'>
        <p>A few heuristics for picking the right cell:</p>
        <ul className={styles.axisList}>
          <li>
            <strong>Start broad, end specific.</strong> Most non-trivial work
            moves through all three: ask to understand the shape, plan to commit
            to an approach, delegate to land the change. Skipping a step shows
            up as rework two prompts later.
          </li>
          <li>
            <strong>Stuck in a loop? Zoom out.</strong> If you&apos;ve rejected
            the same delegation three times, the wording isn&apos;t the problem.
            The agent is missing something you haven&apos;t given it. Back out
            to plan, or all the way up to ask.
          </li>
          <li>
            <strong>
              The most expensive prompts are the ones in the wrong cell.
            </strong>{' '}
            Delegating something that needed a plan. Asking about something you
            should have just done. Calibration is most of the skill.
          </li>
        </ul>
      </Note>
    </ChapterBody>
  )
}
