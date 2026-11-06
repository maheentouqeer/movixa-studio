# Supabase activity check

This workflow makes a read-only request to the public `site_settings` endpoint using the project's public anonymous key. It runs on a five-day day-of-month schedule and can also be started manually. It does not use a service-role key or change database records.

## Enable and run

1. Push the workflow to the repository's default branch.
2. In GitHub, open **Settings → Actions → General** and make sure Actions are enabled.
3. Open **Actions → Supabase activity check**. Choose **Run workflow** to start a manual check.

## Verify

Open the workflow's latest run in **Actions**. A successful job shows `Supabase public read returned HTTP 200` in its log. Scheduled runs may be delayed or skipped by GitHub, so this is best-effort activity and does not guarantee Supabase will never pause the project.