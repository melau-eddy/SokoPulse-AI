import requests
from bs4 import BeautifulSoup
from decimal import Decimal
import random
from datetime import datetime

from api.models import Product, CompetitorData

# Monitored competitor targets grouped by industry/line of business
INDUSTRY_COMPETITORS = {
    "Electronics": ["GlobalLogix", "Nexus Supply Pro", "Apex Trading Co.", "Meridian Imports"],
    "Pharmaceuticals": ["PharmaDirect", "BioHealth Solutions", "Medline Corp", "Apex Pharma"],
    "Retail": ["MegaMart", "ValueSupermarket", "GrocerPlus", "FreshFoods Co"],
    "Healthcare": ["BioHealth Solutions", "Medline Corp", "Apex Pharma", "CareSupply"],
    "Construction": ["IndustrialBuild", "IronBridge Castings", "VoltMaterials", "BuildCorp"],
    "Industrial": ["GlobalLogix", "Nexus Supply Pro", "Apex Trading Co.", "Meridian Imports"]
}


def scrape_competitor_prices(industry=None):
    """
    Phase 6: Competitor Intelligence Module.
    Scrapes competitor web catalogs or generates normalized benchmarks for each product.
    """
    products = Product.objects.all()
    if not products.exists():
        print("ℹ️ No products registered to compile competitor benchmarks.")
        return

    # Normalize industry input
    industry_key = "Industrial"
    if industry:
        normalized = str(industry).strip().capitalize()
        if normalized in INDUSTRY_COMPETITORS:
            industry_key = normalized

    competitors = INDUSTRY_COMPETITORS[industry_key]
    observations_created = 0

    for product in products:
        base_price = float(product.unit_price)

        for competitor in competitors:
            # 1. Simulate scraping a web catalog (e.g. mock search requests)
            url = f"https://mock-scrapers.sokopulse.ai/search?q={product.product_name}&src={competitor}"
            
            scraped_price = None
            scraped_availability = "In Stock"

            try:
                # Mock get request to competitor website index
                # This shows the actual structure for BeautifulSoup requests
                res = requests.get(url, timeout=2)
                if res.status_code == 200:
                    soup = BeautifulSoup(res.text, "html.parser")
                    # Mock selectors representing typical e-commerce DOM paths
                    price_tag = soup.select_one(".price-amount")
                    stock_tag = soup.select_one(".availability-badge")
                    
                    if price_tag:
                        scraped_price = float(price_tag.text.replace("$", "").replace(",", ""))
                    if stock_tag and "out" in stock_tag.text.lower():
                        scraped_availability = "Out of Stock"
            except Exception:
                # Standalone fallback: generate realistic competitor pricing margins
                # GlobalLogix is highest, Meridian is cheapest
                variance = 0.0
                if competitor == "GlobalLogix":
                    variance = random.uniform(0.02, 0.06) # +2% to +6%
                elif competitor == "Nexus Supply Pro":
                    variance = random.uniform(-0.01, 0.01) # -1% to +1%
                elif competitor == "Apex Trading Co.":
                    variance = random.uniform(-0.03, 0.01) # -3% to +1%
                elif competitor == "Meridian Imports":
                    variance = random.uniform(-0.06, -0.02) # -6% to -2%

                scraped_price = round(base_price * (1 + variance), 2)
                scraped_availability = "In Stock" if random.random() > 0.15 else "Out of Stock"

            # Create or update observation in database
            CompetitorData.objects.create(
                product=product,
                competitor_name=competitor,
                price=Decimal(str(scraped_price)),
                availability=scraped_availability
            )
            observations_created += 1

    print(f"🕸️ Competitor Scraping task completed. Saved {observations_created} pricing observations.")
