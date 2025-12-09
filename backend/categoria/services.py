from .models import Categoria
from .repositories import CategoriaRepository


class CategoriaService:
    def __init__(self):
        self.repo = CategoriaRepository()

    def find_all(self) -> list[Categoria]:
        """Retorna todas las categorias existentes.
        Llama a CategoriaRepository.find_all

        Returns:
            list[Categoria]: lista con todas las categorias
        """
        return self.repo.find_all()

    def find_by_id(self, categoria_id: int) -> Categoria | None:
        """Retorna una categoría cuya id se ha pasado como parámetro
        Llama a CategoriaRepository.find_by_id

        Args:
            categoria_id (int): id de Categoria

        Returns:
            Categoria | None: categoria si existe
        """
        return self.repo.find_by_id(categoria_id=categoria_id)

    def save(self, categoria: dict) -> Categoria:
        """Guarda una categoria y la retorna

        Args:
            categoria (dict): categoria a guardar

        Returns:
            Categoria: categoria guardada
        """
        categoria_to_save = Categoria(
            nombre=categoria["nombre"], padre=categoria["padre"]
        )
        return self.repo.save(categoria=categoria_to_save)

    def update(self, updated_categoria: dict, categoria_to_update_id: int) -> Categoria:
        """Actualiza una categoria y la retorna

        Args:
            updated_categoria (dict): diccionario con los nuevos valores de la entidad
            categoria_to_update_id (int): id de la entidad a actualizar

        Raises:
            Categoria.DoesNotExist: la entidad no existe en la bd

        Returns:
            Categoria: entidad actualizada
        """
        categoria_to_update = self.find_by_id(categoria_id=categoria_to_update_id)
        if categoria_to_update:
            categoria_to_update.nombre = updated_categoria["nombre"]
            categoria_to_update.padre = updated_categoria["padre"]
            categoria = self.repo.save(categoria=categoria_to_update)
            return categoria
        raise Categoria.DoesNotExist

    def delete(self, categoria_to_delete_id: int) -> Categoria:
        """Elimina una categoria y la retorna

        Args:
            categoria_to_delete_id (int): id de la categoria a eliminar

        Returns:
            Categoria: categoria eliminada
        """
        categoria_to_delete = self.find_by_id(categoria_id=categoria_to_delete_id)
        return self.repo.delete(categoria_to_delete=categoria_to_delete)
