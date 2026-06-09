from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import random
from decimal import Decimal

from api.models import (
    Product,
    Inventory,
    Sales,
    Supplier,
    CompetitorData,
    Alert,
    AIRecommendation,
)


class Command(BaseCommand):
    help = "Seeds the database with initial products, suppliers, competitor benchmarks, and sales history."

    def handle(self, *args, **options):
        self.stdout.write("🌱 Seeding SokoPulse AI Database...")

        # 1. Clear existing records to avoid duplicate SKUs
        self.stdout.write("Cleaning up existing database records...")
        Sales.objects.all().delete()
        Inventory.objects.all().delete()
        CompetitorData.objects.all().delete()
        AIRecommendation.objects.all().delete()
        Alert.objects.all().delete()
        Product.objects.all().delete()
        Supplier.objects.all().delete()

        # 2. Seed Suppliers
        self.stdout.write("Seeding Suppliers...")
        suppliers_data = [
            {"name": "Nexus Supply", "email": "nexus@singapore-ops.io", "phone": "+65 8294 1021", "lead": 4, "rel": 96.00},
            {"name": "Iron Bridge Co.", "email": "info@ironbridge-materials.de", "phone": "+49 30 9410 829", "lead": 9, "rel": 88.00},
            {"name": "Quantum Foundry", "email": "ops@qfoundry.tw", "phone": "+886 2 2910 4910", "lead": 6, "rel": 99.00},
            {"name": "ChipWorks Ltd", "email": "support@chipworks.co.kr", "phone": "+82 2 3456 7890", "lead": 12, "rel": 81.00},
            {"name": "VoltCore Industries", "email": "shipping@voltcore.cn", "phone": "+86 21 8291 0291", "lead": 14, "rel": 74.00},
            {"name": "SunGrid Co.", "email": "grid@sungrid.us", "phone": "+1 415 901 8291", "lead": 7, "rel": 92.00},
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

        # 3. Seed Products & Inventory
        self.stdout.write("Seeding Products and Inventory levels...")
        products_data = [
            {"name": "Apex-9 Optical Sensor", "sku": "APX-901-ZH", "cat": "Electronics", "stock": 14, "reorder": 120, "price": 1199.00, "supplier": "Nexus Supply"},
            {"name": "Titan Grade Castings", "sku": "TTN-441-B", "cat": "Industrial", "stock": 142, "reorder": 200, "price": 89.00, "supplier": "Iron Bridge Co."},
            {"name": "Neural Engine Core v2", "sku": "NRC-990-X", "cat": "Electronics", "stock": 890, "reorder": 250, "price": 2450.00, "supplier": "Quantum Foundry"},
            {"name": "Ceramic Capacitor 220uF", "sku": "CRC-220-A", "cat": "Electronics", "stock": 85000, "reorder": 12000, "price": 0.42, "supplier": "ChipWorks Ltd"},
            {"name": "Lithium Cell Mod-8", "sku": "LTM-008-K", "cat": "Power", "stock": 38, "reorder": 150, "price": 78.00, "supplier": "VoltCore Industries"},
            {"name": "Flex-Cable Assembly", "sku": "FCA-220-G", "cat": "Electronics", "stock": 2400, "reorder": 800, "price": 14.00, "supplier": "Nexus Supply"},
            {"name": "Solar-X Panel 400W", "sku": "SLX-400-P", "cat": "Energy", "stock": 64, "reorder": 100, "price": 489.00, "supplier": "SunGrid Co."},
            {"name": "Quantum Processor X2", "sku": "QPX-002-R", "cat": "Electronics", "stock": 1240, "reorder": 300, "price": 3299.00, "supplier": "Quantum Foundry"},
            {"name": "Carbon Fiber Sheet", "sku": "CFS-100-M", "cat": "Materials", "stock": 5, "reorder": 40, "price": 320.00, "supplier": "Iron Bridge Co."},
            {"name": "Smart Hub Z-Wave", "sku": "SHZ-001-W", "cat": "IoT", "stock": 612, "reorder": 250, "price": 149.00, "supplier": "Nexus Supply"},
        ]

        products_map = {}
        for p in products_data:
            # Determine health status based on stock level
            stock = p["stock"]
            reorder = p["reorder"]
            status = "healthy"
            if stock == 0 or stock <= reorder * 0.2:
                status = "critical"
            elif stock <= reorder:
                status = "low"
            elif stock >= reorder * 4:
                status = "overstocked"

            product = Product.objects.create(
                product_name=p["name"],
                sku=p["sku"],
                category=p["cat"],
                unit_price=Decimal(str(p["price"])),
                reorder_point=reorder,
                safety_stock=int(reorder * 0.25),
                expiry_date=timezone.now().date() + timedelta(days=random.randint(180, 540)),
                status=status,
                supplier=p["supplier"],
            )
            products_map[p["name"]] = product

            # Seed Inventory link
            Inventory.objects.create(
                product=product,
                quantity_available=stock,
                warehouse_location="Warehouse Alpha" if random.random() > 0.4 else "Warehouse Beta",
            )

        # 4. Seed Competitor pricing observations
        self.stdout.write("Seeding Competitor price data...")
        competitors = ["GlobalLogix", "Nexus Supply Pro", "Apex Trading Co.", "Meridian Imports"]
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

        # 5. Seed historical daily Sales Transactions (90 days for ML model training)
        self.stdout.write("Generating 90 days of daily sales history (approx 900 records)...")
        now = timezone.now()
        sales_records = []
        for day_idx in range(90):
            target_date = now - timedelta(days=day_idx)
            for p_name, product in products_map.items():
                # Base demand depends on price
                price = float(product.unit_price)
                if price > 1000:
                    base_sales = random.randint(1, 4)
                elif price > 100:
                    base_sales = random.randint(3, 10)
                else:
                    base_sales = random.randint(20, 60)

                # Day-of-week seasonality (higher sales on weekdays)
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

        # 6. Seed Alerts
        self.stdout.write("Seeding core notifications...")
        Alert.objects.create(
            alert_type="Inventory",
            severity="critical",
            message="Predicted stock-out: Apex-9 Sensors. Inventory will reach zero in approximately 4 days at current burn rate.",
            category="Inventory",
            resolved=False,
            time_label="12 min ago",
        )
        Alert.objects.create(
            alert_type="Pricing",
            severity="high",
            message="Competitor price drop detected. Meridian Imports dropped Solar-X pricing by 6.2%.",
            category="Pricing",
            resolved=False,
            time_label="1 hr ago",
        )
        Alert.objects.create(
            alert_type="Supplier",
            severity="high",
            message="Supplier delay: VoltCore. Order #PO-22183 delayed by 3 days due to customs hold.",
            category="Supplier",
            resolved=False,
            time_label="3 hr ago",
        )

        self.stdout.write(self.style.SUCCESS("🎉 Seeding complete. SokoPulse AI Database is ready!"))
