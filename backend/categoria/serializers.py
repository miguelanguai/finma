from rest_framework import serializers
from .models import Categoria


class CategoriaReadSerializer(serializers.ModelSerializer):
    """Serializador de lectura de Categoria"""
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
