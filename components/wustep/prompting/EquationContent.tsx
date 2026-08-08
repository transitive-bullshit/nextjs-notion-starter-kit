import { ChapterBody } from './ChapterBody'
import { EquationDemo } from './EquationDemo'
import { Figure, Lever, Note } from './parts'
import styles from './PromptingPage.module.css'

export function EquationContent() {
  return (
    <ChapterBody>
      <p>
        The simplest frame is an equation. Whatever a coding agent gives you
        falls out of two things multiplied together: the agent itself, and what
        you hand it.
      </p>

      <Figure
        num='2.1'
        caption='The output equation, expanded into its four levers.'
      >
        <EquationDemo />
      </Figure>

      <p>
        That gives you four levers.{' '}
        <em>There exist inputs that produce great outputs</em>; the job is
        finding them.
      </p>

      <Lever
        num='2.1'
        name='TOOL'
        tagline='Use a tool that was built for this.'
      >
        <p>
          Most people are still defaulting to whatever editor they had before
          agents were a thing, and bolting AI on. That&apos;s the biggest single
          upgrade most people haven&apos;t made.
        </p>
        <p>
          The frontier here isn&apos;t subtle: Cursor, Claude Code, and Codex
          are far better than VSCode with stock Copilot. The difference can feel
          like swapping a junior for a senior. Try one for a few weeks; if your
          day-to-day doesn&apos;t get noticeably easier, go back.
        </p>
      </Lever>

      <Lever
        num='2.2'
        name='MODEL'
        tagline='Pick the smartest model the work warrants.'
      >
        <p>
          Calibrate to the stakes of the task, not your defaults. A rough guide,
          as of mid-2026 (the specifics shift every few months):
        </p>

        <div className={styles.modelGuide}>
          <span className={styles.modelGuideUpdated}>
            Last updated Aug 2026
          </span>
          <div className={styles.modelGuideRow}>
            <span className={styles.modelGuideWhen}>
              Fast and cost-friendly
            </span>
            <span className={styles.modelGuidePick}>
              Cursor Grok 4.5 · GPT 5.6 Luna
            </span>
          </div>
          <div className={styles.modelGuideRow}>
            <span className={styles.modelGuideWhen}>
              Taste: writing, docs, PRs, UI/UX, animations
            </span>
            <span className={styles.modelGuidePick}>Opus 5 · Fable 5</span>
          </div>
          <div className={styles.modelGuideRow}>
            <span className={styles.modelGuideWhen}>
              Problem solving, backend, gnarly debugging
            </span>
            <span className={styles.modelGuidePick}>GPT 5.6 Sol</span>
          </div>
        </div>

        <p>
          Models have distinct styles: how they structure code, where they cut
          corners under ambiguity. Stay with one for a while and learn its tics;
          hopping between models before you have a feel for any of them slows
          you down.
        </p>
        <p>
          Avoid &quot;Auto&quot; mode. Auto optimizes for the platform&apos;s
          margin, not for you; Cursor reaches for a cheaper model (Composer)
          unless you say otherwise. Pick the model yourself. Consistent results
          are how you learn which one to reach for when.
        </p>
        <p>
          Thinking effort is the dial people forget. Most tools expose four
          rungs: low, medium, high, xhigh. Default to high (or medium, if
          you&apos;re watching cost) and adjust when the model lets you down by
          overthinking or underthinking.
        </p>

        <div className={styles.modelGuide}>
          <div className={styles.modelGuideRow}>
            <span className={styles.modelGuidePick}>Low</span>
            <span className={styles.modelGuideWhen}>
              Trivial edits, format fixes, one-line changes
            </span>
          </div>
          <div className={styles.modelGuideRow}>
            <span className={styles.modelGuidePick}>Medium</span>
            <span className={styles.modelGuideWhen}>
              Well-specced work where the model is mostly executing
            </span>
          </div>
          <div className={styles.modelGuideRow}>
            <span className={styles.modelGuidePick}>High</span>
            <span className={styles.modelGuideWhen}>
              Underspecced problems: planning through constraints, tradeoffs,
              real decisions. Also a good default.
            </span>
          </div>
          <div className={styles.modelGuideRow}>
            <span className={styles.modelGuidePick}>xHigh</span>
            <span className={styles.modelGuideWhen}>
              The genuinely hard stuff: novel design, gnarly bugs, long-horizon
              plans
            </span>
          </div>
        </div>
      </Lever>

      <Lever
        num='2.3'
        name='PROMPT'
        tagline='Be specific. Show the model what good looks like.'
      >
        <p>Prompting is a skill. Some patterns that help:</p>
        <ul className={styles.axisList}>
          <li>
            <strong>Concrete over abstract.</strong> &quot;Make this
            faster&quot; gives the model nothing. &quot;First paint is 2.4s,
            target under 1s, profile and start with the biggest wins&quot; gives
            it a job.
          </li>
          <li>
            <strong>Anchor on examples.</strong> &quot;Match the style of{' '}
            <code>components/PostCard.tsx</code>&quot; beats &quot;make it look
            nice.&quot; Models are great at imitation, mediocre at taste.
          </li>
          <li>
            <strong>Say what good looks like.</strong> Constraints, success
            criteria, what to avoid. The agent steers toward whatever you write
            down.
          </li>
        </ul>
        <p>What consistently doesn&apos;t:</p>
        <ul className={styles.axisList}>
          <li>
            <strong>&quot;Be careful.&quot;</strong> It&apos;s not careful.
            Constraints work; vibes don&apos;t.
          </li>
          <li>
            <strong>&quot;Think step by step.&quot;</strong> The model already
            does, and modern thinking modes do it better than any prompt
            incantation.
          </li>
          <li>
            <strong>Politeness padding.</strong> Doesn&apos;t hurt, doesn&apos;t
            help. Save the keystrokes.
          </li>
        </ul>
        <p>
          If you find yourself rewriting the same prompt for the fifth time,
          stop. The lever you need is the next one.
        </p>
      </Lever>

      <Lever
        num='2.4'
        name='CONTEXT'
        tagline='Load what the agent needs to see.'
      >
        <p>
          Most &quot;the model is dumb today&quot; moments are actually
          &quot;the model can&apos;t see the thing it needs.&quot; The prompt is
          the verb; context is the noun. Get the noun right and the verb almost
          takes care of itself.
        </p>
        <p>Things to load:</p>
        <ul className={styles.axisList}>
          <li>
            <strong>Skills and project rules.</strong> A <code>CLAUDE.md</code>{' '}
            or <code>.cursorrules</code> that captures your project&apos;s
            patterns, conventions, and the things you&apos;re tired of
            correcting.
          </li>
          <li>
            <strong>Reference material.</strong> The design doc, the API spec,
            the related PR. Drop them into the chat. Don&apos;t make the agent
            guess at what&apos;s already written down.
          </li>
          <li>
            <strong>Screenshots.</strong> For UI work, an image of the current
            state plus a sketch of the target is worth ten paragraphs.
          </li>
          <li>
            <strong>MCPs.</strong> Wire the agent into your actual systems:
            repo, dashboards, design tokens, internal docs. Same as giving a new
            engineer access to the stack instead of describing it from memory.
          </li>
        </ul>
        <p>
          Context is the strongest of the four levers. It&apos;s also the most
          boring, which is why it&apos;s underused.
        </p>
      </Lever>

      <Note title='Putting it all together'>
        <p>
          Whatever came back, you were part of why it came back that way. When
          something feels off, walk these four questions and find the lever you
          didn&apos;t pull:
        </p>

        <ul className={styles.axisList}>
          <li>
            <strong>Did I communicate clearly?</strong> Paste the error, name
            the file, say what good looks like.
          </li>
          <li>
            <strong>Could the agent see what it needed?</strong> Load the files,
            screenshots, docs, and rules.
          </li>
          <li>
            <strong>Was this the right model?</strong> Reach for something more
            capable on tricky work.
          </li>
          <li>
            <strong>Was thinking on?</strong> Turn it up for ambiguous or stuck
            moments.
          </li>
        </ul>

        <p>
          Prompting and context management are real skills, with as much depth
          as anything else in the craft. Closer to chess than to magic words.
        </p>
      </Note>
    </ChapterBody>
  )
}
