from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FinancialReportViewSet

router = DefaultRouter()
router.register(r'financials', FinancialReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]