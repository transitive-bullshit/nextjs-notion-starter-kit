import { ChapterBody } from './ChapterBody'
import { ColleagueDemo } from './ColleagueDemo'
import { Figure, Lever } from './parts'
import styles from './PromptingPage.module.css'

export function ColleagueContent() {
  return (
    <ChapterBody>
      <p>
        The most useful mental shift I&apos;ve found is treating the agent as a{' '}
        <em>colleague</em>. Specifically, a fast, infinitely patient{' '}
        <s>junior</s> senior who has only seen what you&apos;ve shown them and
        forgets between sessions.
      </p>

      <p>
        Once you internalize that, a lot of what looks like prompt engineering
        starts looking like the things you&apos;d already do for a teammate:
        onboard them with the right docs, brief them before each task, pair
        through ambiguity, review their work before merging.
      </p>

      <Figure
        num='5.1'
        caption='Toggle what you share; watch the answer sharpen.'
      >
        <ColleagueDemo />
      </Figure>

      <p>
        Same task, same model. What changes is how much the colleague was set up
        to succeed. Most of the craft is closing the gap between what{' '}
        <em>you</em> can see and what <em>they</em> can see.
      </p>

      <Lever
        num='5.1'
        name='ONBOARDING'
        tagline='Set them up before the work starts.'
      >
        <p>
          Skills, project rules, conventions, examples: the same materials a new
          hire gets. What to use, what not to, where things live, what good
          looks like in this codebase.
        </p>
        <p>
          Most of this lives in a <code>CLAUDE.md</code> or{' '}
          <code>.cursorrules</code> at the project root. It&apos;s the
          highest-yield thing you can write in a codebase, because the agent
          reads it on every task. A useful rules file says things like:
        </p>
        <ul className={styles.axisList}>
          <li>Use Tailwind classes; don&apos;t inline styles.</li>
          <li>
            Tests go next to source files, not in a <code>__tests__/</code>{' '}
            folder.
          </li>
          <li>
            No <code>any</code>. Use the narrow types from{' '}
            <code>lib/types.ts</code>.
          </li>
          <li>
            When unsure about UI, link to a similar component in{' '}
            <code>components/</code>.
          </li>
        </ul>
        <p>
          The paragraph that gets a new hire from &quot;lost&quot; to
          &quot;useful&quot; in a week does the same for the agent.
        </p>
      </Lever>

      <Lever
        num='5.2'
        name='BRIEFING'
        tagline='Every task starts with context.'
      >
        <p>
          Onboarding is general. Briefing is per-task: what this specific piece
          of work is, which files matter, what good looks like, what to avoid.
        </p>
        <p>
          The mistake is starting cold every time: &quot;fix the auth bug.&quot;
          A colleague would ask &quot;which auth bug? where? what changed
          recently?&quot; and you&apos;d answer. Include the answers up front.
        </p>
        <p>
          The longer the task, the more that setup is worth: five extra minutes
          up front saves thirty minutes of clarifying turns later.
        </p>
      </Lever>

      <Lever
        num='5.3'
        name='REVIEWING'
        tagline='The diff is a proposal, not an answer.'
      >
        <p>
          Whatever comes back is a colleague&apos;s PR, not a final answer, and
          your job is to evaluate it. Read the diff. Run the code. Check the
          cases you&apos;d check on a junior&apos;s PR.
        </p>
        <p>
          Don&apos;t accept what you can&apos;t verify. If you can&apos;t tell
          whether the result is right, that&apos;s a signal that the task needed
          to be smaller, or that the agent needed more context.
        </p>
        <p>
          The rubber-stamp failure mode, clicking accept on diff after diff, is
          where mistakes pile up. Assume something subtle is wrong and look for
          it before merging.
        </p>
      </Lever>
    </ChapterBody>
  )
}
