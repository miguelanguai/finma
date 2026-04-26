from django.urls import path

from .views import BalanceAnalisisView, CategoriasAnalisisView, ComparativaAnalisisView, ObjetivosAnalisisView, ResumenLandingView

urlpatterns = [
    path("resumen/", ResumenLandingView.as_view(), name="analisis-resumen"),
    path("objetivos/", ObjetivosAnalisisView.as_view(), name="analisis-objetivos"),
    path("categorias/", CategoriasAnalisisView.as_view(), name="analisis-categorias"),
    path("balance/", BalanceAnalisisView.as_view(), name="analisis-balance"),
    path("comparativa/", ComparativaAnalisisView.as_view(), name="analisis-comparativa"),
]
