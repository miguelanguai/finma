from django.db import models


# Create your models here.
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
