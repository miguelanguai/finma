from .models import Periodo
from .repositories import PeriodoRepository


class PeriodoService:
    def __init__(self):
        self.repo = PeriodoRepository()

    def find_all(self)-> list[Periodo]:
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

    def save(self, periodo: dict)-> Periodo:
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
