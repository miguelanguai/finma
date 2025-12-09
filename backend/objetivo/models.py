from django.db import models


class Objetivo(models.Model):
    """Clase Objetivo

    Objetivo de ahorro

    nombre (str): nombre del objetivo de ahorro
    monto (float): cantidad objetivo
    prioridad (str): prioridad del objetivo
    fecha (Datetime): fecha tope del objetivo propuesta.

    Args:
        models (_type_): _description_

    Returns:
        _type_: _description_
    """
    nombre = models.CharField(max_length=255, null=False)
    monto = models.DecimalField(max_digits=9, decimal_places=2, null=False)
    prioridad = models.CharField(max_length=255, null=True)
    fecha = models.DateTimeField(null=False)

    def __str__(self):
        return f"""
        objetivo {self.nombre} en fecha {self.fecha}, con monto de {self.monto} € y con prioridad {self.prioridad}.
        """
