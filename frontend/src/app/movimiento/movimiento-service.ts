import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Movimiento } from './movimiento';

export interface FiltrosMovimiento {
  fecha_desde?: string;
  fecha_hasta?: string;
  categoria_id?: number | null;
  is_gasto?: boolean | null;
  concepto?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MovimientoService {

  constructor(private http: HttpClient) { }

  appUrl = environment.apiUrl + 'movimiento/';

  getMovimientos(filtros?: FiltrosMovimiento): Observable<Movimiento[]> {
    if (!filtros) {
      return this.http.get<Movimiento[]>(this.appUrl);
    }
    let params = new HttpParams();
    if (filtros.fecha_desde) params = params.set('fecha_desde', filtros.fecha_desde);
    if (filtros.fecha_hasta) params = params.set('fecha_hasta', filtros.fecha_hasta);
    if (filtros.categoria_id != null) params = params.set('categoria_id', filtros.categoria_id.toString());
    if (filtros.is_gasto != null) params = params.set('is_gasto', filtros.is_gasto.toString());
    if (filtros.concepto) params = params.set('concepto', filtros.concepto);
    return this.http.get<Movimiento[]>(this.appUrl, { params });
  }

  saveMovimiento(movimiento: Movimiento): Observable<Movimiento> {
    const body = {
      "concepto": movimiento.concepto,
      "monto": movimiento.monto,
      "fecha": movimiento.fecha,
      "recurrente": movimiento.recurrente,
      "notas": movimiento.notas,
      "periodo": movimiento.periodo?.id ?? null,
      "categoria": movimiento.categoria?.id ?? null
    }
    if (movimiento.id) {
      return this.http.put<Movimiento>(this.appUrl + movimiento.id, body);
    } else {
      return this.http.post<Movimiento>(this.appUrl, body);
    }
  }

  deleteMovimiento(movimiento: Movimiento): Observable<Movimiento> {
    return this.http.delete<Movimiento>(this.appUrl + movimiento.id);
  }

  uploadExcel(file: File): Observable<{ message: string }> {
    const formData = new FormData();
    formData.append('excel', file);
    return this.http.post<{ message: string }>(this.appUrl + 'excel', formData);
  }

  exportarMovimientos(filtros?: FiltrosMovimiento): Observable<Blob> {
    let params = new HttpParams();
    if (filtros) {
      if (filtros.fecha_desde) params = params.set('fecha_desde', filtros.fecha_desde);
      if (filtros.fecha_hasta) params = params.set('fecha_hasta', filtros.fecha_hasta);
      if (filtros.categoria_id != null) params = params.set('categoria_id', filtros.categoria_id.toString());
      if (filtros.is_gasto != null) params = params.set('is_gasto', filtros.is_gasto.toString());
      if (filtros.concepto) params = params.set('concepto', filtros.concepto);
    }
    return this.http.get(this.appUrl + 'exportar/', { params, responseType: 'blob' });
  }

}
