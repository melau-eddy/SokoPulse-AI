from django.core.management.base import BaseCommand
from api.scrapers.crawler import scrape_competitor_prices
from api.ml.forecaster import run_intelligence_pipeline


class Command(BaseCommand):
    help = "Triggers the competitor price scraper, updates forecasting models, and generates AI replenishment recommendations."

    def handle(self, *args, **options):
        self.stdout.write("🕸️ 1. Dispatching Competitor Pricing Crawler...")
        try:
            scrape_competitor_prices()
            self.stdout.write(self.style.SUCCESS("Scraper observations logged successfully."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Scraper job failed: {e}"))

        self.stdout.write("🧠 2. Executing Forecasting and Intelligence Models...")
        try:
            run_intelligence_pipeline()
            self.stdout.write(self.style.SUCCESS("Forecasting, Alerts, and Pricing suggestions successfully compiled."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Intelligence pipeline failed: {e}"))

        self.stdout.write(self.style.SUCCESS("🎯 Autonomous SokoPulse telemetry cycle complete!"))
