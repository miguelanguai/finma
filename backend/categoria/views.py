from django.shortcuts import render

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import Categoria
from .services import CategoriaService
from .serializers import CategoriaWriteSerializer, CategoriaReadSerializer


class CategoriaView(APIView):
    """API de entidad Categoria

    Args:
        APIView (_type_): _description_

    Returns:
        _type_: _description_
    """

    service = CategoriaService()

    def get(self, request: Request, categoria_id: int = None) -> Response:
        """GET. Devuelve una o muchas categorías, dependiendo de si se pasa categoria_id
        como parámetro.

        Args:
            request (Request): _description_
            categoria_id (int, optional): id de Categoria. Defaults to None.

        Returns:
            Response: _description_
        """
        if categoria_id:
            categoria = self.service.find_by_id(categoria_id=categoria_id)
            if categoria:
                serializer = CategoriaReadSerializer(categoria, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(
                {"error": "Categoría no encontrada"}, status=status.HTTP_404_NOT_FOUND
            )
        categorias_list = self.service.find_all()
        serializer = CategoriaReadSerializer(categorias_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request) -> Response:
        """POST. Guarda una categoria

        Args:
            request (Request): _description_

        Returns:
            Response: _description_
        """
        serializer = CategoriaWriteSerializer(data=request.data)
        if serializer.is_valid():
            categoria = self.service.save(serializer.validated_data)
            return Response(
                CategoriaWriteSerializer(categoria).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request: Request, categoria_id: int) -> Response:
        """PUT. Edita un categoria

        Args:
            request (Request): _description_
            categoria_id (int): id de categoria

        Returns:
            Response: _description_
        """
        serializer = CategoriaWriteSerializer(data=request.data)
        if serializer.is_valid():
            categoria = self.service.update(
                updated_categoria=serializer.validated_data,
                categoria_to_update_id=categoria_id,
            )
            if categoria:
                return Response(CategoriaWriteSerializer(categoria).data)
            return Response(
                {"error": "categoria no encontrada"}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request: Request, categoria_id: int) -> Response:
        """DELETE. Elimina una categoria

        Args:
            request (Request): _description_
            categoria_id (int): id de la categoria a eliminar

        Returns:
            Response: _description_
        """
        categoria = self.service.delete(categoria_to_delete_id=categoria_id)
        if categoria:
            serializer = CategoriaReadSerializer(categoria, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(
            {"error": "Categoria no encontrada"}, status=status.HTTP_404_NOT_FOUND
        )
