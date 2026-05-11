from rest_framework import viewsets
from .models import FinancialReport
from .serializers import FinancialReportSerializer

class FinancialReportViewSet(viewsets.ModelViewSet):
    queryset = FinancialReport.objects.all()
    serializer_class = FinancialReportSerializer