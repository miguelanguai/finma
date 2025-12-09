from django.shortcuts import render

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import Movimiento
from .serializers import MovimientoReadSerializer, MovimientoWriteSerializer
from .services import MovimientoService


class MovimientoView(APIView):
    """API de entidad Movimiento

    Args:
        APIView (_type_): _description_

    Returns:
        _type_: _description_
    """

    service = MovimientoService()

    def get(self, request: Request, movimiento_id: int = None) -> Response:
        """GET. Devuelve uno o muchos movimientos, dependiendo de si se pasa movimiento_id como
        parámetro.

        Args:
            request (Request): request del metodo
            movimiento_id (int, optional): id de Movimiento. Defaults to None.

        Returns:
            Response: _description_
        """
        if movimiento_id:
            movimiento = self.service.find_by_id(movimiento_id=movimiento_id)
            if movimiento:
                serializer = MovimientoReadSerializer(movimiento, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(
                {"error": "Movimiento no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )
        movimientos_list = self.service.find_all()
        serializer = MovimientoReadSerializer(movimientos_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request) -> Response:
        """POST. Guarda un movimiento

        Args:
            request (Request): _description_

        Returns:
            Response: _description_
        """
        serializer = MovimientoWriteSerializer(data=request.data)
        if serializer.is_valid():
            self.service.save(serializer.validated_data)
            return Response(
                MovimientoWriteSerializer(None).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request: Request, movimiento_id: int) -> Response:
        """PUT. Edita un movimiento

        Args:
            request (Request): _description_
            movimiento_id (int): id del movimiento

        Returns:
            Response: _description_
        """
        serializer = MovimientoWriteSerializer(data=request.data)
        if serializer.is_valid():
            movimiento = self.service.update(
                movimiento=serializer.validated_data,
                movimiento_to_update_id=movimiento_id,
            )
            if movimiento:
                return Response(MovimientoWriteSerializer(movimiento).data)
            return Response(
                {"error": "movimiento no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request: Request, movimiento_id: int) -> Response:
        """DELETE. Elimina un movimiento

        Args:
            request (Request): _description_
            mapeo_id (int): id del movimiento a eliminar

        Returns:
            Response: _description_
        """
        movimiento = self.service.delete(movimiento_to_delete_id=movimiento_id)
        if movimiento:
            serializer = MovimientoReadSerializer(movimiento, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(
            {"error": "movimiento no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )
