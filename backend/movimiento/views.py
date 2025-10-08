from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import Movimiento
from .serializers import MovimientoReadSerializer


# Create your views here.
class MovimientoView(APIView):
    def get(self, request, movimiento_id):
        if movimiento_id:
            movimiento = Movimiento.objects.get(id=movimiento_id)
            if movimiento:
                serializer = MovimientoReadSerializer(movimiento, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(
                {"error": "Movimiento no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )
        movimientos_list = Movimiento.objects.all()
        serializer = MovimientoReadSerializer(movimientos_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
