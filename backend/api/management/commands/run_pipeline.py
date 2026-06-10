from django.core.management.base import BaseCommand
from api.scrapers.crawler import scrape_competitor_prices
from api.ml.forecaster import run_intelligence_pipeline


class Command(BaseCommand):
    help = "Triggers the competitor price scraper, updates forecasting models, and generates AI replenishment recommendations."

    def add_arguments(self, parser):
        parser.add_argument(
            "--industry",
            type=str,
            default=None,
            help="Define the line of business/industry target for scraping",
        )

    def handle(self, *args, **options):
        industry = options.get("industry")
        if not industry:
            from api.utils.dynamic_seeder import get_active_industry
            industry = get_active_industry()
        self.stdout.write(f"🕸️ 1. Dispatching Competitor Pricing Crawler for {industry}...")
        try:
            scrape_competitor_prices(industry=industry)
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
