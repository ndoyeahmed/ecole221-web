import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {

  api = '/api/inscription';

  constructor(private http: HttpClient) { }

  inscription(body: any): Observable<any> {
    return this.http.post<any>(this.api + '/inscription', body);
  }

  getAllInscription(): Observable<any> {
    return this.http.get<any>(this.api + '/inscription');
  }
}
