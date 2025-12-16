import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PeriodoService {
  constructor(private http: HttpClient) { }

  appUrl = environment.apiUrl + 'periodo/'

  getPeriodos() : Observable<Periodo[]>{
    
    return this.http.get<Periodo[]>(this.appUrl);
  }

}
