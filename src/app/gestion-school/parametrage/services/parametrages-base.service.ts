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

  // ------------------ annee scolaire service
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

  // ------------------ domaine service
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

  // ------------------ cycle service
  addCycle(cycle: any): Observable<any> {
    return this.http.post<any>(this.api + '/cycle', cycle);
  }

  getAllCycle(): Observable<any> {
    return this.http.get(this.api + '/cycle');
  }

  archiveCycle(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/cycle/' + id);
  }

  updateCycle(id: number, cycle: any): Observable<any> {
    return this.http.put<any>(this.api + '/cycle/' + id, cycle);
  }

  updateCycleStatus(status: boolean, id: any): Observable<any> {
    return this.http.put<any>(this.api + '/cycle/etat/' + id, {status: status + ''});
  }

  // ------------------ parcours service
  addParcours(parcours: any): Observable<any> {
    return this.http.post<any>(this.api + '/parcours', parcours);
  }

  getAllParcours(): Observable<any> {
    return this.http.get(this.api + '/parcours');
  }

  archiveParcours(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/parcours/' + id);
  }

  updateParcours(id: number, parcours: any): Observable<any> {
    return this.http.put<any>(this.api + '/parcours/' + id, parcours);
  }

  updateParcoursStatus(status: boolean, id: any): Observable<any> {
    return this.http.put<any>(this.api + '/parcours/etat/' + id, {status: status + ''});
  }

  // ------------------ horaire service
  addHoraire(horaire: any): Observable<any> {
    return this.http.post<any>(this.api + '/horaire', horaire);
  }

  getAllHoraire(): Observable<any> {
    return this.http.get(this.api + '/horaire');
  }

  archiveHoraire(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/horaire/' + id);
  }

  updateHoraire(id: number, horaire: any): Observable<any> {
    return this.http.put<any>(this.api + '/horaire/' + id, horaire);
  }

  // ------------------ document service
  addDocument(document: any): Observable<any> {
    return this.http.post<any>(this.api + '/document', document);
  }

  getAllDocument(): Observable<any> {
    return this.http.get(this.api + '/document');
  }

  archiveDocument(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/document/' + id);
  }

  updateDocument(id: number, document: any): Observable<any> {
    return this.http.put<any>(this.api + '/document/' + id, document);
  }

  // ------------------ mention service
  addMention(mention: any): Observable<any> {
    return this.http.post<any>(this.api + '/mention', mention);
  }

  getAllMention(): Observable<any> {
    return this.http.get(this.api + '/mention');
  }

  archiveMention(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/mention/' + id);
  }

  updateMention(id: number, mention: any): Observable<any> {
    return this.http.put<any>(this.api + '/mention/' + id, mention);
  }

  updateMentionStatus(status: boolean, id: any): Observable<any> {
    return this.http.put<any>(this.api + '/mention/etat/' + id, {status: status + ''});
  }

}
