from django.urls import path

from .views import BalanceAnalisisView, BalanceRollingView, CategoriasAnalisisView, ComparativaAnalisisView, ObjetivosAnalisisView, ResumenLandingView

urlpatterns = [
    path("resumen/", ResumenLandingView.as_view(), name="analisis-resumen"),
    path("objetivos/", ObjetivosAnalisisView.as_view(), name="analisis-objetivos"),
    path("categorias/", CategoriasAnalisisView.as_view(), name="analisis-categorias"),
    path("balance/", BalanceAnalisisView.as_view(), name="analisis-balance"),
    path("balance-rolling/", BalanceRollingView.as_view(), name="analisis-balance-rolling"),
    path("comparativa/", ComparativaAnalisisView.as_view(), name="analisis-comparativa"),
]
