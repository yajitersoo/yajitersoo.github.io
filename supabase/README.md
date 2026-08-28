# Supabase setup

The public portfolio works from the verified static catalogue without Supabase. Supabase activates the private administrator interface, live project records, profile editing and media uploads.

1. Create a Supabase project.
2. Run `migrations/0001_portfolio.sql` in the Supabase SQL editor.
3. Create the administrator account in Supabase Authentication.
4. Find that user's UUID and run:

```sql
insert into public.portfolio_admins (user_id)
values ('YOUR_AUTH_USER_UUID');
```

5. Disable public account registration unless additional administrators are intentionally required.
6. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the build environment.
7. Sign in at `/admin/` and use **Import catalogue** to move the 57 verified records into PostgreSQL.

The publishable key can be present in the browser bundle. Access control depends on the database grants and row-level security policies. Never place the service-role key in frontend code or commit it to the repository.

