# Tersoo Yaji Portfolio

A data-driven professional portfolio covering monitoring, evaluation, information management, analytics, dashboards and GIS work.

## Experience

The site contains:

- Executive homepage
- Searchable and filterable library of 57 migrated products
- Reusable project case-study pages
- Professional profile and contact pages
- Private Portfolio Studio for project, profile and media management
- Supabase PostgreSQL, Authentication, Storage and Row Level Security setup
- Static export designed for GitHub Pages

## Local development

```bash
npm ci
npm run dev
```

## Validation

```bash
npm run lint
npm test
```

## Backend configuration

Copy `.env.example` to `.env.local`, add the Supabase project URL and publishable key, then follow [supabase/README.md](supabase/README.md).

The service-role key is optional for local administrative scripts and must never be exposed to the browser or committed.

## GitHub Pages

The Pages workflow is intentionally manual. This prevents the new portfolio from replacing the existing live site before review and approval. After the final content review, configure GitHub Pages to use GitHub Actions and run the deployment workflow.
