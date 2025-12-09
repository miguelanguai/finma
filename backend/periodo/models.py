from django.db import models

from categoria.models import Categoria


class Periodo(models.Model):
    """Clase Período

    nombre (str): nombre del período. Ejemplo: 2025 Enero
    fecha (datetime): fecha del período. Siempre es un mes y un año. Se pone al primer día del mes
    cada fecha. Ejemplo: datetime(year=2025, month=1, day=1)

    Args:
        models (Model): clase nativa Model
    """

    nombre = models.CharField(max_length=255, null=False)
    fecha = models.DateField(max_length=255, null=False)

    def __str__(self):
        return f"""
        periodo {self.nombre} en fecha {self.fecha}.
        """


class MapPeriodoCategoria(models.Model):
    """Clase MapPeriodoCategoria

    Es el mapeo entre entidades Periodo y Categoria

    porc_ideal_fijo (float): porcentaje ideal respecto a fijo de este período. Ejemplo: 12.725
    porc_ideal_estimado (float): porcentaje ideal respecto a estimado de este período.
    Ejemplo: 12.725
    porc_ideal_obtenido (float): porcentaje ideal respecto a obtenido de este período.
    Ejemplo: 12.725
    periodo (Periodo): periodo que tiene el mapeo
    categoria (Categoria): categoria que tiene el mapeo

    Args:
        models (_type_): _description_

    Returns:
        _type_: _description_
    """

    porc_ideal_fijo = models.DecimalField(max_digits=5, decimal_places=3, null=True)
    porc_ideal_estimado = models.DecimalField(max_digits=5, decimal_places=3, null=True)
    porc_ideal_obtenido = models.DecimalField(max_digits=5, decimal_places=3, null=True)
    periodo = models.ForeignKey(Periodo, null=True, on_delete=models.SET_NULL)
    categoria = models.ForeignKey(Categoria, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"""
        porcentaje ideal respecto a fijo: {self.porc_ideal_fijo}
        porcentaje ideal respecto a estimado: {self.porc_ideal_estimado}
        porcentaje ideal respecto a obtenido: {self.porc_ideal_obtenido}
        categoria: {self.categoria}
        periodo: {self.periodo}
        """
