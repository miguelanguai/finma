import logging

from .models import MapCategoriaObjetivo, Objetivo

logger = logging.getLogger(__name__)
class ObjetivoRepository:
    def __init__(self):
        pass

    def find_all(self) -> list[Objetivo]:
        return Objetivo.objects.all()

    def find_by_id(self, objetivo_id: int) -> Objetivo | None:
        try:
            return Objetivo.objects.get(pk=objetivo_id)
        except Objetivo.DoesNotExist as error:
            logger.error(error)
            return None

    def save(self, objetivo: Objetivo) -> Objetivo:
        objetivo.save()
        return objetivo

    def delete(self, objetivo_to_delete: Objetivo) -> Objetivo:
        objetivo_to_delete.delete()
        return objetivo_to_delete


class MapCategoriaObjetivoRepository:
    def __init__(self):
        pass

    def find_all(self) -> list[MapCategoriaObjetivo]:
        return MapCategoriaObjetivo.objects.all()

    def find_by_id(self, mapeo_id: int) -> MapCategoriaObjetivo | None:
        try:
            return MapCategoriaObjetivo.objects.get(pk=mapeo_id)
        except MapCategoriaObjetivo.DoesNotExist as error:
            logger.error(error)
            return None

    def save(self, mapeo: MapCategoriaObjetivo) -> MapCategoriaObjetivo:
        mapeo.save()
        return mapeo

    def delete(self, mapeo_to_delete: MapCategoriaObjetivo) -> MapCategoriaObjetivo:
        mapeo_to_delete.delete()
        return mapeo_to_delete
