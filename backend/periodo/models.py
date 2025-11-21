from django.db import models


# Create your models here.
class Periodo(models.Model):
    """Clase Período

    nombre (str): nombre del período. Ejemplo: 2025 Enero
    mes (datetime): fecha del período. Siempre es un mes y un año. Se pone al primer día del mes 
    cada fecha. Ejemplo: datetime(year=2025, month=1, day=1)
    porc_ideal_fijo (float): porcentaje ideal respecto a fijo de este período. Ejemplo: 12.725
    porc_ideal_estimado (float): porcentaje ideal respecto a estimado de este período. 
    Ejemplo: 12.725
    porc_ideal_obtenido (float): porcentaje ideal respecto a obtenido de este período. 
    Ejemplo: 12.725

    Args:
        models (Model): clase nativa Model
    """

    nombre = models.CharField(max_length=255, null=False)
    mes = models.DateField(max_length=255, null=False)
    porc_ideal_fijo = models.DecimalField(max_digits=5, decimal_places=3, null=True)
    porc_ideal_estimado = models.DecimalField(max_digits=5, decimal_places=3, null=True)
    porc_ideal_obtenido = models.DecimalField(max_digits=5, decimal_places=3, null=True)
