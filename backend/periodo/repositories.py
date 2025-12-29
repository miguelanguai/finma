import datetime
import logging

from .models import MapPeriodoCategoria, Periodo

logger = logging.getLogger(__name__)


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
            logger.error(error)
            return None

    def find_periodo_by_datetime(self, periodo_datetime: datetime) -> Periodo | None:
        """Encuentra un periodo pasando su fecha

        Args:
            periodo_datetime (datetime): fecha del periodo

        Returns:
            Periodo | None: Periodo si existe
        """
        try:
            return Periodo.objects.filter(fecha=periodo_datetime)[0]
        except Periodo.DoesNotExist as error:
            logger.error(error)
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
            logger.error(error)
            return None

    def find_by_filter(self, instance_filter: dict) -> list[Periodo]:
        """_summary_

        Args:
            filter (dict): _description_

        Returns:
            list[Periodo]: _description_
        """
        filters = {}
        if instance_filter["porc_ideal_fijo"]:
            filters["porc_ideal_fijo"]=instance_filter["porc_ideal_fijo"]
        if instance_filter["porc_ideal_estimado"]:
            filters["porc_ideal_estimado"]=instance_filter["porc_ideal_estimado"]
        if instance_filter["porc_ideal_obtenido"]:
            filters["porc_ideal_obtenido"]=instance_filter["porc_ideal_obtenido"]
        if instance_filter["categoria"]:
            filters["categoria"]=instance_filter["categoria"]
        if instance_filter["periodo"]:
            filters["periodo"]=instance_filter["periodo"]
        try:
            return MapPeriodoCategoria.objects.filter(**filters)
        except MapPeriodoCategoria.DoesNotExist as error:
            logger.error(error)
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
