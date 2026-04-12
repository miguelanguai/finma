import datetime

from .models import MapPeriodoCategoria, Periodo
from .repositories import MapPeriodoCategoriaRepository, PeriodoRepository

# from ..movimiento.services import MovimientoService # TODO: esto es lo que va mal. Importacion circular. Resolver


class PeriodoService:

    def __init__(self):
        self.repo = PeriodoRepository()

    def find_all(self) -> list[Periodo]:
        """Retorna todos los periodos existentes.
        Llama a PeriodoRepository.find_all

        Returns:
            list[Periodo]: lista con todos los periodos
        """
        return self.repo.find_all()

    def find_by_id(self, periodo_id: int) -> Periodo | None:
        """Retorna un periodo cuya id se ha pasado como parámetro
        Llama a PeriodoRepository.find_by_id

        Args:
            periodo_id (int): id del Periodo

        Returns:
            Periodo | None: periodo si existe
        """
        return self.repo.find_by_id(periodo_id=periodo_id)

    def find_periodo_by_datetime(self, periodo_datetime: datetime) -> Periodo | None:
        """Encuentra un periodo pasando su fecha

        Llama a repo.find_periodo_by_datetime

        Args:
            periodo_datetime (datetime): fecha del periodo

        Returns:
            Periodo | None: Periodo si existe
        """
        return self.repo.find_periodo_by_datetime(periodo_datetime=periodo_datetime)

    def save(self, periodo: dict) -> Periodo:
        """Guarda un periodo y lo retorna

        Args:
            periodo (dict): periodo a guardar

        Returns:
            Periodo: periodo guardado
        """
        periodo_to_save = Periodo(
            nombre=periodo["nombre"],
            fecha=periodo["fecha"],
            ingreso_fijo=periodo["ingreso_fijo"],
            ingreso_estimado=periodo["ingreso_estimado"],
        )
        return self.repo.save(periodo=periodo_to_save)

    def update(self, updated_period: dict, periodo_to_update_id: int) -> Periodo:
        """Actualiza un periodo y lo retorna

        Args:
            updated_period (dict): diccionario con los nuevos valores de la entidad
            periodo_to_update_id (int): id de la entidad a actualizar

        Raises:
            Periodo.DoesNotExist: la entidad no existe en la bd

        Returns:
            Periodo: entidad actualizada
        """
        periodo_to_update = self.find_by_id(periodo_to_update_id)
        if periodo_to_update:
            periodo_to_update.nombre = updated_period["nombre"]
            periodo_to_update.fecha = updated_period["fecha"]
            periodo_to_update.ingreso_fijo = updated_period["ingreso_fijo"]
            periodo_to_update.ingreso_estimado = updated_period["ingreso_estimado"]
            periodo = self.repo.save(periodo=periodo_to_update)
            return periodo
        raise Periodo.DoesNotExist

    def delete(self, periodo_to_delete_id: int) -> Periodo:
        """Elimina un periodo y lo retorna

        Args:
            periodo_to_delete_id (int): id del periodo a eliminar

        Returns:
            Periodo: periodo eliminado
        """
        periodo_to_delete = self.find_by_id(periodo_id=periodo_to_delete_id)
        return self.repo.delete(periodo_to_delete=periodo_to_delete)


class MapPeriodoCategoriaService:
    def __init__(self):
        from movimiento.services import MovimientoService

        self.repo = MapPeriodoCategoriaRepository()
        self.movimiento_service = MovimientoService()

    def find_all(self) -> list[MapPeriodoCategoria]:
        """Retorna todos los mapeos existentes.
        Llama a MapPeriodoCategoriaRepository.find_all

        Returns:
            list[MapPeriodoCategoria]: lista con todos los mapeos
        """
        return self.repo.find_all()

    def find_by_id(self, mapeo_id: int) -> MapPeriodoCategoria | None:
        """Retorna un mapeo cuya id se ha pasado como parámetro
        Llama a MapPeriodoCategoriaRepository.find_by_id

        Args:
            mapeo_id (int): id del MapPeriodoCategoria

        Returns:
            MapPeriodoCategoria | None: mapeo si existe
        """
        return self.repo.find_by_id(mapeo_id=mapeo_id)

    def find_by_filter(self, instance_filter: dict) -> list[Periodo]:
        """_summary_

        Args:
            filter (dict): _description_

        Returns:
            list[Periodo]: _description_
        """
        return self.repo.find_by_filter(instance_filter=instance_filter)

    def get_sum_by_map(self, mapeo_id: int) -> int:
        """Recoge todos los movimientos que pertenecen a un periodo y a una categoria, y suma sus cantidades

        Args:
            mapeo_id (int): _description_

        Returns:
            int: _description_
        """
        mapeo = self.find_by_id(mapeo_id=mapeo_id)
        movimiento_list = self.movimiento_service.find_all_by_periodo_and_category(
            periodo_id=mapeo.periodo.id, category_id=mapeo.categoria.id
        )
        map_sum = 0
        for mov in movimiento_list:
            map_sum += mov.monto

        return map_sum

    def save(self, mapeo: dict) -> MapPeriodoCategoria:
        """Guarda un mapeo y lo retorna

        Args:
            mapeo (dict): mapeo a guardar

        Returns:
            MapPeriodoCategoria: mapeo guardado
        """
        mapeo_to_save = MapPeriodoCategoria(
            porc_ideal_fijo=mapeo["porc_ideal_fijo"],
            porc_ideal_estimado=mapeo["porc_ideal_estimado"],
            porc_ideal_obtenido=mapeo["porc_ideal_obtenido"],
            periodo=mapeo["periodo"],
            categoria=mapeo["categoria"],
        )
        return self.repo.save(mapeo=mapeo_to_save)

    def update(
        self, updated_mapeo: dict, mapeo_to_update_id: int
    ) -> MapPeriodoCategoria:
        """Actualiza un mapeo y lo retorna

        Args:
            updated_mapeo (dict): diccionario con los nuevos valores de la entidad
            mapeo_to_update_id (int): id de la entidad a actualizar

        Raises:
            MapPeriodoCategoria.DoesNotExist: la entidad no existe en la bd

        Returns:
            MapPeriodoCategoria: entidad actualizada
        """
        mapeo_to_update = self.find_by_id(mapeo_to_update_id)
        if mapeo_to_update:
            mapeo_to_update.porc_ideal_fijo = updated_mapeo["porc_ideal_fijo"]
            mapeo_to_update.porc_ideal_estimado = updated_mapeo["porc_ideal_estimado"]
            mapeo_to_update.porc_ideal_obtenido = updated_mapeo["porc_ideal_obtenido"]
            mapeo_to_update.periodo = updated_mapeo["periodo"]
            mapeo_to_update.categoria = updated_mapeo["categoria"]
            mapeo = self.repo.save(mapeo=mapeo_to_update)
            return mapeo
        raise MapPeriodoCategoria.DoesNotExist

    def delete(self, mapeo_to_delete_id: int) -> MapPeriodoCategoria | None:
        """Elimina un mapeo y lo retorna si existe

        Args:
            mapeo_to_delete_id (int): id del mapeo a eliminar

        Returns:
            MapPeriodoCategoria | None: mapeo eliminado. Si el mapeo no se ha encontrado, se
            retorna None
        """
        mapeo_to_delete = self.find_by_id(mapeo_id=mapeo_to_delete_id)
        if mapeo_to_delete:
            return self.repo.delete(mapeo_to_delete=mapeo_to_delete)
        return None
