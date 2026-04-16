import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Movimiento } from './movimiento';

@Injectable({
  providedIn: 'root',
})
export class MovimientoService {

  constructor(private http: HttpClient) { }

  appUrl = environment.apiUrl + 'movimiento/';

  getMovimientos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(this.appUrl);
  }

  saveMovimiento(movimiento: Movimiento): Observable<Movimiento> {
    const body = {
      "concepto": movimiento.concepto,
      "monto": movimiento.monto,
      "fecha": movimiento.fecha,
      "recurrente": movimiento.recurrente,
      "notas": movimiento.notas,
      "periodo": movimiento.periodo,
      "categoria": movimiento.categoria
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

}
