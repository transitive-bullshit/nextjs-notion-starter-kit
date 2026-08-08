import * as React from 'react'

import { ChapterBody } from './ChapterBody'
import { Note, SectionHeading } from './parts'
import styles from './PromptingPage.module.css'

export function TechniquesContent() {
  return (
    <ChapterBody>
      <p>
        Mental models tell you <em>where</em> to push. Techniques are the
        phrases that do the pushing. Chess players build a repertoire of
        openings, tactics, and endgame studies, most of it learned from other
        players and none of it secret. The same vocabulary is forming for
        prompting. Some moves worth stealing:
      </p>

      <TechniqueGroup num='3.1' heading='Before you start'>
        <Technique prompt='What questions should you ask me before starting?'>
          <p>
            Surfaces ambiguity instead of guessing. The model returns a list of
            things it&apos;s uncertain about; you answer them, then it goes.
            Saves a lot of clarifying turns later. Especially good with smaller,
            faster models.
          </p>
        </Technique>

        <Technique prompt={`What's the smallest version of this that ships?`}>
          <p>
            Scopes down before delegating. Ten lines instead of a thousand. The
            model is happy to grow scope; you have to ask it to shrink.
          </p>
        </Technique>
      </TechniqueGroup>

      <TechniqueGroup num='3.2' heading='Open the options'>
        <Technique prompt='Give me 3 options, rank them, name the trade-offs.'>
          <p>
            Forces breadth before depth. The model defaults to its first
            plausible idea; asking for three pushes it past that. Useful for any
            decision where you don&apos;t already know the right answer:
            algorithm choice, library choice, schema design.
          </p>
        </Technique>

        <Technique prompt='Argue against your last suggestion.'>
          <p>
            Surfaces hidden assumptions. Especially useful right after a plan;
            much cheaper to discover its weaknesses now than after you&apos;ve
            implemented it.
          </p>
        </Technique>
      </TechniqueGroup>

      <TechniqueGroup num='3.3' heading='Pressure-test it'>
        <Technique prompt='What did you skip?'>
          <p>
            After a delegated task, ask what was glossed over. The model often
            owns up to things you&apos;d have missed: tests, error handling, the
            &quot;TODO: revisit&quot; it left on line 47. Cheap two-second move,
            high hit rate.
          </p>
        </Technique>

        <Technique prompt='How would a senior engineer review this?'>
          <p>
            Triggers review-mode output, a different vibe than
            implementation-mode: more critical, more &quot;but consider&quot;
            tradeoffs, more willing to call out things its implementation-self
            would have left in.
          </p>
        </Technique>
      </TechniqueGroup>

      <TechniqueGroup num='3.4' heading='Pay it forward'>
        <Technique prompt='Match the style of components/PostCard.tsx.'>
          <p>
            Anchor on something concrete: a path, a screenshot, a doc, a working
            example. &quot;Match this&quot; beats &quot;make it look nice&quot;
            by a wide margin. Models are imitators first; give them something to
            imitate.
          </p>
        </Technique>

        <Technique prompt='Update CLAUDE.md with what you just learned.'>
          <p>
            Capture the lesson in the project rules so the next agent (or
            future-you) doesn&apos;t have to relearn it. Five minutes of work
            that saves every future session.
          </p>
        </Technique>
      </TechniqueGroup>

      <div className={styles.skillsBlock}>
        <h3 className={styles.skillsHeading}>Lift them into skills</h3>
        <p>
          Once you find a move that works, stop typing it manually. Every
          serious agent tool lets you write project-level instructions that the
          agent reads on every task. You write the lesson once; the agent has it
          forever.
        </p>
        <div className={styles.skillsLinks}>
          <a
            href='https://docs.claude.com/en/docs/claude-code/skills'
            className={styles.skillsLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            Claude Code · Skills
            <span className={styles.skillsLinkArrow} aria-hidden='true'>
              ↗
            </span>
          </a>
          <a
            href='https://docs.cursor.com/en/context/rules'
            className={styles.skillsLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            Cursor · Rules
            <span className={styles.skillsLinkArrow} aria-hidden='true'>
              ↗
            </span>
          </a>
          <a
            href='https://github.com/openai/codex#agentsmd'
            className={styles.skillsLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            Codex · AGENTS.md
            <span className={styles.skillsLinkArrow} aria-hidden='true'>
              ↗
            </span>
          </a>
        </div>
      </div>

      <Note title='Keep climbing'>
        <p>
          None of these are hard, and none of them are secret. The point is less
          the list than the noticing: there&apos;s a craft here, and most of it
          is still unmapped. The best moves are the ones you&apos;ll find
          yourself.
        </p>
      </Note>
    </ChapterBody>
  )
}

function TechniqueGroup({
  num,
  heading,
  children
}: {
  num: string
  heading: string
  children: React.ReactNode
}) {
  return (
    <section className={styles.techniqueGroup}>
      <SectionHeading num={num}>{heading}</SectionHeading>
      <div className={styles.techniqueGroupBody}>{children}</div>
    </section>
  )
}

function Technique({
  prompt,
  children
}: {
  prompt: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.technique}>
      <p className={styles.techniquePrompt}>{prompt}</p>
      <div className={styles.techniqueBody}>{children}</div>
    </div>
  )
}
