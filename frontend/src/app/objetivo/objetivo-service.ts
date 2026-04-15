import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

import { Objetivo } from './Objetivo';
import { MapCategoriaObjetivo } from './MapCategoriaObjetivo';

@Injectable({
  providedIn: 'root',
})
export class ObjetivoService {
  constructor(private http: HttpClient) { }

  appUrl = environment.apiUrl + 'objetivo/';
  appUrlMap = environment.apiUrl + 'objetivo/map/';

  // --- Objetivo ---

  getObjetivos(): Observable<Objetivo[]> {
    return this.http.get<Objetivo[]>(this.appUrl);
  }

  getObjetivo(id: number): Observable<Objetivo> {
    return this.http.get<Objetivo>(this.appUrl + id);
  }

  createObjetivo(objetivo: Objetivo): Observable<Objetivo> {
    const body = {
      nombre: objetivo.nombre,
      monto: objetivo.monto,
      prioridad: objetivo.prioridad,
      fecha: objetivo.fecha.toISOString().split('T')[0],
      is_cumplido: objetivo.is_cumplido,
    };
    return this.http.post<Objetivo>(this.appUrl, body);
  }

  updateObjetivo(id: number, objetivo: Objetivo): Observable<Objetivo> {
    const body = {
      nombre: objetivo.nombre,
      monto: objetivo.monto,
      prioridad: objetivo.prioridad,
      fecha: objetivo.fecha.toISOString().split('T')[0],
      is_cumplido: objetivo.is_cumplido,
    };
    return this.http.put<Objetivo>(this.appUrl + id, body);
  }

  deleteObjetivo(id: number): Observable<Objetivo> {
    return this.http.delete<Objetivo>(this.appUrl + id);
  }

  // --- MapCategoriaObjetivo ---

  getMapeos(): Observable<MapCategoriaObjetivo[]> {
    return this.http.get<MapCategoriaObjetivo[]>(this.appUrlMap);
  }

  createMapeo(mapeo: MapCategoriaObjetivo): Observable<MapCategoriaObjetivo> {
    const body = {
      fecha_inicio: mapeo.fecha_inicio.toISOString().split('T')[0],
      fecha_fin: mapeo.fecha_fin.toISOString().split('T')[0],
      categoria: mapeo.categoria?.id ?? null,
      objetivo: mapeo.objetivo?.id ?? null,
    };
    return this.http.post<MapCategoriaObjetivo>(this.appUrlMap, body);
  }

  updateMapeo(id: number, mapeo: MapCategoriaObjetivo): Observable<MapCategoriaObjetivo> {
    const body = {
      fecha_inicio: mapeo.fecha_inicio.toISOString().split('T')[0],
      fecha_fin: mapeo.fecha_fin.toISOString().split('T')[0],
      categoria: mapeo.categoria?.id ?? null,
      objetivo: mapeo.objetivo?.id ?? null,
    };
    return this.http.put<MapCategoriaObjetivo>(this.appUrlMap + id, body);
  }

  deleteMapeo(id: number): Observable<MapCategoriaObjetivo> {
    return this.http.delete<MapCategoriaObjetivo>(this.appUrlMap + id);
  }
}
