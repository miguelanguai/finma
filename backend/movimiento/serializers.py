from rest_framework import serializers
from categoria.serializers import CategoriaReadSerializer
from periodo.serializers import PeriodoReadSerializer
from .models import Movimiento


class MovimientoReadSerializer(serializers.ModelSerializer):
    """Serializador de lectura de Movimiento

    Args:
        serializers (_type_): _description_
    """

    categoria = CategoriaReadSerializer()
    periodo = PeriodoReadSerializer()

    class Meta:
        """Meta"""

        model = Movimiento
        fields = [
            "id",
            "concepto",
            "monto",
            "fecha",
            "recurrente",
            "notas",
            "periodo",
            "categoria",
        ]


class MovimientoWriteSerializer(serializers.ModelSerializer):
    """Serializador de escritura de Movimiento

    Args:
        serializers (_type_): _description_
    """

    class Meta:
        """Meta"""

        model = Movimiento
        fields = [
            "concepto",
            "monto",
            "fecha",
            "recurrente",
            "notas",
            "periodo",
            "categoria",
        ]
