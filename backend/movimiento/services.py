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

    def update(self, movimiento: dict, movimiento_to_update_id: int) -> Movimiento:
        """Actualiza un movimiento y lo retorna

        Args:
            movimiento (dict): diccionario con los nuevos valores de la entidad
            movimiento_to_update_id (int): id de la entidad a actualizar

        Raises:
            Movimiento.DoesNotExist: la entidad no existe en la bd

        Returns:
            Movimiento: entidad actualizada
        """
        movimiento_to_update = self.find_by_id(movimiento_id=movimiento_to_update_id)
        if movimiento_to_update:
            movimiento_to_update.concepto = movimiento["concepto"]
            movimiento_to_update.monto = movimiento["monto"]
            movimiento_to_update.fecha = movimiento["fecha"]
            movimiento_to_update.recurrente = movimiento["recurrente"]
            movimiento_to_update.notas = movimiento["notas"]
            movimiento_to_update.periodo = movimiento["periodo"]
            return movimiento_to_update
        raise Movimiento.DoesNotExist

    def delete(self, movimiento_to_delete_id: int) -> Movimiento | None:
        """Elimina un mapeo y lo retorna si existe

        Args:
            movimiento_to_delete_id (int): id del movimiento a eliminar

        Returns:
            Movimiento | None: movimiento eliminado. Si el movimiento no se ha encontrado, se
            retorna None
        """
        movimiento_to_delete = self.find_by_id(movimiento_id=movimiento_to_delete_id)
        if movimiento_to_delete:
            return self.repo.delete(movimiento_to_delete=movimiento_to_delete)
