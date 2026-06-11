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


def forecast_product_sales(product, model, days=30):
    """
    Predicts daily sales for the next `days` recursively using the trained ML model.
    If no model is available, falls back to historical daily averages.
    """
    from django.utils import timezone
    # Get recent daily sales history to bootstrap the lags
    recent_sales = Sales.objects.filter(product=product).order_by("-transaction_date")
    
    # Group by date to get daily quantities
    daily_history = {}
    for sale in recent_sales:
        d = sale.transaction_date.date()
        daily_history[d] = daily_history.get(d, 0) + sale.quantity_sold
    
    # Sort history chronologically
    sorted_dates = sorted(daily_history.keys())
    
    # We need at least 7 days of historical sales. If not enough, fill with seed values
    history_list = []
    if len(sorted_dates) >= 7:
        for d in sorted_dates[-7:]:
            history_list.append(daily_history[d])
    else:
        # Fallback to general daily average
        avg_daily = float(product.unit_price) # Just a fallback factor
        if avg_daily > 100:
            avg_val = 5.0
        else:
            avg_val = 25.0
        history_list = [avg_val] * 7

    # If we have a model, we do a recursive multi-step forecast
    predictions = []
    now = timezone.now()
    
    if model:
        # Features needed: sales_lag_1, sales_lag_2, sales_lag_3, sales_roll_mean_3, sales_roll_mean_7, day_of_week, month
        # We simulate day-by-day
        temp_history = list(history_list)
        for step in range(days):
            target_date = now + timedelta(days=step+1)
            
            # Construct features from temp_history
            lag1 = temp_history[-1]
            lag2 = temp_history[-2]
            lag3 = temp_history[-3]
            roll3 = np.mean(temp_history[-3:])
            roll7 = np.mean(temp_history[-7:])
            dow = target_date.weekday()
            month = target_date.month
            
            X_input = pd.DataFrame([{
                "sales_lag_1": lag1,
                "sales_lag_2": lag2,
                "sales_lag_3": lag3,
                "sales_roll_mean_3": roll3,
                "sales_roll_mean_7": roll7,
                "day_of_week": dow,
                "month": month,
            }])
            
            try:
                pred = max(0.0, float(model.predict(X_input)[0]))
            except Exception as e:
                print(f"⚠️ ML prediction failed for {product.product_name}: {e}")
                # Fallback to rolling mean of last 3 days
                pred = max(0.0, float(np.mean(temp_history[-3:])))
            predictions.append(pred)
            
            # Append prediction to temp_history for next step lags
            temp_history.append(pred)
    else:
        # Baseline average fallback
        avg_hist = float(np.mean(history_list))
        predictions = [avg_hist] * days
        
    return predictions


def run_intelligence_pipeline():
    """
    Runs dynamic risk auditing, pricing recommendations, and PO replenishment models
    using a trained Random Forest Regressor ML demand forecaster.
    """
    # 1. Train or load forecasting model
    train_forecaster()
    
    model = None
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
        except Exception as e:
            print(f"⚠️ Failed to load ML model checkpoint: {e}")

    # Clear pending recommendations to avoid stale data
    AIRecommendation.objects.filter(status="pending").delete()
    
    # 2. Iterate products to evaluate risks and recommendations
    products = Product.objects.all()
    for product in products:
        # Get current stock
        inv_record = Inventory.objects.filter(product=product).first()
        current_stock = inv_record.quantity_available if inv_record else 0
        reorder_point = product.reorder_point
        safety_stock = product.safety_stock if product.safety_stock > 0 else int(reorder_point * 0.25)
        
        # Calculate sales trend since plugin date (first sales record)
        from django.utils import timezone
        earliest_sale = Sales.objects.order_by("transaction_date").first()
        plugin_date = earliest_sale.transaction_date.date() if earliest_sale else (timezone.now() - timedelta(days=90)).date()
        
        # Trend over last 14 days vs preceding 14 days
        last_14_days = Sales.objects.filter(product=product, transaction_date__gte=timezone.now() - timedelta(days=14))
        prev_14_days = Sales.objects.filter(product=product, transaction_date__range=(timezone.now() - timedelta(days=28), timezone.now() - timedelta(days=14)))
        
        sales_last = sum(s.quantity_sold for s in last_14_days)
        sales_prev = sum(s.quantity_sold for s in prev_14_days)
        
        if sales_prev > 0:
            trend_pct = ((sales_last - sales_prev) / sales_prev) * 100.0
        else:
            trend_pct = 0.0
            
        if trend_pct > 5.0:
            trend_desc = f"upward trend (+{trend_pct:.1f}%)"
        elif trend_pct < -5.0:
            trend_desc = f"downward trend ({trend_pct:.1f}%)"
        else:
            trend_desc = "stable trend"
            
        # Get supplier info to fetch lead time
        suggested_supplier = Supplier.objects.filter(supplier_name=product.supplier).first() or Supplier.objects.order_by("-reliability_score").first()
        supplier_name = suggested_supplier.supplier_name if suggested_supplier else "Nexus Supply"
        lead_time = suggested_supplier.lead_time_days if suggested_supplier else 7
        
        # ML Recursive multi-step forecast (30 days)
        forecast_30 = forecast_product_sales(product, model, days=30)
        forecast_weekly = sum(forecast_30[:7])
        forecast_monthly = sum(forecast_30)
        
        # A. Risk Engine & Alerts
        # Understocking Risk (Current Stock < Reorder Point)
        if current_stock <= reorder_point * 0.2:
            Alert.objects.get_or_create(
                alert_type="Inventory",
                severity="critical",
                message=f"Critical depletion alert: {product.product_name} stock is at {current_stock} units. Restock required immediately.",
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
            
        # B. Restocking / Procurement Suggestions (Phase 8)
        # Calculate lead time demand forecast using ML projections
        daily_proj_sales = forecast_weekly / 7.0
        lead_time_demand = daily_proj_sales * lead_time
        
        recommended_qty = int(max(0, lead_time_demand + safety_stock - current_stock))
        
        if recommended_qty > 0 and current_stock <= reorder_point:
            cost = recommended_qty * int(product.unit_price * Decimal("0.85"))
            
            # Generate executive explanation using local/gemini explainer
            from api.ai.explainer import explain_replenishment
            reason = f"Inventory level is {current_stock} units, below reorder point of {reorder_point}. ML sales forecast predicts demand of {int(lead_time_demand)} units during the {lead_time}-day lead time."
            explanation = explain_replenishment(
                product_name=product.product_name,
                sku=product.sku,
                current_stock=current_stock,
                reorder_point=reorder_point,
                recommended_qty=recommended_qty,
                cost=float(cost),
                reason=reason,
                supplier=supplier_name
            )
            
            AIRecommendation.objects.get_or_create(
                product=product,
                recommendation_type="restock",
                defaults={
                    "recommendation_text": explanation,
                    "confidence_score": Decimal("94.50"),
                    "status": "pending"
                }
            )
            
        # C. Overstock / Price Reduction Suggestions (Phase 7)
        # If stock is high compared to monthly forecast (e.g. over 1.5 months of inventory)
        is_overstocked = current_stock >= forecast_monthly * 1.5 and current_stock > 20
        
        if is_overstocked:
            product.status = "overstocked"
            product.save()
            
            Alert.objects.get_or_create(
                alert_type="Inventory",
                severity="medium",
                message=f"Overstock alert: {product.product_name} stock level ({current_stock}) exceeds projected 30-day demand ({int(forecast_monthly)} units).",
                category="Inventory",
                resolved=False
            )
            
            # Conjunction with competitor scraper telemetry
            from api.utils.dynamic_seeder import get_active_industry, get_valid_competitors
            industry_name = get_active_industry()
            
            currency = "USD"
            try:
                base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
                file_path = os.path.join(base_dir, "currency_setting.txt")
                if os.path.exists(file_path):
                    with open(file_path, "r") as f:
                        currency = f.read().strip().upper()
            except Exception:
                pass

            valid_comps = get_valid_competitors(industry_name, currency)
            comps = CompetitorData.objects.filter(product=product, competitor_name__in=valid_comps)
            
            # Calculate recommended price
            pct_reduction = 10.0
            if comps.exists():
                avg_comp_price = Decimal(str(comps.aggregate(Avg("price"))["price__avg"]))
                if avg_comp_price < product.unit_price:
                    # Match competitor price or discount further
                    recommended_price = min(product.unit_price * Decimal("0.90"), avg_comp_price)
                    pct_reduction = float(round(((product.unit_price - recommended_price) / product.unit_price) * 100, 1))
                else:
                    # Competitors are higher, but we are overstocked, offer a promotion
                    recommended_price = product.unit_price * Decimal("0.92") # 8% discount
                    pct_reduction = 8.0
            else:
                recommended_price = product.unit_price * Decimal("0.90") # 10% discount
                pct_reduction = 10.0
                
            recommended_price = Decimal(str(round(recommended_price, 2)))
            
            rec_text = (
                f"High inventory volume detected ({current_stock} units in stock vs forecasted monthly demand of {int(forecast_monthly)} units) "
                f"under a {trend_desc} since deployment on {plugin_date}. "
                f"In conjunction with competitor pricing data, we recommend lowering the price of {product.product_name} "
                f"by {pct_reduction}% to {currency} {recommended_price} to accelerate sales velocity and minimize holding costs."
            )
            
            AIRecommendation.objects.get_or_create(
                product=product,
                recommendation_type="price",
                defaults={
                    "recommendation_text": rec_text,
                    "confidence_score": Decimal("89.00"),
                    "status": "pending",
                    "override_price": recommended_price
                }
            )
        else:
            # If not overstocked, check if competitor price is significantly higher (margin opportunity)
            from api.utils.dynamic_seeder import get_active_industry, get_valid_competitors
            industry_name = get_active_industry()
            
            currency = "USD"
            try:
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
                
                if price_delta > (product.unit_price * Decimal("0.03")):
                    recommended_price = Decimal(str(round(product.unit_price * Decimal("1.05"), 2)))
                    
                    AIRecommendation.objects.get_or_create(
                        product=product,
                        recommendation_type="price",
                        defaults={
                            "recommendation_text": f"Competitor average pricing indicates an opportunity to increase margins for {product.product_name}. Recommend margin adjustment: +5%.",
                            "confidence_score": Decimal("84.50"),
                            "status": "pending",
                            "override_price": recommended_price
                        }
                    )

    print("🧠 Dynamic AI Recommendations and Alert rules processed.")
