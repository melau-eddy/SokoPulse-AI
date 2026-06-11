import os
import requests
from bs4 import BeautifulSoup
from decimal import Decimal
import random
from datetime import datetime

from api.models import Product, CompetitorData

# Monitored US competitor targets grouped by industry/line of business
US_COMPETITORS = {
    "Electronics": ["Amazon US", "Best Buy", "Newegg", "B&H Photo Video"],
    "Pharmaceuticals": ["CVS Pharmacy", "Walgreens", "Rite Aid", "Walmart Pharmacy"],
    "Retail": ["Walmart", "Target", "Costco Wholesale", "Kroger"],
    "Healthcare": ["McKesson Corp", "Cardinal Health", "AmerisourceBergen", "Henry Schein"],
    "Construction": ["Home Depot", "Lowe's", "Menards", "Builders FirstSource"],
    "Industrial": ["Grainger", "McMaster-Carr", "MSC Industrial", "Fastenal"]
}

# Monitored Kenyan competitor targets grouped by industry/line of business
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
    If currency is USD (or other defaults), scrapes competitors within the US market.
    """
    # Normalize and determine active industry
    industry_key = "Industrial"
    if not industry:
        try:
            from api.utils.dynamic_seeder import get_active_industry
            industry = get_active_industry()
        except Exception as e:
            print(f"⚠️ Failed to get active industry: {e}")
    
    if industry:
        normalized = str(industry).strip().title()
        industry_key = normalized

    # Filter products to strictly belong to the indicated industry template or custom template
    from api.utils.dynamic_seeder import INDUSTRY_TEMPLATES, generate_custom_products
    products = Product.objects.all()
    if industry_key in INDUSTRY_TEMPLATES:
        template_names = {item["name"] for item in INDUSTRY_TEMPLATES[industry_key]}
        products = products.filter(product_name__in=template_names)
    else:
        custom_items = generate_custom_products(industry_key)
        custom_names = {item["name"] for item in custom_items}
        products = products.filter(product_name__in=custom_names)

    if not products.exists():
        print(f"ℹ️ No products registered for industry '{industry_key}' to compile competitor benchmarks.")
        return

    # Clear existing competitor data for these products to avoid mixing up different industries
    CompetitorData.objects.filter(product__in=products).delete()

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
        try:
            from api.utils.dynamic_seeder import get_crawler_competitors
            competitors = get_crawler_competitors(industry_key, currency)
        except Exception as e:
            print(f"⚠️ Failed to get crawler competitors dynamically: {e}")

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
                # Default to US market competitors for USD
                competitors = US_COMPETITORS.get(industry_key)
                if not competitors:
                    # Dynamically generate 4 competitor names for the custom industry in US
                    competitors = [
                        f"{industry_key} US",
                        f"American {industry_key}",
                        f"{industry_key} Pro USA",
                        f"Apex {industry_key}"
                    ]

    # Check if mock scraper domain is reachable to avoid consecutive 2s connection timeouts
    use_mock_scraper = False
    if products.exists():
        try:
            requests.get("https://mock-scrapers.sokopulse.ai", timeout=0.3)
            use_mock_scraper = True
        except Exception:
            use_mock_scraper = False

    observations_created = 0

    for product in products:
        base_price = float(product.unit_price)

        for competitor in competitors:
            # 1. Simulate scraping a web catalog (e.g. mock search requests)
            url = f"https://mock-scrapers.sokopulse.ai/search?q={product.product_name}&src={competitor}"
            
            scraped_price = None
            scraped_availability = "In Stock"
            res_ok = False

            if use_mock_scraper:
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
                        res_ok = True
                except Exception:
                    pass

            if not res_ok:
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

            # Create or update observation in database, catch IntegrityErrors from potential dynamic seeding race conditions
            try:
                CompetitorData.objects.create(
                    product=product,
                    competitor_name=competitor,
                    price=Decimal(str(scraped_price)),
                    availability=scraped_availability
                )
                observations_created += 1
            except Exception as e:
                print(f"⚠️ Failed to save competitor observation for {product.product_name}: {e}")

    print(f"🕸️ Competitor Scraping task completed ({currency}). Saved {observations_created} pricing observations.")


def get_real_competitors_via_ai(industry, currency):
    """
    Attempts to fetch 4 real-world competitor names for the given industry and currency using Gemini.
    Falls back to a DuckDuckGo web scraper if Gemini is not available or fails.
    """
    import os
    import google.generativeai as genai
    import json

    country = "Kenya" if currency == "KES" else "United States"
    api_key = os.getenv("GEMINI_API_KEY", "")
    
    if api_key:
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = (
                f"Identify the top 4 real-world competitor companies/brands in the '{industry}' industry in {country}.\n"
                f"Return only a JSON list of strings containing exactly 4 company names, with no other text, e.g. [\"Name 1\", \"Name 2\", \"Name 3\", \"Name 4\"]."
            )
            response = model.generate_content(prompt)
            text = response.text.strip()
            if "```" in text:
                text = text.split("```json")[-1].split("```")[0].strip()
                if "```" in text:
                    text = text.split("```")[-1].strip()
            names = json.loads(text)
            if isinstance(names, list) and len(names) == 4:
                return [str(n).strip() for n in names]
        except Exception as e:
            print(f"⚠️ Gemini failed to fetch competitors: {e}")

    # Fallback: DuckDuckGo HTML scraping
    import requests
    import re
    from bs4 import BeautifulSoup

    query = f"top {industry} brands manufacturers in {country}"
    url = f"https://html.duckduckgo.com/html/?q={query.replace(' ', '+')}"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}
    try:
        res = requests.get(url, headers=headers, timeout=5)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, "html.parser")
            snippets = [s.text for s in soup.select(".result__snippet")]
            candidates = []
            stop_words = {
                'the', 'a', 'an', 'in', 'on', 'at', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 
                'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'of', 'off', 'over', 
                'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 
                'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 
                'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 
                'kenya', 'united', 'states', 'america', 'us', 'uk', 'industry', 'brands', 'companies', 'manufacturers', 
                'top', 'best', 'most', 'popular', 'market', 'share', 'statista', 'report', 'reports', 'based', 'first', 
                'second', 'third', 'million', 'billion', 'percent', 'year', 'years', 'and', 'kenyan', 'american', 
                'african', 'east', 'west', 'north', 'south', 'global', 'local', 'national', 'international', 'ltd', 
                'limited', 'co', 'corp', 'corporation', 'inc', 'incorporated', 'since', 'zippia', 'keychain', 'about',
                'this', 'that', 'these', 'those', 'their', 'major', 'leading', 'various', 'large', 'largest', 'many',
                'one', 'two', 'three', 'four', 'which', 'who', 'whom', 'whose', 'they', 'them', 'he', 'him', 'she', 'her',
                'uganda', 'ugandan', 'tanzania', 'tanzanian', 'rwanda', 'rwandan', 'burundi', 'somalia', 'ethiopia', 'find', 'kenyans'
            }
            
            for snippet in snippets:
                matches = re.findall(r'\b[A-Z][a-zA-Z0-9\-\.]*(?:\s+[A-Z][a-zA-Z0-9\-\.]*)*\b', snippet)
                for match in matches:
                    cleaned = match.strip()
                    if len(cleaned) < 3:
                        continue
                    if cleaned.lower() in stop_words or any(w.lower() in stop_words for w in cleaned.split()):
                        continue
                    cleaned = re.sub(r'[\.,;:\-\s]+$', '', cleaned)
                    if cleaned not in candidates:
                        candidates.append(cleaned)
            
            valid_candidates = [c for c in candidates if len(c.split()) <= 4]
            if len(valid_candidates) >= 4:
                return valid_candidates[:4]
            elif valid_candidates:
                while len(valid_candidates) < 4:
                    fallback_name = f"{industry} Direct {len(valid_candidates)+1}"
                    valid_candidates.append(fallback_name)
                return valid_candidates
    except Exception as e:
        print(f"⚠️ DuckDuckGo fallback scraper failed: {e}")

    # Ultimate fallback: generate realistic placeholders
    if currency == "KES":
        return [
            f"{industry} East Africa",
            f"Kenya {industry}",
            f"Nairobi {industry} Pro",
            f"Soko {industry}"
        ]
    else:
        return [
            f"{industry} US",
            f"American {industry}",
            f"{industry} Pro USA",
            f"Apex {industry}"
        ]
