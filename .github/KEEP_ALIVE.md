# Supabase background activity

After these files sync to the default branch of `maheentouqeer/movixa-studio`, open GitHub → Actions → Supabase background activity → Run workflow to verify it.
If Actions is disabled, enable it in repository Settings → Actions → General.

The workflow starts daily at approximately 07:23 UTC. It performs one read-only request to the existing public `site_settings` table every six days, anchored to October 20, 2026. Manual runs always perform the request. No private inquiries are accessed, no data is written, and no UI or database policies change. No service-role key or new credentials are required.

Daily gating avoids the uneven gaps caused by day-of-month cron expressions such as `*/6`. GitHub can delay or drop scheduled runs; public repositories may have schedules disabled after 60 days without repository activity. A missed due day is not retried on subsequent days. Check failed-run emails and the Actions history. Resume an already paused project in Supabase first; a request cannot resume it.

This is best-effort activity, not a guarantee against pausing. Supabase considers sufficient activity over seven days, not a documented single-request reset timer. Supabase paid plans are the supported way to avoid inactivity pauses. GitHub Actions usage is subject to GitHub's plan limits.