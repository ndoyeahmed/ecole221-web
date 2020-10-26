import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametragesSpecialiteService {
  api = '/api/parametrage-specialite';

  constructor(private http: HttpClient) { }

   // ------------------ domaine service
   addSemestre(semestre: any): Observable<any> {
    return this.http.post<any>(this.api + '/semestre', semestre);
  }

  getAllSemestre(): Observable<any> {
    return this.http.get(this.api + '/semestre');
  }

  archiveSemestre(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/semestre/' + id);
  }

  updateSemestre(id: number, semestre: any): Observable<any> {
    return this.http.put<any>(this.api + '/semestre/' + id, semestre);
  }

  updateSemestreStatus(status: boolean, id: any): Observable<any> {
    return this.http.put<any>(this.api + '/semestre/etat/' + id, {status: status + ''});
  }
}
