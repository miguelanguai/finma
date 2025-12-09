from django.urls import path

from .views import CategoriaView

urlpatterns = [
    path("", CategoriaView.as_view(), name="periodo"),
    path("<int:categoria_id>", CategoriaView.as_view(), name="periodo"),
    ]
