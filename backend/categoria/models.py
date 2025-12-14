from django.db import models


# Create your models here.
class Categoria(models.Model):
    """clase Categoria

    nombre (str): nombre de la categoria
    is_gasto (bool): indica si la categoria es un gasto o un ingreso. Gasto si es True.
    padre (Categoria): categoria padre de la misma. Puede estar en null.
    Por ejemplo. La categoria gastos coche es hija de la categoria gastos

    Args:
        models (_type_): _description_
    """

    nombre = models.CharField(max_length=50, null=False)
    is_gasto = models.BooleanField(null=False)
    padre = models.ForeignKey("self", on_delete=models.SET_NULL, null=True)

    def __str__(self) -> str:
        if self.padre:
            return f"categoria {self.nombre}. Subcategoria de {self.padre}. Es gasto: {self.is_gasto}"
        return f"categoria {self.nombre}. Es gasto: {self.is_gasto}"

    def get_subcategorias_directas(self) -> list["Categoria"]:
        """Devuelve las categorias que son hijas directas de esta categoria

        Returns:
            Categoria[]: _description_
        """
        return list(self.__class__.objects.filter(padre=self))
