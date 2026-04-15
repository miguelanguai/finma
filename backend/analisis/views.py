from datetime import date

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import BalanceAnalisisService, CategoriasAnalisisService, ObjetivosAnalisisService


class ObjetivosAnalisisView(APIView):
    service = ObjetivosAnalisisService()

    def get(self, request: Request) -> Response:
        return Response(self.service.get_progreso(), status=status.HTTP_200_OK)


class CategoriasAnalisisView(APIView):
    service = CategoriasAnalisisService()

    def get(self, request: Request) -> Response:
        anio_param = request.query_params.get("anio", date.today().year)
        try:
            anio = int(anio_param)
        except (ValueError, TypeError):
            return Response(
                {"error": "El parámetro 'anio' debe ser un entero"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            self.service.get_gastos_por_categoria(anio=anio),
            status=status.HTTP_200_OK,
        )


class BalanceAnalisisView(APIView):
    service = BalanceAnalisisService()

    def get(self, request: Request) -> Response:
        anio_param = request.query_params.get("anio", date.today().year)
        try:
            anio = int(anio_param)
        except (ValueError, TypeError):
            return Response(
                {"error": "El parámetro 'anio' debe ser un entero"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            self.service.get_balance(anio=anio),
            status=status.HTTP_200_OK,
        )
