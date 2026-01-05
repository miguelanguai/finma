import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

import { Periodo } from './periodo';

@Injectable({
  providedIn: 'root',
})
export class PeriodoService {
  constructor(private http: HttpClient) { }

  appUrl = environment.apiUrl + 'periodo/'

  getPeriodos(): Observable<Periodo[]> {

    return this.http.get<Periodo[]>(this.appUrl);
  }

  savePeriodo(periodo: Periodo): Observable<Periodo> {

    const body = {
      "nombre": periodo.getNombre(),
      "fecha": periodo.getFechaAsString(),
      "ingreso_fijo": periodo.ingreso_fijo,
      "ingreso_estimado": periodo.ingreso_estimado
    }
    if (periodo.id) {
      return this.http.put<Periodo>(this.appUrl + periodo.id, body);
    } else {
      console.log(body);
      
      return this.http.post<Periodo>(this.appUrl, body);
    }
  }

  deletePeriodo(periodo: Periodo): Observable<Periodo> {
    return this.http.delete<Periodo>(this.appUrl + periodo.id);
  }

}
