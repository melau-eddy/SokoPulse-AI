import random
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone

from api.models import (
    Product,
    Inventory,
    Sales,
    Supplier,
    CompetitorData,
    AIRecommendation,
    Alert,
)

# Core templates for predefined industries
INDUSTRY_TEMPLATES = {
    "Electronics": [
        {"name": "Apex-9 Optical Sensor", "sku": "APX-901-ZH", "cat": "Electronics", "price": 1199.00, "stock": 14, "reorder": 120},
        {"name": "Neural Engine Core v2", "sku": "NRC-990-X", "cat": "Electronics", "price": 2450.00, "stock": 890, "reorder": 250},
        {"name": "Ceramic Capacitor 220uF", "sku": "CRC-220-A", "cat": "Electronics", "price": 0.42, "stock": 85000, "reorder": 12000},
        {"name": "Flex-Cable Assembly", "sku": "FCA-220-G", "cat": "Electronics", "price": 14.00, "stock": 2400, "reorder": 800},
        {"name": "Quantum Processor X2", "sku": "QPX-002-R", "cat": "Electronics", "price": 3299.00, "stock": 1240, "reorder": 300},
        {"name": "Smart Hub Z-Wave", "sku": "SHZ-001-W", "cat": "IoT", "price": 149.00, "stock": 612, "reorder": 250},
    ],
    "Pharmaceuticals": [
        {"name": "Aspirin 81mg (Low Dose)", "sku": "ASP-081-LD", "cat": "Analgesics", "price": 8.99, "stock": 500, "reorder": 1000},
        {"name": "Amoxicillin 500mg Capsule", "sku": "AMX-500-CP", "cat": "Antibiotics", "price": 24.50, "stock": 120, "reorder": 400},
        {"name": "Vitamin C 1000mg Tab", "sku": "VTC-100-TB", "cat": "Supplements", "price": 12.99, "stock": 1500, "reorder": 500},
        {"name": "Atorvastatin 20mg Tab", "sku": "ATR-020-TB", "cat": "Cardiovascular", "price": 45.00, "stock": 15, "reorder": 100},
        {"name": "Loratadine 10mg Allergy", "sku": "LRT-010-AL", "cat": "Antihistamines", "price": 15.99, "stock": 350, "reorder": 200},
        {"name": "Ibuprofen 400mg Tablet", "sku": "IBU-400-TB", "cat": "Analgesics", "price": 6.49, "stock": 80, "reorder": 300},
    ],
    "Retail": [
        {"name": "Organic Fuji Apples (Bag)", "sku": "APL-FUG-OR", "cat": "Produce", "price": 4.99, "stock": 35, "reorder": 100},
        {"name": "Whole Milk 1 Gallon", "sku": "MLK-WHL-GL", "cat": "Dairy", "price": 3.49, "stock": 15, "reorder": 80},
        {"name": "Fresh Sourdough Bread", "sku": "BRD-SRD-FR", "cat": "Bakery", "price": 5.99, "stock": 4, "reorder": 20},
        {"name": "Extra Virgin Olive Oil 1L", "sku": "OIL-EVO-1L", "cat": "Pantry", "price": 14.99, "stock": 120, "reorder": 50},
        {"name": "Free Range Brown Eggs (Dozen)", "sku": "EGG-FRB-DZ", "cat": "Dairy", "price": 4.89, "stock": 18, "reorder": 40},
        {"name": "Premium Ground Coffee 12oz", "sku": "COF-PRE-12", "cat": "Beverages", "price": 9.99, "stock": 210, "reorder": 100},
    ],
    "Healthcare": [
        {"name": "Surgical Mask 3-Ply (Box/50)", "sku": "MSK-3PL-BX", "cat": "PPE", "price": 12.99, "stock": 50, "reorder": 200},
        {"name": "Nitrile Exam Gloves (Box/100)", "sku": "GLV-NIT-BX", "cat": "PPE", "price": 18.50, "stock": 420, "reorder": 150},
        {"name": "Digital Forehead Thermometer", "sku": "THR-DIG-FH", "cat": "Devices", "price": 34.99, "stock": 8, "reorder": 30},
        {"name": "Antiseptic Wipes (Tub/160)", "sku": "WIP-ANT-TB", "cat": "Sanitizers", "price": 8.99, "stock": 90, "reorder": 100},
        {"name": "Sterile Gauze Pads 4x4", "sku": "GAZ-STR-44", "cat": "Wound Care", "price": 6.49, "stock": 310, "reorder": 100},
        {"name": "Automatic Blood Pressure Monitor", "sku": "BPM-AUT-MN", "cat": "Devices", "price": 49.99, "stock": 14, "reorder": 25},
    ],
    "Construction": [
        {"name": "Portland Cement 94lb Bag", "sku": "CMT-POR-94", "cat": "Materials", "price": 18.50, "stock": 35, "reorder": 150},
        {"name": "Deformed Steel Rebar #4", "sku": "RBR-DEF-04", "cat": "Structural", "price": 9.25, "stock": 250, "reorder": 100},
        {"name": "Yellow Pine Stud 2x4x8", "sku": "LMB-YPN-24", "cat": "Lumber", "price": 5.49, "stock": 800, "reorder": 200},
        {"name": "Drywall Panel 4ft x 8ft", "sku": "DWL-PAN-48", "cat": "Wallboard", "price": 14.99, "stock": 12, "reorder": 50},
        {"name": "Premium Roof Shingles (Bundle)", "sku": "SHG-PRE-BD", "cat": "Roofing", "price": 38.00, "stock": 64, "reorder": 100},
        {"name": "Galvanized Wood Screws (Box/100)", "sku": "SCR-GLV-BX", "cat": "Fasteners", "price": 7.99, "stock": 140, "reorder": 80},
    ],
    "Industrial": [
        {"name": "Apex-9 Optical Sensor", "sku": "APX-901-ZH", "cat": "Electronics", "price": 1199.00, "stock": 14, "reorder": 120},
        {"name": "Titan Grade Castings", "sku": "TTN-441-B", "cat": "Industrial", "price": 89.00, "stock": 142, "reorder": 200},
        {"name": "Neural Engine Core v2", "sku": "NRC-990-X", "cat": "Electronics", "price": 2450.00, "stock": 890, "reorder": 250},
        {"name": "Ceramic Capacitor 220uF", "sku": "CRC-220-A", "cat": "Electronics", "price": 0.42, "stock": 85000, "reorder": 12000},
        {"name": "Lithium Cell Mod-8", "sku": "LTM-008-K", "cat": "Power", "price": 78.00, "stock": 38, "reorder": 150},
        {"name": "Flex-Cable Assembly", "sku": "FCA-220-G", "cat": "Electronics", "price": 14.00, "stock": 2400, "reorder": 800},
        {"name": "Solar-X Panel 400W", "sku": "SLX-400-P", "cat": "Energy", "price": 489.00, "stock": 64, "reorder": 100},
        {"name": "Quantum Processor X2", "sku": "QPX-002-R", "cat": "Electronics", "price": 3299.00, "stock": 1240, "reorder": 300},
        {"name": "Carbon Fiber Sheet", "sku": "CFS-100-M", "cat": "Materials", "price": 320.00, "stock": 5, "reorder": 40},
        {"name": "Smart Hub Z-Wave", "sku": "SHZ-001-W", "cat": "IoT", "price": 149.00, "stock": 612, "reorder": 250},
    ]
}


def generate_custom_products(industry_name):
    """Generates custom products dynamically for any industry field (e.g. Flowers, Pets, Clothing)."""
    title_name = str(industry_name).strip().title()
    
    # Custom items mapping for Flowers
    if title_name.lower() in ["flowers", "flower", "florist"]:
        prefixes = ["Red Roses", "White Lilies", "Yellow Tulips", "Pink Orchids", "Blue Hydrangeas", "Mixed Carnations", "Sunflowers Bouquet", "Daisy Bunch", "Lavender Pot", "Premium Peonies"]
        categories = ["Fresh Cut", "Fresh Cut", "Fresh Cut", "Potted Plants", "Fresh Cut", "Fresh Cut", "Floral Design", "Fresh Cut", "Potted Plants", "Floral Design"]
        price_ranges = [(25.00, 45.00), (30.00, 60.00), (20.00, 40.00), (35.00, 80.00), (40.00, 75.00), (18.00, 35.00), (50.00, 120.00), (15.00, 30.00), (12.00, 28.00), (60.00, 150.00)]
        stocks = [15, 38, 5, 24, 18, 50, 8, 45, 60, 3]
        reorders = [40, 30, 20, 20, 25, 60, 10, 50, 40, 8]
        
        products = []
        for i in range(len(prefixes)):
            sku = f"FLW-{i+1:02d}-{prefixes[i][:3].upper()}"
            products.append({
                "name": prefixes[i],
                "sku": sku,
                "cat": categories[i],
                "price": round(random.uniform(*price_ranges[i]), 2),
                "stock": stocks[i],
                "reorder": reorders[i]
            })
        return products

    # General fallback for any other industry
    types = ["Premium", "Standard", "Deluxe", "Pro-Series", "Organic", "Eco-Friendly", "Legacy Edition", "Smart", "Compact", "High-Capacity"]
    categories = ["Equipment", "Supplies", "Consumables", "Accessories", "Systems"]
    
    products = []
    for i in range(10):
        item_type = types[i]
        cat = categories[i % len(categories)]
        name = f"{item_type} {title_name} Item"
        sku = f"{title_name[:3].upper()}-{i+1:02d}-{item_type[:3].upper()}"
        price = round(random.uniform(10.00, 999.00), 2)
        stock = random.choice([12, 145, 890, 5, 45, 612, 2400, 64, 1240, 38])
        reorder = random.choice([20, 50, 100, 150, 250, 500])
        
        products.append({
            "name": name,
            "sku": sku,
            "cat": cat,
            "price": price,
            "stock": stock,
            "reorder": reorder
        })
    return products


def seed_for_industry(industry_name):
    """Wipes the database and dynamic seeds all operational records for the target industry."""
    # 1. Clear database
    Sales.objects.all().delete()
    Inventory.objects.all().delete()
    CompetitorData.objects.all().delete()
    AIRecommendation.objects.all().delete()
    Alert.objects.all().delete()
    Product.objects.all().delete()
    Supplier.objects.all().delete()

    # 2. Seed Suppliers
    suppliers_data = [
        {"name": f"{industry_name} Global Ltd", "email": "info@global-ops.io", "phone": "+65 8294 1021", "lead": 4, "rel": 96.00},
        {"name": f"Iron Bridge {industry_name}", "email": "ops@ironbridge.de", "phone": "+49 30 9410 829", "lead": 9, "rel": 88.00},
        {"name": f"Quantum {industry_name} Supply", "email": "shipping@quantum.tw", "phone": "+886 2 2910 4910", "lead": 6, "rel": 99.00},
        {"name": f"VoltCore {industry_name}", "email": "sales@voltcore.cn", "phone": "+86 21 8291 0291", "lead": 14, "rel": 74.00},
    ]
    
    suppliers_map = {}
    for s in suppliers_data:
        supplier = Supplier.objects.create(
            supplier_name=s["name"],
            email=s["email"],
            phone=s["phone"],
            lead_time_days=s["lead"],
            reliability_score=Decimal(str(s["rel"])),
        )
        suppliers_map[s["name"]] = supplier

    # 3. Fetch Products List
    normalized_name = str(industry_name).strip().title()
    products_list = INDUSTRY_TEMPLATES.get(normalized_name)
    if not products_list:
        products_list = generate_custom_products(normalized_name)

    # 4. Save Products and Inventory
    products_map = {}
    for p in products_list:
        stock = p["stock"]
        reorder = p["reorder"]
        status = "healthy"
        if stock == 0 or stock <= reorder * 0.2:
            status = "critical"
        elif stock <= reorder:
            status = "low"
        elif stock >= reorder * 4:
            status = "overstocked"

        # Match supplier name or pick one
        supplier_name = list(suppliers_map.keys())[random.randint(0, len(suppliers_map)-1)]

        product = Product.objects.create(
            product_name=p["name"],
            sku=p["sku"],
            category=p["cat"],
            unit_price=Decimal(str(p["price"])),
            reorder_point=reorder,
            safety_stock=int(reorder * 0.25),
            expiry_date=timezone.now().date() + timedelta(days=random.randint(180, 540)),
            status=status,
            supplier=supplier_name,
        )
        products_map[p["name"]] = product

        # Seed Inventory link
        Inventory.objects.create(
            product=product,
            quantity_available=stock,
            warehouse_location="Warehouse Alpha" if random.random() > 0.4 else "Warehouse Beta",
        )

    # 5. Generate Competitor Benchmark Observations
    competitors = [
        f"{normalized_name}Direct",
        f"Bio{normalized_name} Solutions",
        f"{normalized_name} Pro",
        f"Apex {normalized_name}"
    ]
    
    for p_name, product in products_map.items():
        base_price = float(product.unit_price)
        for comp in competitors:
            variance = random.uniform(-0.05, 0.05)
            comp_price = round(base_price * (1 + variance), 2)
            CompetitorData.objects.create(
                product=product,
                competitor_name=comp,
                price=Decimal(str(comp_price)),
                availability="In Stock" if random.random() > 0.15 else "Out of Stock",
            )

    # 6. Seed Daily Sales History (90 days for ML forecast training)
    now = timezone.now()
    sales_records = []
    for day_idx in range(90):
        target_date = now - timedelta(days=day_idx)
        for p_name, product in products_map.items():
            price = float(product.unit_price)
            if price > 1000:
                base_sales = random.randint(1, 4)
            elif price > 100:
                base_sales = random.randint(3, 10)
            elif price > 10:
                base_sales = random.randint(10, 30)
            else:
                base_sales = random.randint(30, 80)

            weekday_factor = 1.2 if target_date.weekday() < 5 else 0.8
            sales_qty = int(base_sales * weekday_factor * random.uniform(0.8, 1.2))

            sales_records.append(
                Sales(
                    product=product,
                    quantity_sold=max(1, sales_qty),
                    selling_price=product.unit_price,
                    transaction_date=target_date,
                )
            )

    Sales.objects.bulk_create(sales_records)

    # 7. Seed Initial Alerts
    low_product = Product.objects.filter(status="critical").first() or Product.objects.filter(status="low").first()
    if low_product:
        Alert.objects.create(
            alert_type="Inventory",
            severity="critical",
            message=f"Critical depletion alert: {low_product.product_name} stock is at low level. Forecast warns potential stock-out.",
            category="Inventory",
            resolved=False,
            time_label="Just now",
        )
    else:
        Alert.objects.create(
            alert_type="System",
            severity="low",
            message=f"Autonomous system initialized telemetry for {normalized_name} operations.",
            category="System",
            resolved=False,
            time_label="Just now",
        )
