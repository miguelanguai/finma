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
