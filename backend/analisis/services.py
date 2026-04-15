from datetime import date, timedelta
from decimal import Decimal

from categoria.models import Categoria
from movimiento.models import Movimiento
from objetivo.models import MapCategoriaObjetivo, Objetivo
from periodo.models import Periodo


class ObjetivosAnalisisService:
    def get_progreso(self) -> list[dict]:
        """Calcula el progreso de cada objetivo y su previsión de cumplimiento.

        Para cada objetivo:
        - Suma los movimientos de las categorías mapeadas dentro del rango de fechas del mapeo.
        - Calcula el porcentaje de avance.
        - Estima la fecha de cumplimiento en base a la tasa de acumulación diaria.

        Returns:
            list[dict]: lista con el progreso de cada objetivo.
        """
        objetivos = Objetivo.objects.all()
        hoy = date.today()
        resultado = []

        for objetivo in objetivos:
            mapeos = MapCategoriaObjetivo.objects.filter(objetivo=objetivo)
            acumulado = Decimal("0")
            fecha_inicio_mas_temprana = None

            for mapeo in mapeos:
                movimientos = Movimiento.objects.filter(
                    categoria=mapeo.categoria,
                    fecha__gte=mapeo.fecha_inicio,
                    fecha__lte=mapeo.fecha_fin,
                )
                for mov in movimientos:
                    acumulado += abs(mov.monto)

                fecha_inicio = mapeo.fecha_inicio.date() if hasattr(mapeo.fecha_inicio, "date") else mapeo.fecha_inicio
                if fecha_inicio_mas_temprana is None or fecha_inicio < fecha_inicio_mas_temprana:
                    fecha_inicio_mas_temprana = fecha_inicio

            monto = objetivo.monto or Decimal("0")
            porcentaje = float(acumulado / monto * 100) if monto > 0 else 0.0

            fecha_prevista = None
            if fecha_inicio_mas_temprana and acumulado > 0 and monto > acumulado:
                dias_transcurridos = (hoy - fecha_inicio_mas_temprana).days
                if dias_transcurridos > 0:
                    tasa_diaria = acumulado / Decimal(dias_transcurridos)
                    dias_restantes = (monto - acumulado) / tasa_diaria
                    fecha_prevista = hoy + timedelta(days=float(dias_restantes))

            resultado.append({
                "id": objetivo.id,
                "nombre": objetivo.nombre,
                "monto": float(monto),
                "acumulado": float(acumulado),
                "porcentaje": min(porcentaje, 100.0),
                "fecha_prevista": fecha_prevista.isoformat() if fecha_prevista else None,
                "is_cumplido": objetivo.is_cumplido,
            })

        return resultado


class CategoriasAnalisisService:
    def get_gastos_por_categoria(self, anio: int) -> list[dict]:
        """Devuelve los gastos agrupados por categoría y mes para el año indicado,
        junto con previsiones mínima, máxima y media para los meses restantes.

        La previsión se calcula sobre los períodos ya cerrados del año:
        - Máxima: gasto del período más alto × meses restantes.
        - Mínima: gasto del período más bajo × meses restantes.
        - Media: media de gastos × meses restantes.

        Args:
            anio (int): año sobre el que calcular.

        Returns:
            list[dict]: gastos y previsiones por categoría.
        """
        hoy = date.today()
        periodos = Periodo.objects.filter(fecha__year=anio).order_by("fecha")
        categorias = Categoria.objects.filter(is_gasto=True)

        if anio < hoy.year:
            meses_restantes = 0
        elif anio == hoy.year:
            meses_restantes = 12 - hoy.month
        else:
            meses_restantes = 12

        resultado = []
        for categoria in categorias:
            gastos_por_mes = []
            for periodo in periodos:
                movimientos = Movimiento.objects.filter(
                    periodo=periodo,
                    categoria=categoria,
                )
                gasto = float(sum(abs(mov.monto) for mov in movimientos))
                gastos_por_mes.append({
                    "periodo": periodo.nombre,
                    "gasto": gasto,
                })

            valores_con_gasto = [g["gasto"] for g in gastos_por_mes if g["gasto"] > 0]
            gasto_anual = sum(g["gasto"] for g in gastos_por_mes)

            if valores_con_gasto and meses_restantes > 0:
                prev_maxima = max(valores_con_gasto) * meses_restantes
                prev_minima = min(valores_con_gasto) * meses_restantes
                prev_media = (sum(valores_con_gasto) / len(valores_con_gasto)) * meses_restantes
            else:
                prev_maxima = prev_minima = prev_media = 0.0

            resultado.append({
                "categoria": {"id": categoria.id, "nombre": categoria.nombre},
                "gastos_por_mes": gastos_por_mes,
                "gasto_anual": gasto_anual,
                "prev_maxima": prev_maxima,
                "prev_minima": prev_minima,
                "prev_media": prev_media,
            })

        return resultado


class BalanceAnalisisService:
    def get_balance(self, anio: int) -> dict:
        """Devuelve el balance mensual y anual para el año indicado,
        junto con previsiones mínima, máxima y media al cierre del año.

        El balance mensual se calcula como: ingreso_fijo del período - gastos totales del período.
        Las previsiones se acumulan sobre el balance actual ya obtenido.

        Args:
            anio (int): año sobre el que calcular.

        Returns:
            dict: balance por mes, balance actual y previsiones.
        """
        hoy = date.today()
        periodos = Periodo.objects.filter(fecha__year=anio).order_by("fecha")

        if anio < hoy.year:
            meses_restantes = 0
        elif anio == hoy.year:
            meses_restantes = 12 - hoy.month
        else:
            meses_restantes = 12

        balance_por_mes = []
        for periodo in periodos:
            movimientos_gasto = Movimiento.objects.filter(
                periodo=periodo,
                categoria__is_gasto=True,
            )
            gastos_total = float(sum(abs(mov.monto) for mov in movimientos_gasto))
            ingresos = float(periodo.ingreso_fijo or 0)
            balance = ingresos - gastos_total
            balance_por_mes.append({
                "periodo": periodo.nombre,
                "ingresos": ingresos,
                "gastos": gastos_total,
                "balance": balance,
            })

        balance_actual = sum(m["balance"] for m in balance_por_mes)
        valores_mensuales = [m["balance"] for m in balance_por_mes]

        if valores_mensuales and meses_restantes > 0:
            prev_maxima = balance_actual + max(valores_mensuales) * meses_restantes
            prev_minima = balance_actual + min(valores_mensuales) * meses_restantes
            prev_media = balance_actual + (sum(valores_mensuales) / len(valores_mensuales)) * meses_restantes
        else:
            prev_maxima = prev_minima = prev_media = balance_actual

        return {
            "balance_por_mes": balance_por_mes,
            "balance_actual": balance_actual,
            "prev_maxima": prev_maxima,
            "prev_minima": prev_minima,
            "prev_media": prev_media,
        }
