# FBS IDX AI Knowledge Platform MVP

A deployable Next.js front end for the FBS IDX AI knowledge base.

## Included

- Search-first landing page
- Quick links to core Skills
- Decision Tree shortcuts
- Recently updated content
- New Case Library links
- Knowledge metrics
- Employee and AI usage guide
- Responsive layout

## Deploy without a terminal

1. Create a new GitHub repository.
2. Upload the contents of this folder through GitHub's web interface.
3. In Vercel, choose **Add New Project** and import the repository.
4. Keep the default Next.js settings and deploy.

## Current data source

The MVP uses `lib/data.ts` as a curated index of Google Drive documents. This avoids exposing private Drive credentials in the browser.

## Recommended production integration

Use a server-side synchronization job to read approved Google Drive metadata and write a searchable index to a database or search service. Do not call private Google Drive APIs directly from browser code.

Suggested production components:

- Google Workspace OAuth service account or delegated app
- Scheduled sync endpoint
- Postgres, Supabase, or Vercel Postgres
- Full-text search or vector search
- Access restricted to FBS Google Workspace accounts
- Usage analytics for most-used Skills
- Review-date and stale-content alerts

## Security

- Keep documents private.
- Use server-only environment variables.
- Restrict login to the FBS domain.
- Never index credentials or customer-identifiable case data.
- Preserve human review for external communications.
