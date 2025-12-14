import logging

from .models import Categoria

logger = logging.getLogger(__name__)
class CategoriaRepository:
    """Repositorio de Categoria"""

    def __init__(self):
        pass

    def find_all(self) -> list[Categoria]:
        """Retorna todas las categorias existentes

        Returns:
            list[Categoria]: todas las categorías existentes
        """
        return Categoria.objects.all()

    def find_by_id(self, categoria_id: int) -> Categoria | None:
        """
        Retorna una categoría cuya id ha sido pasada por parámetro

        Args:
            categoria_id (int): id de la categoría

        Returns:
            Categoria | None: categoria si existe
        """
        try:
            return Categoria.objects.get(pk=categoria_id)
        except Categoria.DoesNotExist as error:
            logger.error(error)
            return None

    def save(self, categoria: Categoria) -> Categoria:
        """Guarda una categoría

        Args:
            categoria (Categoria): categoría a guardar

        Returns:
            Categoria: categoría guardada
        """
        categoria.save()
        return categoria

    def delete(self, categoria_to_delete: Categoria) -> Categoria:
        """Elimina una categoría

        Args:
            categoria_to_delete (Categoria): categoría a eliminar

        Returns:
            Categoria: categoría eliminada
        """
        categoria_to_delete.delete()
        return categoria_to_delete
