from django.shortcuts import render

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import Periodo
from .services import PeriodoService
from .serializers import PeriodoReadSerializer, PeriodoWriteSerializer


class PeriodoView(APIView):
    """API de entidad Periodo

    Args:
        APIView (_type_): _description_

    Returns:
        _type_: _description_
    """

    service = PeriodoService()

    def get(self, request: Request, periodo_id: int = None) -> Response:
        """GET. Devuelve uno o muchos periodos, dependiendo de si se pasa periodo_id como
        parámetro

        Args:
            request (Request): _description_
            periodo_id (int, optional): id de Periodo. Defaults to None.

        Returns:
            Response: _description_
        """
        if periodo_id:
            periodo = self.service.find_by_id(periodo_id=periodo_id)
            if periodo:
                serializer = PeriodoReadSerializer(periodo, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(
                {"error": "Periodo no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )
        periodos_list = self.service.find_all()
        serializer = PeriodoReadSerializer(periodos_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request) -> Response:
        """POST. Guarda un periodo

        Args:
            request (Request): _description_

        Returns:
            Response: _description_
        """
        serializer = PeriodoWriteSerializer(data=request.data)
        if serializer.is_valid():
            periodo = self.service.save(serializer.validated_data)
            return Response(
                PeriodoWriteSerializer(periodo).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request: Request, periodo_id: int) -> Response:
        """PUT. Edita un periodo

        Args:
            request (Request): _description_
            periodo_id (int): id de periodo

        Returns:
            Response: _description_
        """
        serializer = PeriodoWriteSerializer(data=request.data)
        if serializer.is_valid():
            periodo = self.service.update(
                updated_period=serializer.validated_data,
                periodo_to_update_id=periodo_id,
            )
            if periodo:
                return Response(PeriodoWriteSerializer(periodo).data)
            return Response(
                {"error": "periodo no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request: Request, periodo_id: int) -> Response:
        """DELETE. Elimina un periodo

        Args:
            request (Request): _description_
            periodo_id (int): id del periodo a eliminar

        Returns:
            Response: _description_
        """
        periodo = self.service.delete(periodo_to_delete_id=periodo_id)
        if periodo:
            serializer = PeriodoReadSerializer(periodo, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(
            {"error": "Periodo no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )
