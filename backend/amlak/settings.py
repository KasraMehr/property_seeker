"""
Django settings for amlak project.
"""

from datetime import timedelta
from pathlib import Path

from celery.schedules import crontab
from decouple import config

# ============================================================
# BASE
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent


def env_bool(name, default=False):
    value = config(name, default=None)
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


# ============================================================
# SECURITY / ENVIRONMENT
# ============================================================

SECRET_KEY = config(
    "SECRET_KEY",
    default="django-insecure-local-dev-only-do-not-use-in-production",
)

DEBUG = env_bool("DEBUG", default=True)

IS_PRODUCTION = not DEBUG


# ============================================================
# HOSTS
# ============================================================

ALLOWED_HOSTS = [
    host.strip()
    for host in config(
        "ALLOWED_HOSTS",
        default="localhost,127.0.0.1",
    ).split(",")
    if host.strip()
]


# ============================================================
# CORS
# ============================================================

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in config(
        "CORS_ALLOWED_ORIGINS",
        default="http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

CORS_ALLOW_CREDENTIALS = True


# ============================================================
# CSRF
# ============================================================

CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in config(
        "CSRF_TRUSTED_ORIGINS",
        default="http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]


# ============================================================
# APPLICATIONS
# ============================================================

INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Project apps
    "audit",
    "accounts",
    "crm",
    "deals",
    "finance",
    "listing_media",
    "ingestion",
    "listing",
    "locations",
    "properties",
    "report",

    # Third party
    "django_extensions",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
]


# ============================================================
# MIDDLEWARE
# ============================================================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",

    # CORS
    "corsheaders.middleware.CorsMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ============================================================
# URLS / TEMPLATES
# ============================================================

ROOT_URLCONF = "amlak.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            BASE_DIR / "templates",
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "amlak.wsgi.application"


# ============================================================
# AUTH
# ============================================================

AUTH_USER_MODEL = "accounts.User"

DEFAULT_AUTO_FIELD = "django.db.models.AutoField"


# ============================================================
# DATABASE
# ============================================================

DB_ENGINE = config(
    "DB_ENGINE",
    default="django.db.backends.sqlite3",
)

if DB_ENGINE == "django.db.backends.postgresql":

    DATABASES = {
        "default": {
            "ENGINE": DB_ENGINE,
            "NAME": config(
                "DB_NAME",
                default="property_seeker",
            ),
            "USER": config(
                "DB_USER",
                default="property_seeker",
            ),
            "PASSWORD": config(
                "DB_PASSWORD",
                default="property_seeker",
            ),
            "HOST": config(
                "DB_HOST",
                default="localhost",
            ),
            "PORT": config(
                "DB_PORT",
                default="5432",
            ),
            "CONN_MAX_AGE": config(
                "DB_CONN_MAX_AGE",
                default=60,
                cast=int,
            ),
        }
    }

else:

    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": config(
                "SQLITE_PATH",
                default=BASE_DIR / "db.sqlite3",
            ),
        }
    }


# ============================================================
# PASSWORD VALIDATION
# ============================================================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "MinimumLengthValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "CommonPasswordValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "NumericPasswordValidator"
        ),
    },
]


# ============================================================
# INTERNATIONALIZATION
# ============================================================

LANGUAGE_CODE = "en-us"

TIME_ZONE = config(
    "TIME_ZONE",
    default="Asia/Tehran",
)

USE_I18N = True
USE_TZ = True


# ============================================================
# STATIC / MEDIA
# ============================================================
#
# WhiteNoise intentionally removed.
#
# Nginx serves:
#
# /static/ -> /app/staticfiles
# /media/  -> /app/media
#
# Django only runs collectstatic.
# ============================================================

STATIC_URL = "/static/"
MEDIA_URL = "/media/"

STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_ROOT = BASE_DIR / "media"


# IMPORTANT:
# Do NOT use:
#
# whitenoise.storage.CompressedManifestStaticFilesStorage
#
# because Nginx is responsible for serving static files.

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": (
            "django.contrib.staticfiles.storage.StaticFilesStorage"
        ),
    },
}


# ============================================================
# DJANGO REST FRAMEWORK
# ============================================================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "accounts.authenticate.CookieJWTAuthentication",
    ],

    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}


# ============================================================
# AUTHENTICATION BACKENDS
# ============================================================

AUTHENTICATION_BACKENDS = [
    "accounts.authenticate.PhoneBackend",
    "django.contrib.auth.backends.ModelBackend",
]


# ============================================================
# CSRF / SESSION / SECURITY COOKIES
# ============================================================

CSRF_COOKIE_HTTPONLY = False

CSRF_COOKIE_SAMESITE = "Lax"

CSRF_COOKIE_SECURE = env_bool(
    "CSRF_COOKIE_SECURE",
    default=IS_PRODUCTION,
)

SESSION_COOKIE_SECURE = env_bool(
    "SESSION_COOKIE_SECURE",
    default=IS_PRODUCTION,
)

SESSION_COOKIE_HTTPONLY = True


# ============================================================
# HTTPS SECURITY
# ============================================================

SECURE_SSL_REDIRECT = env_bool(
    "SECURE_SSL_REDIRECT",
    default=False,
)

SECURE_HSTS_SECONDS = config(
    "SECURE_HSTS_SECONDS",
    default=31536000 if IS_PRODUCTION else 0,
    cast=int,
)

SECURE_HSTS_INCLUDE_SUBDOMAINS = env_bool(
    "SECURE_HSTS_INCLUDE_SUBDOMAINS",
    default=IS_PRODUCTION,
)

SECURE_HSTS_PRELOAD = env_bool(
    "SECURE_HSTS_PRELOAD",
    default=IS_PRODUCTION,
)

SECURE_PROXY_SSL_HEADER = (
    "HTTP_X_FORWARDED_PROTO",
    "https",
)


# ============================================================
# SIMPLE JWT
# ============================================================

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),

    # Rotate refresh token
    "ROTATE_REFRESH_TOKENS": True,

    # Blacklist old refresh token
    "BLACKLIST_AFTER_ROTATION": True,

    # Cookie names
    "AUTH_COOKIE": "access",
    "AUTH_COOKIE_REFRESH": "refresh",

    # Cookie security
    "AUTH_COOKIE_HTTP_ONLY": True,

    "AUTH_COOKIE_SECURE": env_bool(
        "AUTH_COOKIE_SECURE",
        default=IS_PRODUCTION,
    ),

    "AUTH_COOKIE_SAMESITE": "Lax",

    # Optional values used by your authentication implementation
    "ACCESS_TOKEN_LIFETIME_SECONDS": 3600,
    "REFRESH_TOKEN_LIFETIME_SECONDS": 7 * 24 * 60 * 60,
}


# ============================================================
# LOGGING
# ============================================================

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,

    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },

    "root": {
        "handlers": ["console"],
        "level": "DEBUG" if DEBUG else "INFO",
    },
}


# ============================================================
# REDIS / CELERY
# ============================================================

REDIS_URL = config(
    "REDIS_URL",
    default="redis://localhost:6379/0",
)

CELERY_BROKER_URL = REDIS_URL

CELERY_RESULT_BACKEND = None

CELERY_TIMEZONE = config(
    "CELERY_TIMEZONE",
    default="Asia/Tehran",
)

CELERY_TASK_TRACK_STARTED = True

CELERY_TASK_TIME_LIMIT = config(
    "CELERY_TASK_TIME_LIMIT",
    default=3600,
    cast=int,
)

CELERY_TASK_SOFT_TIME_LIMIT = config(
    "CELERY_TASK_SOFT_TIME_LIMIT",
    default=3300,
    cast=int,
)

CELERY_WORKER_MAX_TASKS_PER_CHILD = config(
    "CELERY_WORKER_MAX_TASKS_PER_CHILD",
    default=10,
    cast=int,
)

CELERY_WORKER_PREFETCH_MULTIPLIER = 1

CELERY_TASK_REJECT_ON_WORKER_LOST = True

CELERY_TASK_ALWAYS_EAGER = env_bool(
    "CELERY_TASK_ALWAYS_EAGER",
    default=False,
)

CELERY_TASK_EAGER_PROPAGATES = True


# ============================================================
# CELERY ROUTES
# ============================================================

CELERY_TASK_ROUTES = {
    "ingestion.tasks.classify_listing_advertiser": {
        "queue": "default",
    },
    "ingestion.tasks.discover_run": {
        "queue": "scraping",
    },
    "ingestion.tasks.process_run_batch": {
        "queue": "scraping",
    },
}


# ============================================================
# CELERY BEAT
# ============================================================

CELERY_BEAT_SCHEDULE = {
    "divar-discovery-every-15-minutes": {
        "task": "ingestion.tasks.dispatch_incremental_discovery",
        "schedule": timedelta(minutes=15),
    },

    "divar-refresh-dispatch-every-15-minutes": {
        "task": "ingestion.tasks.dispatch_due_refreshes",
        "schedule": timedelta(minutes=15),
    },

    "divar-daily-token-reconciliation": {
        "task": "ingestion.tasks.dispatch_daily_reconciliation",
        "schedule": crontab(
            hour=2,
            minute=0,
        ),
    },
}


DIVAR_REQUEST_INTERVAL_SECONDS = config(
    "DIVAR_REQUEST_INTERVAL_SECONDS",
    default=2.5,
    cast=float,
)

DIVAR_PROFILE_DIR = config(
    "DIVAR_PROFILE_DIR",
    default="",
)

DIVAR_PHONE_INGESTION_ENABLED = env_bool(
    "DIVAR_PHONE_INGESTION_ENABLED",
    default=False,
)

DIVAR_LOGIN_STEP_TIMEOUT_SECONDS = config(
    "DIVAR_LOGIN_STEP_TIMEOUT_SECONDS",
    default=90,
    cast=int,
)

DIVAR_LOGIN_OTP_TIMEOUT_SECONDS = config(
    "DIVAR_LOGIN_OTP_TIMEOUT_SECONDS",
    default=600,
    cast=int,
)

DIVAR_REQUIRE_AUTHENTICATED_SESSION = env_bool(
    "DIVAR_REQUIRE_AUTHENTICATED_SESSION",
    default=False,
)

GAPGPT_API_KEY = config(
    "GAPGPT_API_KEY",
    default="",
)

GAPGPT_BASE_URL = config(
    "GAPGPT_BASE_URL",
    default="https://api.gapgpt.app/v1",
).rstrip("/")

GAPGPT_MODEL = config(
    "GAPGPT_MODEL",
    default="gpt-5.6-luna",
)

GAPGPT_TIMEOUT_SECONDS = config(
    "GAPGPT_TIMEOUT_SECONDS",
    default=30,
    cast=float,
)


# ============================================================
# PRODUCTION SAFETY CHECKS
# ============================================================

if IS_PRODUCTION:

    _insecure_key_markers = (
        "django-insecure",
        "unsafe",
        "changeme",
        "change-me",
    )

    # --------------------------------------------------------
    # SECRET KEY
    # --------------------------------------------------------

    if not SECRET_KEY or len(SECRET_KEY) < 50:
        raise RuntimeError(
            "SECRET_KEY is missing or too short for production "
            "(must be at least 50 random characters)."
        )

    if any(
        marker in SECRET_KEY.lower()
        for marker in _insecure_key_markers
    ):
        raise RuntimeError(
            "SECRET_KEY is still a development placeholder. "
            "Generate a real random key before running with "
            "DEBUG=False."
        )

    # --------------------------------------------------------
    # ALLOWED HOSTS
    # --------------------------------------------------------

    if not ALLOWED_HOSTS:
        raise RuntimeError(
            "ALLOWED_HOSTS must contain your production "
            "IP/domain when DEBUG=False."
        )

    if any(
        host in {"localhost", "127.0.0.1"}
        for host in ALLOWED_HOSTS
    ):
        raise RuntimeError(
            "ALLOWED_HOSTS must not contain localhost or "
            "127.0.0.1 in production."
        )

    # --------------------------------------------------------
    # CORS / CSRF
    # --------------------------------------------------------

    if any(
        "localhost" in origin
        or "127.0.0.1" in origin
        for origin in (
            CORS_ALLOWED_ORIGINS
            + CSRF_TRUSTED_ORIGINS
        )
    ):
        raise RuntimeError(
            "CORS_ALLOWED_ORIGINS / CSRF_TRUSTED_ORIGINS "
            "still contain localhost. Configure the real "
            "frontend origin in production."
        )

    # --------------------------------------------------------
    # DATABASE
    # --------------------------------------------------------

    if DB_ENGINE == "django.db.backends.postgresql":

        _db_password = config(
            "DB_PASSWORD",
            default="",
        )

        if (
            not _db_password
            or _db_password == "property_seeker"
        ):
            raise RuntimeError(
                "DB_PASSWORD is missing or still set to "
                "the default development value."
            )

    else:

        raise RuntimeError(
            "DB_ENGINE is sqlite in a production run "
            "(DEBUG=False). Set "
            "DB_ENGINE=django.db.backends.postgresql "
            "and the matching DB_* variables."
        )
