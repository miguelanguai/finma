from rest_framework import serializers
from categoria.serializers import CategoriaReadSerializer
from .models import MapCategoriaObjetivo, Objetivo


class ObjetivoReadSerializer(serializers.ModelSerializer):
    """Serializador de lectura de Objetivo

    Args:
        serializers (_type_): _description_
    """

    class Meta:
        """Meta"""

        model = Objetivo
        fields = ["id", "nombre", "monto", "prioridad", "fecha", "is_cumplido"]


class ObjetivoWriteSerializer(serializers.ModelSerializer):
    """Serializador de escritura de Objetivo

    Args:
        serializers (_type_): _description_
    """

    class Meta:
        """Meta"""

        model = Objetivo
        fields = ["nombre", "monto", "prioridad", "fecha", "is_cumplido"]


class MapCategoriaObjetivoReadSerializer(serializers.ModelSerializer):
    """Serializador de lectura de MapCategoriaObjetivo

    Args:
        serializers (_type_): _description_
    """

    categoria = CategoriaReadSerializer()
    objetivo = ObjetivoReadSerializer()

    class Meta:
        """Meta"""

        model = MapCategoriaObjetivo
        fields = ["id", "fecha_inicio", "fecha_fin", "categoria", "objetivo"]


class MapCategoriaObjetivoWriteSerializer(serializers.ModelSerializer):
    """Serializador de escritura de MapCategoriaObjetivo

    Args:
        serializers (_type_): _description_
    """

    class Meta:
        """Meta"""

        model = MapCategoriaObjetivo
        fields = ["fecha_inicio", "fecha_fin", "categoria", "objetivo"]
