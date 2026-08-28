# Portfolio Owner's Guide

This guide explains how to maintain and publish the Tersoo Yaji portfolio without returning to ChatGPT.

## 1. Website addresses

| Purpose | Address |
| --- | --- |
| Public portfolio | <https://yajitersoo.github.io/> |
| Portfolio Studio | <https://yajitersoo.github.io/admin/> |
| GitHub repository | <https://github.com/yajitersoo/yajitersoo.github.io> |
| Deployment workflow | <https://github.com/yajitersoo/yajitersoo.github.io/actions/workflows/deploy-pages.yml> |
| Supabase dashboard | <https://supabase.com/dashboard> |

## 2. What can be changed in Portfolio Studio

Open the Portfolio Studio address and sign in with the authorized administrator account.

### Update profile information

1. Select **Profile**.
2. Edit the display name, headline, introduction, biography, location, public email, LinkedIn URL, GitHub URL, or CV URL.
3. Select **Save profile**.
4. Refresh the public website to confirm the change.

These changes are saved in Supabase and normally appear immediately. A GitHub deployment is not required.

### Add a project

1. Select **Projects**, then **New project**.
2. Enter the title and summary. The URL slug is generated from the title.
3. Select the category and year.
4. Set the status:
   - **Draft** keeps the record inside Portfolio Studio only.
   - **Published** makes it visible on the public Work page.
   - **Archived** removes it from the public catalogue without deleting it.
5. Set the display order. Lower numbers appear earlier when the portfolio-order sort is active.
6. Enter tags and tools as comma-separated values.
7. Add the product URL, role, challenge, contribution, approach, decision value, key outputs, and any public-use note.
8. Upload a PNG, JPG, or WebP preview image that is safe for public release.
9. Enable **Feature this project** if it should receive priority in relevant project sorting.
10. Select **Save project**, then refresh the public Work page.

### Edit or remove a project

1. Select **Projects**.
2. Use the edit button beside the project, change the record, and select **Save project**.
3. To remove a project permanently, use the delete button and confirm the warning.

Deleting a project record does not automatically delete its uploaded image from Supabase Storage. Remove unused files separately in **Supabase > Storage > portfolio-assets** when required.

### Important limitation

Portfolio Studio controls the public profile fields and the Supabase project catalogue. It does not currently control page layouts, navigation labels, colours, the About-page portrait, experience history, education, capabilities, tools, homepage statistics, or the three fixed homepage featured projects. Those items are maintained in GitHub.

## 3. Change text, portrait, layout, or colours in GitHub

Use GitHub for design and source-controlled content changes.

| Change | Main file |
| --- | --- |
| Homepage content and fixed featured projects | `app/page.tsx` and `lib/projects.ts` |
| About page structure and portrait | `app/about/page.tsx` and `public/tersoo-yaji-portrait.jpeg` |
| Experience, education, capabilities, tools, and statistics | `data/profile.ts` |
| Contact page structure | `app/contact/page.tsx` |
| Navigation | `components/site-header.tsx` |
| Footer | `components/site-footer.tsx` |
| Colours, fonts, spacing, and page styling | `app/globals.css` |
| Static fallback project catalogue | `data/projects.json` |

### Change the main colour palette

1. Open `app/globals.css` in GitHub.
2. Select the pencil icon to edit the file.
3. Near the top, update the colour variables under `:root`.

The principal colours are:

```css
--navy: #071a33;
--navy-2: #0b274a;
--blue: #125dc7;
--blue-2: #0b4ea9;
--orange: #d84b0b;
--orange-dark: #a83b0b;
--paper: #f6f8fa;
```

Changing these variables updates most of the website consistently. Keep sufficient contrast between text and backgrounds.

### Replace the About-page portrait

1. Prepare a square JPG or JPEG image.
2. In the repository, open the `public` folder.
3. Replace `tersoo-yaji-portrait.jpeg` using the exact same filename.
4. Commit the change and publish it using the workflow below.

Changing a file in GitHub does not update the public website until GitHub Pages is deployed.

## 4. Safe GitHub editing and publishing workflow

For each source-code or design change:

1. Open the GitHub repository.
2. Create a new branch from `main`, for example `update-about-text`.
3. Edit or upload the required files on that branch.
4. Commit the changes.
5. Open a pull request into `main`.
6. Review the changed files, then merge the pull request.
7. Open the **Deploy portfolio to GitHub Pages** workflow.
8. Select **Run workflow**, choose `main`, and select **Run workflow** again.
9. Wait until both **build** and **deploy** show green check marks.
10. Open the public site and use a hard refresh if the previous version remains cached:
    - Windows: `Ctrl + Shift + R`
    - macOS: `Command + Shift + R`

The workflow is manual by design. Merging a pull request alone does not publish the new version.

## 5. Supabase settings that must remain in place

The GitHub repository requires these two Actions secrets:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

They are managed at **GitHub repository > Settings > Secrets and variables > Actions**.

Do not add a Supabase service-role key to GitHub Pages, browser code, screenshots, or public documentation. The publishable key is intended for browser use, while Row Level Security and the administrator allowlist enforce access.

The authorized administrator must remain in:

- Supabase Authentication under **Users**
- the `public.portfolio_admins` database table

## 6. Backups and service continuity

The repository contains a static fallback profile and a 57-project catalogue. If Supabase is unavailable or paused:

- the public site remains accessible using its static fallback content;
- Portfolio Studio sign-in, database editing, and uploads will be unavailable;
- recent Supabase-only changes may not appear until the project is restored;
- after Supabase resumes, sign in to Portfolio Studio and continue editing normally.

Supabase plan limits and pause policies can change. Check the current project status and billing page in the Supabase dashboard rather than relying on an old pricing assumption.

For additional protection, periodically export the `projects` and `profiles` tables from Supabase and retain copies of important original images and products outside Supabase Storage.

## 7. Troubleshooting

### Portfolio Studio says the backend connection is missing

1. Confirm that both GitHub Actions secrets exist with the exact names above.
2. Run the GitHub Pages workflow again.
3. Hard-refresh `/admin/` after deployment succeeds.

### Sign-in succeeds but access is restricted

Confirm that the authenticated user's UUID exists in `public.portfolio_admins`.

### A project does not appear publicly

Check that its status is **Published**, then refresh the Work page. Draft and archived records are intentionally hidden.

### An image does not appear

- Confirm that the upload completed and the project shows a preview in Portfolio Studio.
- For the portrait, confirm that `public/tersoo-yaji-portrait.jpeg` exists with the exact filename.
- Hard-refresh the page to bypass an older cached version.

### A GitHub deployment fails

Open the failed workflow run, select the red **build** or **deploy** job, and inspect the first failed step. Do not rerun repeatedly without first correcting the reported error.

## 8. Routine maintenance checklist

- Review public links and contact details every three months.
- Keep only public-safe images and products in the portfolio.
- Use Draft status while preparing incomplete project records.
- Export Supabase tables periodically.
- Keep GitHub Actions secrets configured.
- Confirm the public site after every deployment.
- Avoid deleting the `main` branch, deployment workflow, Supabase migration, or `.openai/hosting.json`.
