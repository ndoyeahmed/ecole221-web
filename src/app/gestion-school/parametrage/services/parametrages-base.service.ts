import { DomaineModel } from './../../../shared/models/domaine.model';
import { AnneeScolaireModel } from './../../../shared/models/annee-scolaire.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametragesBaseService {

  api = '/api/parametrage-base';

  constructor(private http: HttpClient) { }

  getAllAnneeScolaire(): Observable<any> {
    return this.http.get(this.api + '/annee-scolaire');
  }

  addAnneeScolaire(anneeScolaire: AnneeScolaireModel): Observable<any> {
    return this.http.post<any>(this.api + '/annee-scolaire', anneeScolaire);
  }

  updateAnneeScolaire(anneeScolaire: AnneeScolaireModel, id: any): Observable<any> {
    return this.http.put<any>(this.api + '/annee-scolaire/' + id, anneeScolaire);
  }

  updateAnneeScolaireEnCoursStatus(status: boolean, id: any): Observable<any> {
    return this.http.put<any>(this.api + '/annee-scolaire/encours/' + id, {status: status + ''});
  }

  archiveAnneeScolaire(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/annee-scolaire/' + id);
  }

  addDomaine(domaine: DomaineModel): Observable<any> {
    return this.http.post<any>(this.api + '/domaine', domaine);
  }

  getAllDomaine(): Observable<any> {
    return this.http.get(this.api + '/domaine');
  }

  archiveDomaine(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/domaine/' + id);
  }

  updateDomaine(id: number, domaine: any): Observable<any> {
    return this.http.put<any>(this.api + '/domaine/' + id, domaine);
  }

  updateDomaineStatus(status: boolean, id: any): Observable<any> {
    return this.http.put<any>(this.api + '/domaine/etat/' + id, {status: status + ''});
  }

}
