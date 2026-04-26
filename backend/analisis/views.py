from datetime import date

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import BalanceAnalisisService, CategoriasAnalisisService, ComparativaAnalisisService, ObjetivosAnalisisService, ResumenLandingService


class ResumenLandingView(APIView):
    service = ResumenLandingService()

    def get(self, request: Request) -> Response:
        return Response(self.service.get_resumen(), status=status.HTTP_200_OK)


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


class ComparativaAnalisisView(APIView):
    service = ComparativaAnalisisService()

    def get(self, request: Request) -> Response:
        periodo1_param = request.query_params.get("periodo1")
        periodo2_param = request.query_params.get("periodo2")

        if not periodo1_param or not periodo2_param:
            return Response(
                {"error": "Se requieren los parámetros 'periodo1' y 'periodo2'"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            periodo1_id = int(periodo1_param)
            periodo2_id = int(periodo2_param)
        except ValueError:
            return Response(
                {"error": "Los parámetros 'periodo1' y 'periodo2' deben ser enteros"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        resultado = self.service.get_comparativa(periodo1_id, periodo2_id)
        if resultado is None:
            return Response(
                {"error": "Alguno de los períodos indicados no existe"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(resultado, status=status.HTTP_200_OK)


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
