import os
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

KENYAN_COMPETITORS = {
    "Electronics": ["Jumia Kenya", "Kilimall", "Masoko", "Aviye Electronics"],
    "Pharmaceuticals": ["MyDawa", "GoodLife Pharmacy", "Haltons Pharmacy", "Kasha Kenya"],
    "Retail": ["Naivas", "Carrefour Kenya", "Quickmart", "Tuskys"],
    "Healthcare": ["MyDawa", "GoodLife Pharmacy", "Haltons Pharmacy", "Kasha Kenya"],
    "Construction": ["Bamburi Cement", "Devki Steel", "Mombasa Cement", "National Cement"],
    "Industrial": ["Davis & Shirtliff", "Car & General", "Krones Kenya", "East African Cables"]
}


def scrape_competitor_prices(industry=None, competitors=None, currency=None):
    """
    Phase 6: Competitor Intelligence Module.
    Scrapes competitor web catalogs or generates normalized benchmarks for each product.
    If currency is KES, scrapes competitors within the Kenyan market.
    """
    products = Product.objects.all()
    if not products.exists():
        print("ℹ️ No products registered to compile competitor benchmarks.")
        return

    # Clear existing competitor data to avoid mixing up different industries/lines of business
    CompetitorData.objects.all().delete()

    # Normalize industry input
    industry_key = "Industrial"
    if industry:
        normalized = str(industry).strip().title()
        industry_key = normalized

    # Fallback to read currency from file if not passed
    if not currency:
        try:
            # Look in backend directory (root of django project)
            file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "currency_setting.txt")
            if os.path.exists(file_path):
                with open(file_path, "r") as f:
                    currency = f.read().strip().upper()
        except Exception as e:
            print(f"⚠️ Failed to read currency settings file: {e}")
        if not currency:
            currency = "USD"

    if not competitors:
        if currency == "KES":
            competitors = KENYAN_COMPETITORS.get(industry_key)
            if not competitors:
                # Dynamically generate 4 competitor names for the custom industry in Kenya
                competitors = [
                    f"{industry_key} East Africa",
                    f"Kenya {industry_key}",
                    f"Nairobi {industry_key} Pro",
                    f"Soko {industry_key}"
                ]
        else:
            competitors = INDUSTRY_COMPETITORS.get(industry_key)
            if not competitors:
                # Dynamically generate 4 competitor names for the custom industry
                competitors = [
                    f"{industry_key}Direct",
                    f"Bio{industry_key} Solutions",
                    f"{industry_key} Pro",
                    f"Apex {industry_key}"
                ]

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
                        raw_text = price_tag.text.upper()
                        val_str = raw_text.replace("$", "").replace("KES", "").replace("KSH", "").replace(",", "").strip()
                        parsed_val = float(val_str)
                        if "KES" in raw_text or "KSH" in raw_text or currency == "KES":
                            # Convert KES to USD base price (assuming 130 KES per USD conversion rate)
                            scraped_price = round(parsed_val / 130.0, 2)
                        else:
                            scraped_price = parsed_val
                    if stock_tag and "out" in stock_tag.text.lower():
                        scraped_availability = "Out of Stock"
            except Exception:
                # Standalone fallback: generate realistic competitor pricing margins
                try:
                    comp_idx = competitors.index(competitor)
                except ValueError:
                    comp_idx = 0

                variance = 0.0
                if comp_idx == 0:
                    variance = random.uniform(0.02, 0.06) # Premium competitor (+2% to +6%)
                elif comp_idx == 1:
                    variance = random.uniform(-0.01, 0.01) # Parity competitor (-1% to +1%)
                elif comp_idx == 2:
                    variance = random.uniform(-0.03, 0.01) # Slightly cheaper (-3% to +1%)
                elif comp_idx == 3:
                    variance = random.uniform(-0.06, -0.02) # Discounter (-6% to -2%)

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

    print(f"🕸️ Competitor Scraping task completed ({currency}). Saved {observations_created} pricing observations.")
