"""Deliberately impossible to point at a real remote merchant database."""

import os
import sys

if (
    os.environ.get("TUSCANINI_SPIKE_ONLY") != "yes"
    or os.environ.get("POSTGRES_DB") != "tuscanini_spike"
    or os.environ.get("POSTGRES_HOST", "127.0.0.1") not in {"localhost", "127.0.0.1"}
):
    sys.exit("REFUSED: only the explicitly marked localhost tuscanini_spike test DB is permitted.")

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "spike.settings")

import django
from django.conf import settings
from django.test.utils import get_runner

django.setup()
runner = get_runner(settings)(verbosity=2, interactive=False, keepdb=False)
failures = runner.run_tests(["spike"])
raise SystemExit(1 if failures else 0)
