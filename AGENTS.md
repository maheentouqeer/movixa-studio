<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Supabase background activity runs through a read-only GitHub Actions workflow and a UTC date-gated Python script, not database cron or app runtime, to avoid changes to the website and stored data.
- Public section and setting reads use explicit allowlists matching the homepage sections and social-link keys; other records remain admin-only to prevent future internal content from being published automatically.
