import sqlite3
import os
import random
from datetime import datetime, timedelta
from decimal import Decimal
from django.utils import timezone
from api.models import Product, Inventory, Sales, Supplier, CompetitorData, AIRecommendation, Alert
from api.ml.forecaster import run_intelligence_pipeline

def create_external_db_if_not_exists():
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "external_business.db")
    if os.path.exists(db_path):
        return db_path

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS business_inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sku TEXT UNIQUE,
        name TEXT,
        category TEXT,
        price REAL,
        stock INTEGER,
        reorder_point INTEGER,
        safety_stock INTEGER,
        supplier TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS business_sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sku TEXT,
        quantity_sold INTEGER,
        selling_price REAL,
        transaction_date TEXT
    )
    """)

    # Seed products
    items = [
        ("TAP-101-EL", "Tap Premium Sensor", "Electronics", 1250.00, 15, 100, 25, "TapGlobal Ltd"),
        ("TAP-102-EL", "Tap Engine Core v3", "Electronics", 2300.00, 950, 200, 50, "Quantum Tap Supply"),
        ("TAP-103-IN", "Tap Titanium Casting", "Industrial", 95.00, 400, 150, 40, "VoltCore Tap Ltd"),
        ("TAP-104-IN", "Tap Flex-Cable Assy", "Electronics", 15.00, 2200, 500, 125, "TapGlobal Ltd"),
        ("TAP-105-IN", "Tap Solar Panel 500W", "Energy", 520.00, 5, 80, 20, "VoltCore Tap Ltd")
    ]

    for sku, name, cat, price, stock, reorder, safety, supplier in items:
        cursor.execute("""
        INSERT OR IGNORE INTO business_inventory (sku, name, category, price, stock, reorder_point, safety_stock, supplier)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (sku, name, cat, price, stock, reorder, safety, supplier))

    # Seed sales (last 30 days)
    now = datetime.now()
    for day in range(30):
        t_date = (now - timedelta(days=day)).strftime("%Y-%m-%d %H:%M:%S")
        for sku, name, cat, price, _, _, _, _ in items:
            # Random sales
            qty = random.randint(2, 8) if price > 500 else random.randint(10, 45)
            cursor.execute("""
            INSERT INTO business_sales (sku, quantity_sold, selling_price, transaction_date)
            VALUES (?, ?, ?, ?)
            """, (sku, qty, price, t_date))

    conn.commit()
    conn.close()
    return db_path


def sync_from_sqlite(db_filepath):
    # Wipe SokoPulse database to import the new tapped business database
    Sales.objects.all().delete()
    Inventory.objects.all().delete()
    CompetitorData.objects.all().delete()
    AIRecommendation.objects.all().delete()
    Alert.objects.all().delete()
    Product.objects.all().delete()
    Supplier.objects.all().delete()

    conn = sqlite3.connect(db_filepath)
    cursor = conn.cursor()

    # Query list of tables to dynamically discover schemas
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [t[0] for t in cursor.fetchall()]

    inventory_table = "business_inventory"
    sales_table = "business_sales"

    # Smart fallback discovery for table names
    if inventory_table not in tables:
        for t in tables:
            t_lower = t.lower()
            if "inventory" in t_lower or "product" in t_lower or "item" in t_lower:
                inventory_table = t
                break
                
    if sales_table not in tables:
        for t in tables:
            t_lower = t.lower()
            if "sales" in t_lower or "transaction" in t_lower or "invoice" in t_lower or "sold" in t_lower:
                sales_table = t
                break

    if inventory_table not in tables or sales_table not in tables:
        raise ValueError(f"Could not discover compatible tables in database. Available tables: {', '.join(tables)}")

    # Smart fallback discovery for inventory columns
    cursor.execute(f"PRAGMA table_info({inventory_table})")
    cols = [c[1] for c in cursor.fetchall()]
    
    sku_col = next((c for c in cols if "sku" in c.lower() or "code" in c.lower() or "id" in c.lower()), "sku")
    name_col = next((c for c in cols if "name" in c.lower() or "title" in c.lower() or "desc" in c.lower()), "name")
    cat_col = next((c for c in cols if "cat" in c.lower() or "type" in c.lower() or "group" in c.lower()), "category")
    price_col = next((c for c in cols if "price" in c.lower() or "rate" in c.lower() or "cost" in c.lower() or "unit" in c.lower()), "price")
    stock_col = next((c for c in cols if "stock" in c.lower() or "qty" in c.lower() or "quantity" in c.lower() or "avail" in c.lower() or "count" in c.lower()), "stock")
    reorder_col = next((c for c in cols if "reorder" in c.lower() or "min" in c.lower() or "point" in c.lower()), "reorder_point")
    safety_col = next((c for c in cols if "safety" in c.lower() or "buffer" in c.lower()), "safety_stock")
    supplier_col = next((c for c in cols if "supplier" in c.lower() or "vendor" in c.lower() or "source" in c.lower()), "supplier")

    # Get inventory records
    query_inv = f"SELECT {sku_col}, {name_col}, {cat_col}, {price_col}, {stock_col}, {reorder_col}, {safety_col}, {supplier_col} FROM {inventory_table}"
    cursor.execute(query_inv)
    inventory_rows = cursor.fetchall()

    suppliers_created = {}

    for sku, name, cat, price, stock, reorder, safety, supplier_name in inventory_rows:
        if not supplier_name:
            supplier_name = "External Supplier"
            
        if supplier_name not in suppliers_created:
            supplier = Supplier.objects.create(
                supplier_name=supplier_name,
                email=f"info@{supplier_name.lower().replace(' ', '-')}.com",
                phone="+1-555-0199",
                lead_time_days=random.choice([4, 7, 10]),
                reliability_score=Decimal(str(random.randint(80, 99)))
            )
            suppliers_created[supplier_name] = supplier

        # Robust fallbacks for numeric values
        stock_val = int(stock) if stock is not None else 0
        reorder_val = int(reorder) if reorder is not None else 0
        safety_val = int(safety) if safety is not None else 0
        price_val = Decimal(str(price)) if price is not None else Decimal("0.00")

        status = "healthy"
        if stock_val == 0 or stock_val <= reorder_val * 0.2:
            status = "critical"
        elif stock_val <= reorder_val:
            status = "low"
        elif stock_val >= reorder_val * 1.5:
            status = "overstocked"

        product = Product.objects.create(
            sku=sku,
            product_name=name,
            category=cat if cat else "Uncategorized",
            unit_price=price_val,
            reorder_point=reorder_val,
            safety_stock=safety_val,
            status=status,
            supplier=supplier_name
        )

        Inventory.objects.create(
            product=product,
            quantity_available=stock_val,
            warehouse_location="Warehouse Alpha"
        )

    # Smart fallback discovery for sales columns
    cursor.execute(f"PRAGMA table_info({sales_table})")
    sales_cols = [c[1] for c in cursor.fetchall()]
    
    s_sku_col = next((c for c in sales_cols if "sku" in c.lower() or "code" in c.lower() or "product" in c.lower() or "item" in c.lower()), "sku")
    s_qty_col = next((c for c in sales_cols if "qty" in c.lower() or "quantity" in c.lower() or "sold" in c.lower() or "volume" in c.lower() or "count" in c.lower()), "quantity_sold")
    s_price_col = next((c for c in sales_cols if "price" in c.lower() or "rate" in c.lower() or "amount" in c.lower() or "selling" in c.lower()), "selling_price")
    s_date_col = next((c for c in sales_cols if "date" in c.lower() or "time" in c.lower() or "stamp" in c.lower() or "trans" in c.lower()), "transaction_date")

    # Get sales records
    query_sales = f"SELECT {s_sku_col}, {s_qty_col}, {s_price_col}, {s_date_col} FROM {sales_table}"
    cursor.execute(query_sales)
    sales_rows = cursor.fetchall()

    sales_to_create = []
    for sku, qty, price, t_date_str in sales_rows:
        product = Product.objects.filter(sku=sku).first()
        if product:
            try:
                # Parse date string
                t_date = datetime.strptime(str(t_date_str), "%Y-%m-%d %H:%M:%S")
                # Make timezone aware
                t_date = timezone.make_aware(t_date)
            except Exception:
                try:
                    t_date = datetime.strptime(str(t_date_str).split(".")[0], "%Y-%m-%d %H:%M:%S")
                    t_date = timezone.make_aware(t_date)
                except Exception:
                    t_date = timezone.now()

            qty_val = int(qty) if qty is not None else 1
            price_val = Decimal(str(price)) if price is not None else product.unit_price

            sales_to_create.append(
                Sales(
                    product=product,
                    quantity_sold=qty_val,
                    selling_price=price_val,
                    transaction_date=t_date
                )
            )

    if sales_to_create:
        Sales.objects.bulk_create(sales_to_create)

    conn.close()

    # Trigger competitor scraping first to ensure we have competitor prices for the tapped products
    from api.scrapers.crawler import scrape_competitor_prices
    scrape_competitor_prices()

    # Trigger ML forecasting and recommendations pipeline
    run_intelligence_pipeline()
    
    return len(inventory_rows), len(sales_to_create)
