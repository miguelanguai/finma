from rest_framework import serializers
from .models import Movimiento


class MovimientoReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimiento
        fields = ["id", "concepto", "monto", "fecha", "recurrente", "notas", "periodo", "categoria"]


class MovimientoWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimiento
        fields = ["concepto", "monto", "fecha", "recurrente", "notas", "periodo", "categoria"]
