import assert from 'node:assert/strict'
import test from 'node:test'

import { type ExtendedRecordMap } from 'notion-types'

import { mergeNavigationRecordMaps } from './merge-navigation-record-maps.ts'

function recordMap(
  blocks: Record<string, { value: { id: string; content?: string[] } }>
): ExtendedRecordMap {
  return { block: blocks } as unknown as ExtendedRecordMap
}

void test('a fully loaded page overrides the partial navigation copy of the same blocks', () => {
  const resumePageId = '18fce5cd674080e6a1b0ca8232a5e341'
  const fullPage = recordMap({
    [resumePageId]: {
      value: { id: resumePageId, content: ['updated-section'] }
    },
    'updated-section': {
      value: { id: 'updated-section', content: ['Current resume'] }
    }
  })
  const cachedNavigationPage = recordMap({
    [resumePageId]: {
      value: { id: resumePageId, content: ['old-section'] }
    },
    'old-section': {
      value: { id: 'old-section', content: ['Stale resume'] }
    },
    blog: {
      value: { id: 'blog', content: ['Blog'] }
    }
  })

  const merged = mergeNavigationRecordMaps(fullPage, [cachedNavigationPage])

  assert.deepEqual(merged.block[resumePageId]?.value.content, [
    'updated-section'
  ])
  assert.equal(
    merged.block['updated-section']?.value.content?.[0],
    'Current resume'
  )
  assert.equal(merged.block.blog?.value.content?.[0], 'Blog')
  assert.equal(Object.keys(merged.block)[0], resumePageId)
})

void test('the loaded page stays the first block when later nav pages are merged', () => {
  const blogPage = recordMap({
    blog: {
      value: { id: 'blog', content: ['post'] }
    }
  })
  const resumeNavigationPage = recordMap({
    resume: {
      value: { id: 'resume', content: ['Resume'] }
    }
  })
  const cookbookNavigationPage = recordMap({
    cookbook: {
      value: { id: 'cookbook', content: ['Cookbook without its database'] }
    }
  })

  const merged = mergeNavigationRecordMaps(blogPage, [
    resumeNavigationPage,
    cookbookNavigationPage
  ])

  assert.equal(Object.keys(merged.block)[0], 'blog')
  assert.deepEqual(merged.block.blog?.value.content, ['post'])
  assert.equal(
    merged.block.cookbook?.value.content?.[0],
    'Cookbook without its database'
  )
})
