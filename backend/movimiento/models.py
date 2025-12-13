from datetime import datetime
from django.db import models


from categoria.models import Categoria
from periodo.models import Periodo


class Movimiento(models.Model):
    """Clase Movimiento

    concepto (str): concepto del movimiento. Ejemplo: gasolina
    monto (float): monto del movimiento. Ejemplo: 25.67
    fecha (Datetime): fecha en la que se realiza el movimiento. Aunque podría ser tipo Date, se ha
    preferido que sea Datetime, por lo que el horario debería ser a las 11:59 AM, si no hay una
    hora definida
    recurrente (bool): Dice si el movimiento se realiza de manera repetitiva, todos los meses
    notas (text): Si hay alguna nota que poner, de aclaración del movimiento. Ejemplo: este
    movimiento se realiza en el bar chino Manolo
    periodo (Periodo): Periodo al que es asignado el movimiento.
    categoria (Categoria): Categoria al que es asignado el movimiento.
    Al eliminar el periodo, el movimiento ni la categoria se eliminan

    Args:
        models (Model): clase nativa Model
    """

    concepto = models.CharField(max_length=50, null=False)
    monto = models.DecimalField(max_digits=8, decimal_places=2, null=False)
    fecha = models.DateTimeField(null=False)
    recurrente = models.BooleanField(null=False)
    notas = models.TextField(null=True)
    periodo = models.ForeignKey(Periodo, on_delete=models.SET_NULL, null=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)

    class Meta:
        """Constrainsts para Movimiento

        unique_concepto_fecha_monto: No puede guardarse un movimiento igual en concepto, fecha y monto
        """

        constraints = [
            models.UniqueConstraint(
                fields=["concepto", "fecha", "monto"],
                name="unique_concepto_fecha_monto",
            )
        ]

    def __str__(self):
        return f"""
        movimiento con concepto:{self.concepto} en fecha {self.fecha}.
        Perteneciente al periodo {self.periodo}. Perteneciente a la categoria {self.categoria.nombre}
        """


class MovimientoExcel:
    """clase MovimientoExcel

    Se instancia esta clase para realizar el guardado de un batch de forma más rápida en bd
    """

    def __init__(self, fecha: str, concepto: str, importe: str, periodo: Periodo):
        self.fecha: datetime = datetime.strptime(fecha, "%d/%m/%Y")
        self.concepto: str = concepto
        self.importe: float = float(importe)
        self.periodo: Periodo = periodo

    def __str__(self):
        return f"Movimiento: {self.concepto} con un importe de {self.importe} en fecha {self.fecha}, del periodo {self.periodo.nombre}"
