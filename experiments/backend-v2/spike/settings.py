"""Ephemeral PostgreSQL-only experiment; never reuse as production settings."""

import os

SECRET_KEY = "only-for-ephemeral-tuscanini-spike-tests"
DEBUG = False
USE_TZ = True
TIME_ZONE = "UTC"
INSTALLED_APPS = ["spike.apps.SpikeConfig"]
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
MIGRATION_MODULES = {"spike": None}  # test runner syncs experimental models

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "tuscanini_spike",
        "USER": os.environ.get("POSTGRES_USER", "spike"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD", ""),
        "HOST": os.environ.get("POSTGRES_HOST", "127.0.0.1"),
        "PORT": os.environ.get("POSTGRES_PORT", "5432"),
        "CONN_MAX_AGE": 0,
    }
}
