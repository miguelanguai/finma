import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

import { Categoria } from './Categoria';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  constructor(private http: HttpClient) { }

  appUrl = environment.apiUrl + 'categoria/'

  getCategorias(): Observable<Categoria[]> {

    return this.http.get<Categoria[]>(this.appUrl);
  }

  saveCategoria(categoria: Categoria): Observable<Categoria> {
    if (categoria.id) {
      const putBody = {
        "nombre": categoria.nombre,
        "is_gasto": categoria.is_gasto,
        "padre": categoria.padre,
      }
      return this.http.put<Categoria>(this.appUrl + categoria.id, putBody);

    } else {
      const postBody = {
        "nombre": categoria.nombre,
        "is_gasto": categoria.is_gasto,
        "padre": categoria.padre,
      }
      return this.http.post<Categoria>(this.appUrl, postBody);
    }
  }

  deleteCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.delete<Categoria>(this.appUrl + categoria.id);
  }
}
