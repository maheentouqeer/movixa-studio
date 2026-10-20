"""Read one public setting without modifying application data."""

import os
from datetime import date, datetime, timezone
from urllib.request import Request, urlopen

INTERVAL_DAYS = 6
ANCHOR_DATE = date(2026, 10, 20)


def is_due(today: date) -> bool:
    return (today - ANCHOR_DATE).days % INTERVAL_DAYS == 0


def main() -> None:
    today = datetime.now(timezone.utc).date()
    manual = os.environ.get("GITHUB_EVENT_NAME") == "workflow_dispatch"
    if not manual and not is_due(today):
        print("No Supabase request due today.")
        return

    url = os.environ["SUPABASE_URL"].rstrip("/")
    key = os.environ["SUPABASE_PUBLISHABLE_KEY"]
    request = Request(
        f"{url}/rest/v1/site_settings?select=key&limit=1",
        headers={"apikey": key, "Accept": "application/json"},
    )
    with urlopen(request, timeout=30) as response:
        if response.status != 200:
            raise RuntimeError("Supabase read did not return HTTP 200")
        response.read()
    print("Supabase public read succeeded. No data was changed.")


if __name__ == "__main__":
    main()