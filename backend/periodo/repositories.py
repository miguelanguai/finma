from .models import Periodo


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

    def find_by_id(self, periodo_id: int) -> Periodo:
        """Retorna un periodo cuya id ha sido pasada por parámetro

        Args:
            periodo_id (int): id del periodo

        Returns:
            Periodo: periodo
        """
        return Periodo.objects.get(pk=periodo_id)

    def save(self, periodo: Periodo) -> Periodo:
        """Guarda un periodo

        Args:
            periodo (Periodo): periodo a guardar

        Returns:
            Periodo: periodo guardado
        """
        periodo.save()
        return periodo
