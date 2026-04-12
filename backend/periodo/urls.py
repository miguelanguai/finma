from django.urls import path

from .views import (
    PeriodoView,
    MapPeriodoCategoriaView,
    MapPeriodoCategoriaView2,
    MapPeriodoCategoriaView3,
)

urlpatterns = [
    path("", PeriodoView.as_view(), name="periodo"),
    path("<int:periodo_id>", PeriodoView.as_view(), name="periodo"),
    path("map/", MapPeriodoCategoriaView.as_view(), name="mapeo"),
    path("map/<int:mapeo_id>", MapPeriodoCategoriaView.as_view(), name="mapeo"),
    path("map/filter/", MapPeriodoCategoriaView2.as_view(), name="mapeo-filter"),
    path("map/sum/<int:mapeo_id>", MapPeriodoCategoriaView3.as_view(), name="mapeo-sum"),
]
