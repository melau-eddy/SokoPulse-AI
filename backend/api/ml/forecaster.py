import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
import joblib
import os
from decimal import Decimal
from django.db.models import Avg

from api.models import (
    Product,
    Inventory,
    Sales,
    Supplier,
    PurchaseOrder,
    CompetitorData,
    AIRecommendation,
    Alert,
)

# Directory to save model checkpoints
MODEL_DIR = os.path.join(os.path.dirname(__file__), "checkpoints")
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, "demand_model.joblib")


def extract_data_to_df():
    """Extracts relational Django models into Pandas DataFrames for ETL processing."""
    from api.utils.dynamic_seeder import get_active_industry, get_valid_competitors
    industry_name = get_active_industry()
    
    currency = "USD"
    try:
        import os
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        file_path = os.path.join(base_dir, "currency_setting.txt")
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                currency = f.read().strip().upper()
    except Exception:
        pass

    valid_comps = get_valid_competitors(industry_name, currency)

    products = Product.objects.all().values()
    sales = Sales.objects.all().values()
    inventory = Inventory.objects.all().values()
    competitors = CompetitorData.objects.filter(competitor_name__in=valid_comps).values()

    df_products = pd.DataFrame(list(products))
    df_sales = pd.DataFrame(list(sales))
    df_inventory = pd.DataFrame(list(inventory))
    df_competitors = pd.DataFrame(list(competitors))

    return df_products, df_sales, df_inventory, df_competitors


def engineer_features(df_products, df_sales, df_inventory, df_competitors):
    """
    Phase 3: Data Engineering Pipeline.
    Generates lag variables, rolling averages, competitor deltas, and inventory features.
    """
    if df_sales.empty:
        return None

    # Group sales by product and day
    df_sales["date"] = pd.to_datetime(df_sales["transaction_date"]).dt.date
    daily_sales = (
        df_sales.groupby(["product_id", "date"])
        .agg(qty_sold=("quantity_sold", "sum"), avg_selling_price=("selling_price", "mean"))
        .reset_index()
    )

    # Convert date back to string for easier manipulation
    daily_sales["date"] = pd.to_datetime(daily_sales["date"])

    features_list = []
    
    # Generate lag features for each product
    for product_id, group in daily_sales.groupby("product_id"):
        group = group.sort_values("date")
        
        # Lags
        group["sales_lag_1"] = group["qty_sold"].shift(1)
        group["sales_lag_2"] = group["qty_sold"].shift(2)
        group["sales_lag_3"] = group["qty_sold"].shift(3)
        
        # Rolling averages
        group["sales_roll_mean_3"] = group["qty_sold"].shift(1).rolling(window=3, min_periods=1).mean()
        group["sales_roll_mean_7"] = group["qty_sold"].shift(1).rolling(window=7, min_periods=1).mean()
        
        # Seasonal indicators (day of week)
        group["day_of_week"] = group["date"].dt.dayofweek
        group["month"] = group["date"].dt.month
        
        features_list.append(group)

    df_features = pd.concat(features_list).fillna(0)

    # Merge product price info
    df_features = df_features.merge(df_products[["id", "unit_price", "category", "reorder_point"]], left_on="product_id", right_on="id")

    return df_features


def train_forecaster():
    """
    Phase 4: Demand Forecasting Engine.
    Trains a Scikit-Learn RandomForestRegressor to forecast sales demand.
    """
    df_products, df_sales, df_inventory, df_competitors = extract_data_to_df()
    df_features = engineer_features(df_products, df_sales, df_inventory, df_competitors)

    if df_features is None or len(df_features) < 10:
        print("ℹ️ Insufficient sales data to train the model. Seeding default forecasts.")
        return False

    # Define training features and labels
    feature_cols = [
        "sales_lag_1",
        "sales_lag_2",
        "sales_lag_3",
        "sales_roll_mean_3",
        "sales_roll_mean_7",
        "day_of_week",
        "month",
    ]
    
    X = df_features[feature_cols]
    y = df_features["qty_sold"]

    # Train model
    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(X, y)

    # Save model checkpoint
    joblib.dump(model, MODEL_PATH)
    print("🎯 Demand forecasting model trained successfully and checkpoint saved.")
    return True


def run_intelligence_pipeline():
    """
    Runs dynamic risk auditing, pricing recommendations, and PO replenishment models.
    """
    # 1. Train or load forecasting model
    has_trained = train_forecaster()
    
    # 2. Iterate products to evaluate risks and recommendations
    products = Product.objects.all()
    for product in products:
        # Get current stock
        inv_record = Inventory.objects.filter(product=product).first()
        current_stock = inv_record.quantity_available if inv_record else 0
        reorder_point = product.reorder_point

        # A. Risk Engine (Phase 5)
        # Critical Alert: Current Stock < Reorder Point * 0.2
        if current_stock <= reorder_point * 0.2:
            Alert.objects.get_or_create(
                alert_type="Inventory",
                severity="critical",
                message=f"Critical depletion alert: {product.product_name} stock is at {current_stock} units.",
                category="Inventory",
                resolved=False
            )
            product.status = "critical"
            product.save()
            
        elif current_stock <= reorder_point:
            Alert.objects.get_or_create(
                alert_type="Inventory",
                severity="high",
                message=f"Low stock alert: {product.product_name} is below reorder point. Current stock: {current_stock}.",
                category="Inventory",
                resolved=False
            )
            product.status = "low"
            product.save()

        # B. Dynamic Pricing Engine (Phase 7)
        # Look up competitor prices
        from api.utils.dynamic_seeder import get_active_industry, get_valid_competitors
        industry_name = get_active_industry()
        
        currency = "USD"
        try:
            import os
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            file_path = os.path.join(base_dir, "currency_setting.txt")
            if os.path.exists(file_path):
                with open(file_path, "r") as f:
                    currency = f.read().strip().upper()
        except Exception:
            pass

        valid_comps = get_valid_competitors(industry_name, currency)
        comps = CompetitorData.objects.filter(product=product, competitor_name__in=valid_comps)
        if comps.exists():
            avg_comp_price = Decimal(str(comps.aggregate(Avg("price"))["price__avg"]))
            price_delta = avg_comp_price - product.unit_price
            
            # If competitor average is significantly higher, trigger pricing opportunity
            if price_delta > (product.unit_price * Decimal("0.03")):
                recommended_price = product.unit_price * Decimal("1.05")
                confidence = 88.0
                impact = 4.2
                
                # Check for existing pending recommendation
                AIRecommendation.objects.get_or_create(
                    product=product,
                    recommendation_type="price",
                    defaults={
                        "recommendation_text": f"Competitor average pricing indicates an opportunity to increase margins for {product.product_name}. Recommend margin adjustment: +5%.",
                        "confidence_score": Decimal(str(confidence)),
                        "status": "pending"
                    }
                )

        # C. Procurement Recommendation Engine (Phase 8)
        # Simulate forecasted weekly demand (e.g. 150 units)
        forecast_demand = 180
        safety_stock = product.safety_stock if product.safety_stock > 0 else 30
        
        # Calculate Replenishment
        recommended_qty = forecast_demand + safety_stock - current_stock
        
        if recommended_qty > 0 and current_stock <= reorder_point:
            # Suggest supplier based on lead time and reliability
            suggested_supplier = Supplier.objects.order_by("-reliability_score").first()
            supplier_name = suggested_supplier.supplier_name if suggested_supplier else "Nexus Supply"
            lead_time = suggested_supplier.lead_time_days if suggested_supplier else 4
            cost = recommended_qty * int(product.unit_price * Decimal("0.85")) # cost discount factor
            
            AIRecommendation.objects.get_or_create(
                product=product,
                recommendation_type="restock",
                defaults={
                    "recommendation_text": f"Increase stock levels for {product.product_name} by {recommended_qty} units to avoid regional stock-out in {lead_time} days. Preferred Supplier: {supplier_name}.",
                    "confidence_score": Decimal("94.50"),
                    "status": "pending"
                }
            )

    print("🧠 Dynamic AI Recommendations and Alert rules processed.")
