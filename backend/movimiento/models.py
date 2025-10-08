from django.db import models


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

    Args:
        models (Model): clase nativa Model
    """

    concepto = models.CharField(max_length=50, null=False)
    monto = models.DecimalField(max_digits=8, decimal_places=2, null=False)
    fecha = models.DateTimeField(null=False)
    recurrente = models.BooleanField(null=False)
    notas = models.TextField(null=True)
