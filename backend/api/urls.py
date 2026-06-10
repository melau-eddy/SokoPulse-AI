from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    RegisterView,
    ProductViewSet,
    InventoryViewSet,
    SalesViewSet,
    SupplierViewSet,
    PurchaseOrderViewSet,
    CompetitorDataViewSet,
    AIRecommendationViewSet,
    AlertViewSet,
    DashboardKpisView,
    CompetitorsView,
    ForecastingView,
    PricingView,
    ProcurementView,
    SettingsIndustryView,
)

router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="product")
router.register(r"inventory", InventoryViewSet, basename="inventory")
router.register(r"sales", SalesViewSet, basename="sales")
router.register(r"suppliers", SupplierViewSet, basename="supplier")
router.register(r"purchase-orders", PurchaseOrderViewSet, basename="purchase-order")
router.register(r"competitors", CompetitorDataViewSet, basename="competitor")
router.register(r"recommendations", AIRecommendationViewSet, basename="recommendation")
router.register(r"alerts", AlertViewSet, basename="alert")

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("dashboard/kpis/", DashboardKpisView.as_view(), name="dashboard-kpis"),
    path("forecasting/", ForecastingView.as_view(), name="forecasting"),
    path("pricing/", PricingView.as_view(), name="pricing"),
    path("procurement/", ProcurementView.as_view(), name="procurement"),
    path("competitors/", CompetitorsView.as_view(), name="competitors"),
    path("settings/industry/", SettingsIndustryView.as_view(), name="settings-industry"),
    path("", include(router.urls)),
]
