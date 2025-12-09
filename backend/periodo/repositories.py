from .models import MapPeriodoCategoria, Periodo


class PeriodoRepository:
    """Reporitorio de Periodo"""

    def __init__(self):
        pass

    def find_all(self) -> list[Periodo]:
        """Retorna todos los periodos existentes

        Returns:
            list[Periodo]: todos los periodos existente
        """
        return Periodo.objects.all()

    def find_by_id(self, periodo_id: int) -> Periodo | None:
        """Retorna un periodo cuya id ha sido pasada por parámetro

        Args:
            periodo_id (int): id del periodo

        Returns:
            Periodo | None : periodo si existe
        """
        try:
            return Periodo.objects.get(pk=periodo_id)
        except Periodo.DoesNotExist as error:
            print(error)
            return None

    def save(self, periodo: Periodo) -> Periodo:
        """Guarda un periodo

        Args:
            periodo (Periodo): periodo a guardar

        Returns:
            Periodo: periodo guardado
        """
        periodo.save()
        return periodo

    def delete(self, periodo_to_delete: Periodo) -> Periodo:
        """Elimina un periodo

        Args:
            periodo_id (Periodo): periodo a eliminar

        Returns:
            Periodo: periodo eliminado
        """
        periodo_to_delete.delete()
        return periodo_to_delete


class MapPeriodoCategoriaRepository:
    """Reporitorio de MapPeriodoCategoria"""

    def __init__(self):
        pass

    def find_all(self) -> list[MapPeriodoCategoria]:
        """Retorna todos los mapeos existentes

        Returns:
            list[MapPeriodoCategoria]: todos los mapeos existente
        """
        return MapPeriodoCategoria.objects.all()

    def find_by_id(self, mapeo_id: int) -> MapPeriodoCategoria | None:
        """Retorna un mapeo cuya id ha sido pasada por parámetro

        Args:
            mapeo_id (int): id del mapeo

        Returns:
            MapPeriodoCategoria | None : mapeo si existe
        """
        try:
            return MapPeriodoCategoria.objects.get(pk=mapeo_id)
        except MapPeriodoCategoria.DoesNotExist as error:
            print(error)
            return None

    def save(self, mapeo: MapPeriodoCategoria) -> MapPeriodoCategoria:
        """Guarda un mapeo

        Args:
            mapeo (MapPeriodoCategoria): mapeo a guardar

        Returns:
            Periodo: mapeo guardado
        """
        mapeo.save()
        return mapeo

    def delete(self, mapeo_to_delete: MapPeriodoCategoria) -> MapPeriodoCategoria:
        """Elimina un mapeo

        Args:
            periodo_id (MapPeriodoCategoria): mapeo a eliminar

        Returns:
            MapPeriodoCategoria: mapeo eliminado
        """
        mapeo_to_delete.delete()
        return mapeo_to_delete
