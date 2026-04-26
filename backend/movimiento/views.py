from datetime import date

from django.http import HttpResponse
from django.shortcuts import render

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import Movimiento
from .serializers import MovimientoReadSerializer, MovimientoWriteSerializer
from .services import ExcelService, ExportarService, MovimientoService


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

        fecha_desde = request.query_params.get("fecha_desde")
        fecha_hasta = request.query_params.get("fecha_hasta")
        categoria_id_param = request.query_params.get("categoria_id")
        is_gasto_param = request.query_params.get("is_gasto")
        concepto = request.query_params.get("concepto")

        categoria_id = int(categoria_id_param) if categoria_id_param else None
        is_gasto = None
        if is_gasto_param is not None:
            is_gasto = is_gasto_param.lower() == "true"

        movimientos_list = self.service.find_with_filters(
            fecha_desde=fecha_desde,
            fecha_hasta=fecha_hasta,
            categoria_id=categoria_id,
            is_gasto=is_gasto,
            concepto=concepto,
        )
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


class ExportarView(APIView):

    service = MovimientoService()
    exportar_service = ExportarService()

    def get(self, request: Request) -> HttpResponse:
        fecha_desde = request.query_params.get("fecha_desde")
        fecha_hasta = request.query_params.get("fecha_hasta")
        categoria_id_param = request.query_params.get("categoria_id")
        is_gasto_param = request.query_params.get("is_gasto")
        concepto = request.query_params.get("concepto")

        categoria_id = int(categoria_id_param) if categoria_id_param else None
        is_gasto = None
        if is_gasto_param is not None:
            is_gasto = is_gasto_param.lower() == "true"

        movimientos = self.service.find_with_filters(
            fecha_desde=fecha_desde,
            fecha_hasta=fecha_hasta,
            categoria_id=categoria_id,
            is_gasto=is_gasto,
            concepto=concepto,
        )
        xlsx_bytes = self.exportar_service.generar_xlsx(movimientos)
        filename = f"movimientos_{date.today().isoformat()}.xlsx"
        response = HttpResponse(
            xlsx_bytes,
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response


class ExcelView(APIView):

    service = ExcelService()

    def post(self, request: Request) -> Response:
        excel_file = request.FILES["excel"]
        processed_file = self.service.main(excel_file=excel_file)
        if processed_file:
            return Response(
                {"message": "Archivo procesado correctamente"},
                status=status.HTTP_200_OK,
            )
        return Response({"message": "Ha ocurrido un error"})
