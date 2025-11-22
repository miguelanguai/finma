from .repositories import MovimientoRepository
from .models import Movimiento


class MovimientoService:
    def __init__(self):
        self.repo = MovimientoRepository()

    def find_all(self) -> list[Movimiento]:
        """Retorna todos los movimientos existentes.
        Llama a MovimientoRepository.find_all

        Returns:
            list[Movimiento]: lista con todos los movimientos
        """
        return self.repo.find_all()

    def find_by_id(self, movimiento_id: int) -> Movimiento | None:
        """Retorna un movimiento cuya id se ha pasado como parámetro
        Llama a MovimientoRepository.find_by_id

        Args:
            movimiento_id (int): id del Movimiento

        Returns:
            Movimiento | None: movimiento si existe
        """
        return self.repo.find_by_id(movimiento_id=movimiento_id)

    def find_all_by_periodo(self, periodo_id: int) -> list[Movimiento]:
        """Retorna una lista de movimientos que estén adscritos a un periodo
        Llama a MovimientoRepository.find_all_by_periodo

        Args:
            periodo_id (int): id de Periodo

        Returns:
            list[Movimiento]: lista de movimientos
        """
        return self.repo.find_all_by_periodo(periodo_id=periodo_id)

    def save(self, movimiento: dict) -> Movimiento:
        """Guarda un movimiento y lo retorna
        Llama a MovimientoRepository.save

        Args:
            movimiento (dict): movimiento a guardar

        Returns:
            Movimiento: movimiento guardado
        """
        movimiento_to_save = Movimiento(
            concepto=movimiento["concepto"],
            monto=movimiento["monto"],
            fecha=movimiento["fecha"],
            recurrente=movimiento["recurrente"],
            notas=movimiento["notas"],
            periodo=movimiento["periodo"],
        )
        return self.repo.save(movimiento=movimiento_to_save)
