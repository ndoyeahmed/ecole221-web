import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProfesseurModel} from '../../../shared/models/professeur.model';

@Injectable({
  providedIn: 'root'
})
export class ProfesseurService {

  api = '/api/professeur/';
  constructor(private http: HttpClient) { }

  getAllTypeContrat(): Observable<any> {
    return this.http.get(this.api + 'type-contrat');
  }

  addProfesseur(professeur: ProfesseurModel, cvFilename: string, cvFiletype: string): Observable<any> {
    const httpParams = new HttpParams()
      .append('filename', cvFilename)
      .append('filetype', cvFiletype);
    return this.http.post<any>(this.api, professeur, {params: httpParams});
  }

  addContrat(contrat, contratFilename: string): Observable<any> {
    const httpParams = new HttpParams()
      .append('filename', contratFilename);
    return this.http.post(this.api + 'contrat', contrat,
      {params: httpParams});
  }

  addProfesseurModuleList(professeurModuleList): Observable<any> {
    return this.http.post(this.api + 'professeur-module-list', professeurModuleList);
  }

  professeurList(): Observable<any> {
    return this.http.get(this.api);
  }

  professeurModuleListByProfesseur(professeurId): Observable<any> {
    return this.http.get(this.api + 'professeur-module/professeur/' + professeurId);
  }

  archiveProfesseur(professeurId): Observable<any> {
    return this.http.delete(this.api + professeurId);
  }

  getContratByProfesseurId(professeurId): Observable<any> {
    return this.http.get(this.api + 'contrat/professeur/' + professeurId);
  }

  getProfesseurById(professeurId): Observable<any> {
    return this.http.get(this.api + professeurId);
  }
}
