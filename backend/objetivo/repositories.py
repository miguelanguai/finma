from .models import Objetivo


class ObjetivoRepository:
    def __init__(self):
        pass

    def find_all(self) -> list[Objetivo]:
        return Objetivo.objects.all()

    def find_by_id(self, objetivo_id: int) -> Objetivo | None:
        try:
            return Objetivo.objects.get(pk=objetivo_id)
        except Objetivo.DoesNotExist as error:
            print(error)
            return None

    def save(self, objetivo: Objetivo) -> Objetivo:
        objetivo.save()
        return objetivo

    def delete(self, objetivo_to_delete: Objetivo) -> Objetivo:
        objetivo_to_delete.delete()
        return objetivo_to_delete
