from rest_framework import serializers
from .models import MapCategoriaObjetivo, Objetivo


class ObjetivoReadSerializer(serializers.ModelSerializer):
    """Serializador de lectura de Objetivo

    Args:
        serializers (_type_): _description_
    """

    class Meta:
        """Meta"""

        model = Objetivo
        fields = ["id", "nombre", "monto", "prioridad", "fecha"]


class ObjetivoWriteSerializer(serializers.ModelSerializer):
    """Serializador de escritura de Objetivo

    Args:
        serializers (_type_): _description_
    """

    class Meta:
        """Meta"""

        model = Objetivo
        fields = ["nombre", "monto", "prioridad", "fecha"]


class MapCategoriaObjetivoReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapCategoriaObjetivo
        fields = ["id", "fecha_inicio", "fecha_fin", "categoria", "objetivo"]


class MapCategoriaObjetivoWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapCategoriaObjetivo
        fields = ["fecha_inicio", "fecha_fin", "categoria", "objetivo"]
