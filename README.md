<div align="center">

# FBS IDX AI Knowledge Platform

**A modern, search-first knowledge center for FBS IDX teams.**

Built with Next.js and designed to help employees quickly find trusted guidance, workflows, decision support, and reusable AI resources.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

</div>

---

## Overview

The FBS IDX AI Knowledge Platform is a deployable internal knowledge experience that organizes important resources into a fast, approachable interface.

It is designed to reduce time spent searching across disconnected documentation and help employees move from a question to a trusted answer or workflow more quickly.

## Core Experience

- **Search-first navigation** for fast knowledge discovery
- **Quick links** to frequently used skills and resources
- **Decision trees** for repeatable support and sales workflows
- **Case library** for real-world examples and resolutions
- **Recently updated content** to surface current guidance
- **Knowledge metrics** for visibility into platform coverage
- **Employee and AI usage guidance** for responsible adoption
- **Responsive interface** for desktop and mobile use

## Technology

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 |
| UI | React 19 |
| Language | TypeScript |
| Hosting | Vercel |
| Current content source | Curated data in `lib/data.ts` |

## Getting Started

### Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### Production build

```bash
npm run build
npm start
```

## Deploy with Vercel

1. Import this repository into Vercel.
2. Keep the detected **Next.js** framework settings.
3. Configure any required environment variables.
4. Select **Deploy**.

Vercel will automatically create preview deployments for future branches and pull requests.

## Deploy Without a Terminal

1. Create or select a GitHub repository.
2. Upload the project files through GitHub’s web interface.
3. In Vercel, select **Add New → Project**.
4. Import the GitHub repository.
5. Keep the default Next.js settings and deploy.

## Content Model

The current MVP uses `lib/data.ts` as a curated index of approved Google Drive resources.

This approach keeps private Drive credentials out of browser code while providing a controlled source of searchable content.

## Recommended Production Architecture

For a production implementation, use a server-side synchronization process that reads approved document metadata and writes it to a searchable data store.

```text
Approved Google Drive content
            ↓
Scheduled server-side sync
            ↓
Searchable database or index
            ↓
Next.js knowledge experience
```

Recommended components:

- Google Workspace OAuth with delegated or service-account access
- Scheduled synchronization endpoint or background job
- Postgres, Supabase, or another managed database
- Full-text and optional vector search
- FBS Google Workspace authentication
- Usage analytics for popular resources and searches
- Review dates and stale-content alerts
- Source ownership and approval metadata

## Security Principles

- Keep source documents private unless intentionally published.
- Store credentials only in server-side environment variables.
- Restrict access to approved FBS accounts and domains.
- Do not index passwords, secrets, or customer-identifiable case data.
- Preserve human review for external communications and high-impact decisions.
- Maintain traceable links from answers back to approved source material.

## Product Direction

Potential next steps include:

- Live Google Drive synchronization
- Role-based content access
- Improved search ranking and filters
- AI-assisted answers grounded in approved sources
- Content ownership and review workflows
- Search analytics and unanswered-question reporting
- Deeper integration with internal FBS tools

## Project Status

This repository represents an MVP and foundation for a broader internal FBS knowledge platform. The current implementation is suitable for product demonstrations, workflow validation, and iterative development.

---

<div align="center">

**Built for faster access to trusted FBS IDX knowledge.**

</div>
