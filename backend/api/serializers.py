from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Product,
    Inventory,
    Sales,
    Supplier,
    PurchaseOrder,
    CompetitorData,
    AIRecommendation,
    Alert,
)


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        return user


class ProductSerializer(serializers.ModelSerializer):
    stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_stock(self, obj):
        inv = obj.inventory_records.first()
        return inv.quantity_available if inv else 0


class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.product_name", read_only=True)
    sku = serializers.CharField(source="product.sku", read_only=True)

    class Meta:
        model = Inventory
        fields = "__all__"


class SalesSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.product_name", read_only=True)

    class Meta:
        model = Sales
        fields = "__all__"


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = "__all__"


class PurchaseOrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.product_name", read_only=True)
    supplier_name = serializers.CharField(source="supplier.supplier_name", read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = "__all__"


class CompetitorDataSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.product_name", read_only=True)

    class Meta:
        model = CompetitorData
        fields = "__all__"


class AIRecommendationSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.product_name", read_only=True)
    current_price = serializers.DecimalField(source="product.unit_price", read_only=True, max_digits=12, decimal_places=2)

    class Meta:
        model = AIRecommendation
        fields = "__all__"


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = "__all__"
