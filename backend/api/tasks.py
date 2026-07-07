from celery import shared_task
from api.scrapers.crawler import scrape_competitor_prices
from api.ml.forecaster import run_intelligence_pipeline
import logging

logger = logging.getLogger(__name__)


@shared_task(name="api.tasks.scrape_competitors_task")
def scrape_competitors_task(industry=None, currency=None, competitors=None, country=None):
    """Celery background task to trigger the competitor scraping crawler."""
    logger.info(f"🚀 Starting background competitor scraping task for: {industry or 'Default'}, currency: {currency or 'Default'}, country: {country or 'Default'}")
    try:
        scrape_competitor_prices(industry=industry, currency=currency, competitors=competitors, country=country)
        logger.info("✅ Background competitor scraping completed successfully.")
        return "Scraper completed."
    except Exception as e:
        logger.error(f"❌ Background competitor scraping failed: {e}")
        raise e


@shared_task(name="api.tasks.retrain_forecaster_task")
def retrain_forecaster_task():
    """Celery background task to retrain the ML demand forecaster and update alerts/replenishments."""
    logger.info("🧠 Starting background ML demand forecasting and intelligence pipeline...")
    try:
        run_intelligence_pipeline()
        logger.info("✅ Background ML intelligence pipeline completed successfully.")
        return "Forecaster completed."
    except Exception as e:
        logger.error(f"❌ Background ML intelligence pipeline failed: {e}")
        raise e
