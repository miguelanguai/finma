from django.shortcuts import render

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import Objetivo
from .services import ObjetivoService
from .serializers import ObjetivoReadSerializer, ObjetivoWriteSerializer


class ObjetivoView(APIView):
    service = ObjetivoService()

    def get(self, request: Request, objetivo_id: int = None) -> Response:
        """GET. Devuelve un objetivo o muchos , dependiendo de si se pasa objetivo_id como
        parámetro

        Args:
            request (Request): _description_
            objetivo_id (int, optional): id de Objetivo. Defaults to None.

        Returns:
            Response: _description_
        """
        if objetivo_id:
            print(objetivo_id)
            print(Objetivo.objects.get(pk=1))
            # TODO: No va bien
            objetivo = self.service.find_by_id(objetivo_id=objetivo_id)
            if objetivo:
                serializer = ObjetivoReadSerializer(objetivo, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(
                {"error": "objetivo no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )
        objetivos_list = self.service.find_all()
        serializer = ObjetivoReadSerializer(objetivos_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request) -> Response:
        """POST. Guarda un objetivo

        Args:
            request (Request): _description_

        Returns:
            Response: _description_
        """
        serializer = ObjetivoWriteSerializer(data=request.data)
        if serializer.is_valid():
            objetivo = self.service.save(serializer.validated_data)
            return Response(
                ObjetivoWriteSerializer(objetivo).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request: Request, objetivo_id: int) -> Response:
        """PUT. Edita un objetivo

        Args:
            request (Request): _description_
            objetivo_id (int): id de objetivo

        Returns:
            Response: _description_
        """
        serializer = ObjetivoWriteSerializer(data=request.data)
        if serializer.is_valid():
            objetivo = self.service.update(
                updated_objetivo=serializer.validated_data,
                objetivo_to_update_id=objetivo_id,
            )
            if objetivo:
                return Response(ObjetivoWriteSerializer(objetivo).data)
            return Response(
                {"error": "objetivo no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request: Request, objetivo_id: int) -> Response:
        """DELETE. Elimina un objetivo

        Args:
            request (Request): _description_
            objetivo_id (int): id del objetivo a eliminar

        Returns:
            Response: _description_
        """
        objetivo = self.service.delete(objetivo_to_delete_id=objetivo_id)
        if objetivo:
            serializer = ObjetivoReadSerializer(objetivo, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(
            {"error": "objetivo no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )
