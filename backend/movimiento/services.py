import datetime
import re

from datetime import datetime

from .repositories import MovimientoRepository

from periodo.models import Periodo
from periodo.services import PeriodoService
from .models import Movimiento, MovimientoExcel
from django.core.files.uploadedfile import InMemoryUploadedFile
import pandas as pd

from pandas import DataFrame


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


class ExcelService:
    def __init__(self):
        self.excel_file_name: str = None
        self.excel_periodo: Periodo = None

    def main(self, excel_file):
        """Método main

        Args:
            excel_file (_type_): _description_

        Returns:
            _type_: _description_
        """
        self.excel_file_name = excel_file.name
        print("excel file name: " + self.excel_file_name)
        self.excel_periodo = self.find_periodo_from_file_name(
            file_name=self.excel_file_name
        )
        print(self.excel_periodo)
        df = self.get_df(excel_file=excel_file)
        data_batch = self.process_dataframe(df=df)
        # TODO: pasar data_batch como arg para un metodo del repositorio que suba el batch entero
        return True

    def find_periodo_from_file_name(self, file_name: str) -> Periodo:
        """Recupera el periodo desde el string que se pasa como parámetro

        Args:
            file_name (str): nombre del archivo

        Returns:
            Periodo: _description_
        """
        periodo_service = PeriodoService()
        pattern = r"\d{2}-\d{2}"
        result = re.match(pattern=pattern, string=file_name)
        if result:
            datetime_result = datetime.strptime(result.group(), "%y-%m")
            periodo = periodo_service.find_periodo_by_datetime(
                periodo_datetime=datetime_result
            )
            if not periodo:
                raise Exception("No se ha encontrado el periodo")
        return periodo

    def get_df(self, excel_file: InMemoryUploadedFile) -> DataFrame:
        """Genera un DataFrame a partir del excel

        Args:
            excel_file (InMemoryUploadedFile): Archivo xlsx en memoria

        Returns:
            DataFrame: dataframe a partir del excel
        """
        return pd.read_excel(excel_file, header=7)

    def process_dataframe(self, df: DataFrame) -> list[MovimientoExcel]:
        """Procesa el dataframe y devuelve una lista de movimientos para guardar con el repositorio

        Args:
            df (DataFrame): dataframe de movimientos

        Returns:
            list[MovimientoExcel]: lista de instanciaciones para guardar en la bd.
        """
        mini_df = df.head()
        for i in range(len(mini_df)):
            row = df.iloc[i]
            # print(row)
            # print(row["Concepto"])
            movimiento = MovimientoExcel(
                fecha=row["Fecha operación"],
                concepto=row["Concepto"],
                importe=row["Importe"],
                periodo=self.excel_periodo,
            )
            # no imprime el periodo en este string
            print(movimiento)

        return []
