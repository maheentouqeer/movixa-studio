import unittest
from datetime import date, timedelta
from supabase_keep_alive import is_due


class KeepAliveScheduleTests(unittest.TestCase):
    def test_requests_are_due_every_six_days_across_months(self):
        start = date(2026, 10, 20)
        due_days = [day for day in range(100) if is_due(start + timedelta(days=day))]
        self.assertEqual(due_days, list(range(0, 100, 6)))


if __name__ == "__main__":
    unittest.main()