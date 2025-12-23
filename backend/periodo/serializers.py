from rest_framework import serializers

from categoria.models import Categoria
from categoria.serializers import CategoriaReadSerializer
from .models import MapPeriodoCategoria, Periodo

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


class MapPeriodoCategoriaReadSerializer(serializers.ModelSerializer):
    """Serializador de lectura de MapPeriodoCategoria

    Args:
        serializers (_type_): _description_
    """

    periodo = PeriodoReadSerializer()
    categoria = CategoriaReadSerializer()

    class Meta:
        """Meta"""

        model = MapPeriodoCategoria
        fields = [
            "id",
            "porc_ideal_fijo",
            "porc_ideal_estimado",
            "porc_ideal_obtenido",
            "periodo",
            "categoria",
        ]


class MapPeriodoCategoriaWriteSerializer(serializers.ModelSerializer):
    """Serializador de escritura de MapPeriodoCategoria

    Args:
        serializers (_type_): _description_
    """

    periodo = serializers.PrimaryKeyRelatedField(queryset=Periodo.objects.all())
    categoria = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all())

    class Meta:
        """Meta"""

        model = MapPeriodoCategoria
        fields = [
            "porc_ideal_fijo",
            "porc_ideal_estimado",
            "porc_ideal_obtenido",
            "periodo",
            "categoria",
        ]
