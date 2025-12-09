from rest_framework import serializers
from .models import Objetivo


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
