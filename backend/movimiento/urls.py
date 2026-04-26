from django.urls import path

from .views import ExcelView, ExportarView, MovimientoView

urlpatterns = [
    path("", MovimientoView.as_view(), name="movimiento"),
    path("exportar/", ExportarView.as_view(), name="movimiento-exportar"),
    path("<int:movimiento_id>", MovimientoView.as_view(), name="movimiento"),
    path("excel", ExcelView.as_view(), name="excel"),
]
