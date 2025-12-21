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
    if (periodo.id) {
      const postBody = {
        "nombre": periodo.getNombre(),
        "fecha": periodo.getFechaAsString()
      }
      return this.http.put<Periodo>(this.appUrl + periodo.id, postBody);

    } else {
      const postBody = {
        "nombre": periodo.getNombre(),
        "fecha": periodo.getFechaAsString()
      }
      return this.http.post<Periodo>(this.appUrl, postBody);
    }
  }

  deletePeriodo(periodo: Periodo): Observable<Periodo> {
    return this.http.delete<Periodo>(this.appUrl + periodo.id);
  }

}
