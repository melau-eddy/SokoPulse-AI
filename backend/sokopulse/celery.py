import os
from celery import Celery

# Set default Django settings module for celery command-line tool
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sokopulse.settings")

app = Celery("sokopulse")

# Configure Celery using settings starting with CELERY_ prefix
app.config_from_object("django.conf:settings", namespace="CELERY")

# Load task modules from all registered Django app configs
app.autodiscover_tasks()
