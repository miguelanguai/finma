from django.urls import path

from .views import PeriodoView

urlpatterns = [
    path("", PeriodoView.as_view(), name="periodo"),
    path("<int:periodo_id>", PeriodoView.as_view(), name="periodo"),
    ]
