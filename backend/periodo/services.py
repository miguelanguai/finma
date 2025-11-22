from .models import Periodo
from .repositories import PeriodoRepository


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

    def find_by_id(self, periodo_id: int) -> Periodo:
        """Retorna un periodo cuya id se ha pasado como parámetro
        Llama a PeriodoRepository.find_by_id

        Args:
            periodo_id (int): id del Periodo

        Returns:
            Periodo: periodo si existe
        """
        return self.repo.find_by_id(periodo_id=periodo_id)

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
