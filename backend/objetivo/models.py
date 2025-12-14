from django.db import models
from categoria.models import Categoria


class Objetivo(models.Model):
    """Clase Objetivo

    Objetivo de ahorro

    nombre (str): nombre del objetivo de ahorro
    monto (float): cantidad objetivo
    prioridad (str): prioridad del objetivo
    fecha (Datetime): fecha tope del objetivo propuesta.
    is_cumplido (bool): marca si el objetivo ha sido cumplido

    Args:
        models (_type_): _description_

    Returns:
        _type_: _description_
    """

    nombre = models.CharField(max_length=255, null=False)
    monto = models.DecimalField(max_digits=9, decimal_places=2, null=False)
    prioridad = models.CharField(max_length=255, null=True)
    fecha = models.DateTimeField(null=False)
    is_cumplido = models.BooleanField(null=False, default=False)

    def __str__(self):
        return f"""
        objetivo {self.nombre} en fecha {self.fecha}, con monto de {self.monto} € y con prioridad {self.prioridad}. Cumplido: {self.is_cumplido}
        """


class MapCategoriaObjetivo(models.Model):
    """Clase MapCategoriaObjetivo

    Es el mapeo entre entidades Categoria y Objetivo

    fecha_inicio (datetime): Fecha de inicio de período en la que se fija lo ahorrado (o gastado)
    en una categoría con respecto a un objetivo determinado
    fecha_fin (datetime): Fecha de fin del período
    categoria (Categoria): categoria del mapa
    objetivo (Objetivo): objetivo del mapa

    Args:
        models (_type_): _description_
    """

    fecha_inicio = models.DateTimeField(null=False)
    fecha_fin = models.DateTimeField(null=False)
    categoria = models.ForeignKey(Categoria, null=True, on_delete=models.CASCADE)
    objetivo = models.ForeignKey(Objetivo, null=True, on_delete=models.CASCADE)
