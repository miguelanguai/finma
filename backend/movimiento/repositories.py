import logging
import os

from dotenv import load_dotenv
import psycopg2

from psycopg2.extras import execute_values

from periodo.models import Periodo
from .models import Movimiento, MovimientoExcel

load_dotenv()

DB_HOST = os.getenv("POSTGRES_HOST")
DB_PORT = os.getenv("POSTGRES_PORT")
DB_NAME = os.getenv("POSTGRES_DB")
DB_USER = os.getenv("POSTGRES_USER")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DB_TABLE = "movimiento_movimiento"

logger = logging.getLogger(__name__)
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
            logger.error(error)
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


class ExcelRepository:
    """Repositorio para Excel"""
    def __init__(self):
        self.conn = self.connect_to_db()

    def connect_to_db(self):
        """Crear conexión con la base de datos y retornar el objeto Connection"""
        try:
            conn = psycopg2.connect(
                host=DB_HOST,
                dbname=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
                port=DB_PORT,
            )
            return conn
        except psycopg2.DatabaseError as error:
            logger.error("Error conectando a la base de datos: %s", error)
            raise

    def save_batch(self, batch: list[MovimientoExcel]):
        """Guarda el batch de movimientos en la base de datos

        Args:
            batch (list[MovimientoExcel]): lista de movimientos a guardar
            periodo (Periodo): periodo que tendrán asignado los movimientos a guardar
        """
        if not batch:
            return
        cursor = self.conn.cursor()
        query = (
            "INSERT INTO "
            + DB_TABLE
            + " (concepto, monto, fecha, recurrente, notas, periodo_id, categoria_id) "
            + "VALUES %s "
            + "ON CONFLICT (concepto, fecha, monto) DO NOTHING;"
        )
        values = [
            (
                d.concepto,
                d.importe,
                d.fecha,
                False,
                None,
                d.periodo.id,
                None,
            )
            for d in batch
        ]

        try:
            execute_values(cursor, query, values, page_size=1000)
            self.conn.commit()
        except psycopg2.DatabaseError as error:
            self.conn.rollback()
            logger.error("Error obtenido en save_batch: %s", str(error))
            raise
