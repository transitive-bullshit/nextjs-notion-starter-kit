# Notion Collection Sorting

The homepage renders Notion collection cards through `react-notion-x`, but the public Notion page payload can lag behind the official Notion database order. This matters for the Blog Posts collection because newly published posts can appear later in the card grid even when the Notion database view is sorted correctly.

## Homepage Rules

- Daily Digest keeps custom app behavior: show the latest 4 public posts by `Published` descending.
- Blog Posts follows the Notion gallery view sort, currently `Published` descending and then `Featured` descending.
- Hidden collection view tabs should not allow stale browser `localStorage` to switch a collection back to a table view.

## Implementation

`lib/notion.ts` normalizes collection data after filtering non-public pages:

- Applies each Notion collection view's `query2.sort` locally to `blockIds` and grouped `blockIds`.
- Restricts inline collection blocks to their first/default Notion view because the UI hides the collection view dropdown.
- Runs the Daily Digest limit after sort normalization so it still returns only the latest 4 items.

## Verification

Use the official Notion REST API to compare expected database order when debugging. The zsh-loaded Notion token can be used without printing it:

```bash
zsh -ic 'curl -sS -X POST "https://api.notion.com/v1/databases/<database-id>/query" \
  -H "Authorization: Bearer ${NOTION_API_TOKEN:-$NOTION_API_KEY}" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d "{\"filter\":{\"property\":\"Public\",\"checkbox\":{\"equals\":true}},\"sorts\":[{\"property\":\"Published\",\"direction\":\"descending\"}],\"page_size\":10}"'
```

After deploying to Cloudflare Workers, production may still show stale ordering until OpenNext's R2 incremental cache for `/` refreshes or is purged.
