import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PeriodoService {
  constructor(private http: HttpClient) { }

  appUrl = environment.apiUrl + 'periodo/'

  getPeriodos() {
    
    return this.http.get<any[]>(this.appUrl);
  }

}
