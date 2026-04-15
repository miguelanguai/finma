from django.urls import path

from .views import BalanceAnalisisView, CategoriasAnalisisView, ObjetivosAnalisisView

urlpatterns = [
    path("objetivos/", ObjetivosAnalisisView.as_view(), name="analisis-objetivos"),
    path("categorias/", CategoriasAnalisisView.as_view(), name="analisis-categorias"),
    path("balance/", BalanceAnalisisView.as_view(), name="analisis-balance"),
]
