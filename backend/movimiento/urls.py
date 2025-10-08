from django.urls import path

from .views import MovimientoView

urlpatterns = [path("", MovimientoView.as_view(), name="movimiento")]
