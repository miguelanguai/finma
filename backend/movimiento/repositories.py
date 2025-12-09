from .models import Movimiento


class MovimientoRepository:
    """Repositorio de Movimiento"""

    def __init__(self):
        pass

    def find_all(self) -> list[Movimiento]:
        """Retorna todos los movimientos existentes

        Returns:
            list[Movimiento]: lista con todos los movimientos
        """
        return Movimiento.objects.all()

    def find_by_id(self, movimiento_id: int) -> Movimiento | None:
        """Retorna un movimiento cuya id se ha pasado como parámetro

        Args:
            movimiento_id (int): id del Movimiento

        Returns:
            Movimiento | None: movimiento si existe
        """
        try:
            return Movimiento.objects.get(pk=movimiento_id)
        except Movimiento.DoesNotExist as error:
            print(error)
            return None

    def find_all_by_periodo(self, periodo_id: int) -> list[Movimiento]:
        """Retorna una lista de movimientos que estén adscritos a un periodo

        Args:
            periodo_id (int): id de Periodo

        Returns:
            list[Movimiento]: lista de movimientos
        """
        return Movimiento.objects.filter(periodo_id=periodo_id)

    def save(self, movimiento: Movimiento) -> Movimiento:
        """Crea un nuevo Movimiento

        Args:
            movimiento (Movimiento): nuevo movimiento a crear

        Returns:
            Movimiento: nuevo movimiento creado
        """
        movimiento.save()
        return movimiento

    def delete(self, movimiento_to_delete: Movimiento) -> Movimiento:
        """Elimina un movimiento

        Args:
            movimiento_to_delete (Movimiento): movimiento a eliminar

        Returns:
            Movimiento: movimiento eliminado
        """
        movimiento_to_delete.delete()
        return movimiento_to_delete
