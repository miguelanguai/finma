import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  BalanceAnualResponse,
  ComparativaResponse,
  GastoCategoriaResponse,
  ProgresoObjetivoResponse,
  ResumenLandingResponse,
} from './analisis-response';

@Injectable({
  providedIn: 'root',
})
export class AnalisisService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiUrl + 'analisis/';

  getProgresoObjetivos(): Observable<ProgresoObjetivoResponse[]> {
    return this.http.get<ProgresoObjetivoResponse[]>(this.baseUrl + 'objetivos/');
  }

  getGastosCategorias(anio: number): Observable<GastoCategoriaResponse[]> {
    return this.http.get<GastoCategoriaResponse[]>(
      `${this.baseUrl}categorias/?anio=${anio}`
    );
  }

  getBalance(anio: number): Observable<BalanceAnualResponse> {
    return this.http.get<BalanceAnualResponse>(
      `${this.baseUrl}balance/?anio=${anio}`
    );
  }

  getResumen(): Observable<ResumenLandingResponse> {
    return this.http.get<ResumenLandingResponse>(this.baseUrl + 'resumen/');
  }

  getComparativa(periodo1Id: number, periodo2Id: number): Observable<ComparativaResponse> {
    return this.http.get<ComparativaResponse>(
      `${this.baseUrl}comparativa/?periodo1=${periodo1Id}&periodo2=${periodo2Id}`
    );
  }
}
