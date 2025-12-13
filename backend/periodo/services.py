import datetime

from .models import MapPeriodoCategoria, Periodo
from .repositories import MapPeriodoCategoriaRepository, PeriodoRepository


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
        self.repo = MapPeriodoCategoriaRepository()

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

    def save(self, mapeo: dict) -> MapPeriodoCategoria:
        """Guarda un mapeo y lo retorna

        Args:
            mapeo (dict): mapeo a guardar

        Returns:
            MapPeriodoCategoria: mapeo guardado
        """
        print(mapeo["categoria"])
        mapeo_to_save = MapPeriodoCategoria(
            porc_ideal_fijo=mapeo["porc_ideal_fijo"],
            porc_ideal_estimado=mapeo["porc_ideal_estimado"],
            porc_ideal_obtenido=mapeo["porc_ideal_obtenido"],
            periodo=mapeo["periodo"],
            categoria=mapeo["categoria"],
        )
        print(mapeo_to_save)
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
