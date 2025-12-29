import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

import { Categoria } from '../categoria/Categoria';
import { MapPeriodoCategoria } from './MapPeriodoCategoria';

@Injectable({
  providedIn: 'root',
})
export class MapCatPerService {
  constructor(private http: HttpClient) { }

  appUrl = environment.apiUrl + 'periodo/map/';
  appUrl2 = environment.apiUrl + 'periodo/map/filter/';

  getMapPeriodoCategorias(): Observable<MapPeriodoCategoria[]> {

    return this.http.get<MapPeriodoCategoria[]>(this.appUrl);
  }

  getMapPeriodoCategoriasFiltered(map_filter: MapPeriodoCategoria):Observable<MapPeriodoCategoria[]>{
    const BODY = {
      "porc_ideal_fijo": map_filter.porc_ideal_fijo,
      "porc_ideal_estimado": map_filter.porc_ideal_estimado,
      "porc_ideal_obtenido": map_filter.porc_ideal_obtenido,
      "periodo": map_filter.periodo?.id || null,
      "categoria": map_filter.categoria?.id || null
    }
    console.log(BODY);
    
    return this.http.post<MapPeriodoCategoria[]>(this.appUrl2, BODY);
  }

  saveMapPeriodoCategoria(map: MapPeriodoCategoria): Observable<MapPeriodoCategoria> {
    const BODY = {
      "porc_ideal_fijo": map.porc_ideal_fijo,
      "porc_ideal_estimado": map.porc_ideal_estimado,
      "porc_ideal_obtenido": map.porc_ideal_obtenido,
      "periodo": map.periodo?.id || null,
      "categoria": map.categoria?.id || null
    }
    if (map.id) {
      return this.http.put<MapPeriodoCategoria>(this.appUrl + map.id, BODY);
    } else {
      return this.http.post<MapPeriodoCategoria>(this.appUrl, BODY);
    }
  }

  deleteMapPeriodoCategoria(map: MapPeriodoCategoria): Observable<MapPeriodoCategoria> {
    return this.http.delete<MapPeriodoCategoria>(this.appUrl + map.id);
  }
}
