from django.urls import path

from .views import ObjetivoView

urlpatterns = [
    path("", ObjetivoView.as_view(), name="objetivo"),
    path("<int:objetivo_id>", ObjetivoView.as_view(), name="objetivo"),
    ]
