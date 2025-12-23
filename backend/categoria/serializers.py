from rest_framework import serializers
from .models import Categoria


class CategoriaReadSerializer(serializers.ModelSerializer):
    """Serializador de lectura de Categoria"""

    padre = serializers.SerializerMethodField()

    def get_padre(self, obj):
        """Recupera la autoreferencia con otra entidad

        Args:
            obj (_type_): _description_

        Returns:
            _type_: _description_
        """
        if not obj.padre:
            return None
        return {
            "id": obj.padre.id,
            "nombre": obj.padre.nombre,
            "is_gasto": obj.padre.is_gasto,
        }

    class Meta:
        """Meta"""

        model = Categoria
        fields = ["id", "nombre", "is_gasto", "padre"]


class CategoriaWriteSerializer(serializers.ModelSerializer):
    """Serializador de escritura de Categoria"""

    class Meta:
        """Meta"""

        model = Categoria
        fields = ["nombre", "is_gasto", "padre"]
