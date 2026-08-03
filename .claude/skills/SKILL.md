---
name: notion-mcp
description: 'Interact with Notion workspaces via the official Notion MCP server. Use for searching, creating, updating, moving pages, managing databases, views, comments, and teams. Triggers on: notion, workspace, page, database, notion search, create page, update page.'
---

# Notion MCP

Connect to Notion workspaces using the official hosted MCP server at `https://mcp.notion.com/mcp`. Authentication is handled via OAuth — complete the flow when prompted on first use.

## Available Tools

| Tool                         | Description                                                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `notion-search`              | Search across Notion workspace and connected tools (Slack, Google Drive, Jira). Requires Notion AI for connected tool search. |
| `notion-fetch`               | Retrieve content from a page, database, or data source by URL or ID.                                                          |
| `notion-create-pages`        | Create one or more pages with properties, content, icons, and covers. Supports database templates.                            |
| `notion-update-page`         | Update page properties, content, icon, or cover. Supports applying templates.                                                 |
| `notion-move-pages`          | Move pages or databases to a new parent.                                                                                      |
| `notion-duplicate-page`      | Duplicate a page (async operation).                                                                                           |
| `notion-create-database`     | Create a new database with properties and initial view.                                                                       |
| `notion-update-data-source`  | Update a data source's properties, name, or description.                                                                      |
| `notion-create-view`         | Create views: table, board, list, calendar, timeline, gallery, form, chart, map, dashboard.                                   |
| `notion-update-view`         | Update view name, filters, sorts, or display config.                                                                          |
| `notion-query-data-sources`  | Query across multiple data sources with summaries and grouping (Enterprise + AI).                                             |
| `notion-query-database-view` | Query data using a pre-defined view's filters/sorts (Business+ with AI).                                                      |
| `notion-create-comment`      | Add page-level, block-level, or reply comments.                                                                               |
| `notion-get-comments`        | List all comments and discussions on a page.                                                                                  |
| `notion-get-teams`           | List teams/teamspaces in the workspace.                                                                                       |
| `notion-get-users`           | List all users with details.                                                                                                  |
| `notion-get-user`            | Get a specific user's info by ID.                                                                                             |
| `notion-get-self`            | Get bot info and connected workspace details.                                                                                 |

## Workflows

### Search and Fetch

1. Use `notion-search` to find pages/databases by keyword
2. Use `notion-fetch` with the returned URL/ID to get full content

### Create Content

1. Optionally `notion-fetch` a parent page or database to understand its schema
2. Use `notion-create-pages` to create pages with properties and content
3. For database entries, fetch the database first to see available templates

### Update Content

1. `notion-fetch` the page to see current state
2. Use `notion-update-page` to modify properties, content, icon, or cover

### Database Management

1. `notion-create-database` to set up new databases with properties
2. `notion-create-view` to add views (board, calendar, timeline, etc.)
3. `notion-update-view` to adjust filters, sorts, and grouping

## Rate Limits

- **General**: 180 requests/minute (3 req/sec) across all tools
- **Search**: 30 requests/minute (additional limit)
- If rate-limited, reduce parallel operations and retry

## Security Notes

- Uses OAuth 2.0 — complete the flow when prompted on first use
- The MCP server has the same access as your Notion user account
- Always review actions before confirming, especially destructive ones
- Only connect via official endpoints: `https://mcp.notion.com/mcp`

## Tips

- Pass Notion URLs directly to `notion-fetch` for quick content retrieval
- Use `notion-search` with natural language queries for best results
- When creating pages in a database, fetch the database first to discover templates and property schemas
- `notion-duplicate-page` runs asynchronously — the page appears after a moment
- For OpenAI clients (ChatGPT), tools appear as `fetch` and `search` without the `notion-` prefix
