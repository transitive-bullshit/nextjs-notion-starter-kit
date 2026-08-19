import { execFileSync } from 'node:child_process'

const fullGitCommitPattern = /^[0-9a-f]{40}$/i

function resolveBuildGitCommit() {
  const environmentCommit =
    process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA

  if (environmentCommit && fullGitCommitPattern.test(environmentCommit)) {
    return environmentCommit
  }

  try {
    const localCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()

    return fullGitCommitPattern.test(localCommit) ? localCommit : ''
  } catch {
    return ''
  }
}

export default {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [{ type: 'query', key: 'lite', value: 'true' }],
          destination: '/-/embed/root'
        },
        {
          source: '/:pageId',
          has: [{ type: 'query', key: 'lite', value: 'true' }],
          destination: '/-/embed/:pageId'
        }
      ],
      afterFiles: [],
      fallback: []
    }
  },
  env: {
    NEXT_PUBLIC_BUILD_GIT_SHA: resolveBuildGitCommit()
  },
  staticPageGenerationTimeout: 300,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.notion.so' },
      { protocol: 'https', hostname: 'notion.so' },
      { protocol: 'https', hostname: 'file.notion.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'abs.twimg.com' },
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' },
      { protocol: 'https', hostname: 'transitivebullsh.it' }
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  }
}
