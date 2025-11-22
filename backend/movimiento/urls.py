from django.urls import path

from .views import MovimientoView

urlpatterns = [
    path("", MovimientoView.as_view(), name="movimiento"),
    path("<int:movimiento_id>", MovimientoView.as_view(), name="movimiento"),
    ]
