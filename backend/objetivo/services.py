from .models import MapCategoriaObjetivo, Objetivo
from .repositories import MapCategoriaObjetivoRepository, ObjetivoRepository


class ObjetivoService:
    def __init__(self):
        self.repo = ObjetivoRepository()

    def find_all(self) -> list[Objetivo]:
        """Retorna todos los objetivos existentes
        Llama a ObjetivoRepository.find_all

        Returns:
            list[Objetivo]: lista con todos los objetivos
        """
        return self.repo.find_all()

    def find_by_id(self, objetivo_id: int) -> Objetivo | None:
        """Retorna un objetivo cuya id se ha pasado como parámetro
        Llama a ObjetivoRepository.find_by_id

        Args:
            objetivo_id (int): id del Objetivo

        Returns:
            Objetivo | None: objetivo si existe
        """
        return self.repo.find_by_id(objetivo_id=objetivo_id)

    def save(self, objetivo: dict) -> Objetivo:
        """Guarda un objetivo y lo retorna

        Args:
            objetivo (dict): objetivo a guardar

        Returns:
            Objetivo: objetivo guardado
        """
        objetivo_to_save = Objetivo(
            nombre=objetivo["nombre"],
            monto=objetivo["monto"],
            prioridad=objetivo["prioridad"],
            fecha=objetivo["fecha"],
        )
        return self.repo.save(objetivo=objetivo_to_save)

    def update(self, updated_objetivo: dict, objetivo_to_update_id: int) -> Objetivo:
        """Actualiza un objetivo y lo retorna

        Args:
            updated_objetivo (dict): diccionario con los nuevos valores de la entidad
            objetivo_to_update_id (int): id de la entidad a actualizar

        Raises:
            Objetivo.DoesNotExist: la entidad no existe en la bd

        Returns:
            Objetivo: entidad actualizada
        """
        objetivo_to_update = self.find_by_id(objetivo_id=objetivo_to_update_id)
        if objetivo_to_update:
            objetivo_to_update.nombre = updated_objetivo["nombre"]
            objetivo_to_update.monto = updated_objetivo["monto"]
            objetivo_to_update.prioridad = updated_objetivo["prioridad"]
            objetivo_to_update.fecha = updated_objetivo["fecha"]
            objetivo = self.repo.save(objetivo=objetivo_to_update)
            return objetivo
        raise Objetivo.DoesNotExist

    def delete(self, objetivo_to_delete_id: int) -> Objetivo | None:
        """Elimina un objetivo y lo retorna

        Args:
            objetivo_to_delete_id (int): id del objetivo a eliminar

        Returns:
            Objetivo | None: objetivo eliminado. Si el objetivo no se ha encontrado, se retorna None
        """
        objetivo_to_delete = self.find_by_id(objetivo_id=objetivo_to_delete_id)
        if objetivo_to_delete:
            return self.repo.delete(objetivo_to_delete=objetivo_to_delete)
        return None


class MapCategoriaObjetivoService:
    def __init__(self):
        self.repo = MapCategoriaObjetivoRepository()

    def find_all(self) -> list[MapCategoriaObjetivo]:
        return self.repo.find_all()

    def find_by_id(self, mapeo_id: int) -> MapCategoriaObjetivo | None:
        return self.repo.find_by_id(mapeo_id=mapeo_id)

    def save(self, mapeo: dict) -> MapCategoriaObjetivo:
        mapeo_to_save = MapCategoriaObjetivo(
            fecha_inicio=mapeo["fecha_inicio"],
            fecha_fin=mapeo["fecha_fin"],
            categoria=mapeo["categoria"],
            objetivo=mapeo["objetivo"],
        )
        return self.repo.save(mapeo=mapeo_to_save)

    def update(
        self, updated_mapeo: dict, mapeo_to_update_id: int
    ) -> MapCategoriaObjetivo:
        mapeo_to_update = self.find_by_id(mapeo_id=mapeo_to_update_id)
        if mapeo_to_update:
            mapeo_to_update.fecha_inicio = updated_mapeo["fecha_inicio"]
            mapeo_to_update.fecha_fin = updated_mapeo["fecha_fin"]
            mapeo_to_update.categoria = updated_mapeo["categoria"]
            mapeo_to_update.objetivo = updated_mapeo["objetivo"]
            return mapeo_to_update
        raise MapCategoriaObjetivo.DoesNotExist

    def delete(self, mapeo_to_delete_id: int) -> MapCategoriaObjetivo | None:
        mapeo_to_delete = self.find_by_id(mapeo_id=mapeo_to_delete_id)
        if mapeo_to_delete:
            return self.repo.delete(mapeo_to_delete=mapeo_to_delete)
        return None
