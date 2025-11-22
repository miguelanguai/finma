from rest_framework import serializers
from .models import Periodo


class PeriodoReadSerializer(serializers.ModelSerializer):
    """Serializador de lectura de Periodo

    Args:
        serializers (_type_): _description_
    """
    class Meta:
        """Meta"""
        model = Periodo
        fields = [
            "id",
            "nombre",
            "fecha",
        ]


class PeriodoWriteSerializer(serializers.ModelSerializer):
    """Serializador de escritura de Periodo

    Args:
        serializers (_type_): _description_
    """
    class Meta:
        """Meta"""
        model = Periodo
        fields = [
            "nombre",
            "fecha",
        ]
