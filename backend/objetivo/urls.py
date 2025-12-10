from django.urls import path

from .views import ObjetivoView, MapCategoriaObjetivoView

urlpatterns = [
    path("", ObjetivoView.as_view(), name="objetivo"),
    path("<int:objetivo_id>", ObjetivoView.as_view(), name="objetivo"),
    path("map/", MapCategoriaObjetivoView.as_view(), name="mapeo"),
    path("map/<int:mapeo_id>", MapCategoriaObjetivoView.as_view(), name="mapeo"),
]
