from django.urls import path

from .views import PeriodoView, MapPeriodoCategoriaView, MapPeriodoCategoriaView2

urlpatterns = [
    path("", PeriodoView.as_view(), name="periodo"),
    path("<int:periodo_id>", PeriodoView.as_view(), name="periodo"),
    path("map/", MapPeriodoCategoriaView.as_view(), name="mapeo"),
    path("map/<int:mapeo_id>", MapPeriodoCategoriaView.as_view(), name="mapeo"),
    path("map/filter/", MapPeriodoCategoriaView2.as_view(), name="mapeo-filter"),
    ]
