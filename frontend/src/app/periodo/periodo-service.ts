import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PeriodoService {
  constructor(private http: HttpClient) { }

  getPeriodos() {
    return this.http.get<any[]>('http://localhost:8000/periodo/');
  }

}
