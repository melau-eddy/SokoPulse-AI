from django.db import models


class Product(models.Model):
    STATUS_CHOICES = [
        ("healthy", "Healthy"),
        ("low", "Low Stock"),
        ("overstocked", "Overstocked"),
        ("critical", "Critical"),
    ]

    sku = models.CharField(max_length=100, unique=True)
    product_name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    reorder_point = models.IntegerField(default=0)
    expiry_date = models.DateField(null=True, blank=True)
    safety_stock = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="healthy")
    supplier = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.product_name} ({self.sku})"


class Inventory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="inventory_records")
    quantity_available = models.IntegerField(default=0)
    warehouse_location = models.CharField(max_length=100, default="Warehouse A")
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Inventory Records"

    def __str__(self):
        return f"{self.product.product_name} - Qty: {self.quantity_available}"


class Sales(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="sales_records")
    quantity_sold = models.IntegerField()
    selling_price = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_date = models.DateTimeField()

    class Meta:
        verbose_name_plural = "Sales Transactions"

    def __str__(self):
        return f"{self.product.product_name} - Sold: {self.quantity_sold} on {self.transaction_date.date()}"


class Supplier(models.Model):
    supplier_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    lead_time_days = models.IntegerField(default=7)
    reliability_score = models.DecimalField(max_digits=5, decimal_places=2, default=100.00) # e.g. 96.5%

    def __str__(self):
        return self.supplier_name


class PurchaseOrder(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("ignored", "Ignored"),
        ("in-transit", "In Transit"),
        ("delayed", "Delayed"),
        ("delivered", "Delivered"),
    ]

    po_number = models.CharField(max_length=50, unique=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name="purchase_orders")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="purchase_orders")
    qty = models.IntegerField()
    cost = models.DecimalField(max_digits=12, decimal_places=2)
    order_date = models.DateField(auto_now_add=True)
    expected_delivery = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    def __str__(self):
        return f"{self.po_number} - {self.product.product_name} ({self.status})"


class CompetitorData(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="competitor_observations")
    competitor_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    availability = models.CharField(max_length=50, default="In Stock")
    captured_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Competitor Observations"

    def __str__(self):
        return f"{self.competitor_name} - {self.product.product_name}: ${self.price}"


class AIRecommendation(models.Model):
    TYPE_CHOICES = [
        ("price", "Pricing Optimization"),
        ("restock", "Restock Replenishment"),
        ("supplier", "Supplier Diversification"),
    ]
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("overridden", "Overridden"),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True, related_name="ai_recommendations")
    recommendation_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    recommendation_text = models.TextField()
    confidence_score = models.DecimalField(max_digits=5, decimal_places=2) # e.g. 98.00%
    generated_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    
    # Pricing overrides
    override_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    override_margin = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    override_impact = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.recommendation_type} - {self.product.product_name if self.product else 'Global'} ({self.confidence_score}%)"


class Alert(models.Model):
    SEVERITY_CHOICES = [
        ("critical", "Critical"),
        ("high", "High"),
        ("medium", "Medium"),
        ("low", "Low"),
    ]

    alert_type = models.CharField(max_length=100) # e.g. "Inventory", "Pricing", "Supplier"
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default="medium")
    message = models.TextField()
    resolved = models.BooleanField(default=False)
    category = models.CharField(max_length=50, default="Inventory")
    time_label = models.CharField(max_length=50, default="Just now")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.severity.upper()}] {self.alert_type} - {self.message[:40]}"
