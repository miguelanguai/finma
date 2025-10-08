from rest_framework import serializers
from .models import Movimiento


class MovimientoReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimiento
        fiedls = ["id", "concepto", "monto", "fecha", "recurrente", "notas"]


class MovimientoWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimiento
        fiedls = ["concepto", "monto", "fecha", "recurrente", "notas"]
