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

  // ------------------ NIVEAU service
  addNiveau(niveau: any): Observable<any> {
    return this.http.post<any>(this.api + '/niveau', niveau);
  }

  getAllNiveau(): Observable<any> {
    return this.http.get(this.api + '/niveau');
  }

  updateNiveau(id: number, niveau: any): Observable<any> {
    return this.http.put<any>(this.api + '/niveau/' + id, niveau);
  }

  updateNiveauStatus(status: boolean, id: any): Observable<any> {
    return this.http.put<any>(this.api + '/niveau/etat/' + id, {status: status + ''});
  }

  archiveNiveau(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/niveau/' + id);
  }

  // ------------------ DOCUMENT PAR NIVEAU service
  addDocumentParNiveau(documentParNiveau: any): Observable<any> {
    return this.http.post<any>(this.api + '/document-par-niveau', documentParNiveau);
  }

  getAllDocumentParNiveauByNiveau(niveauId: number): Observable<any> {
    return this.http.get(this.api + '/document-par-niveau/niveau/' + niveauId);
  }

  getAllDocumentParNiveauByNiveauAndFournir(status: boolean, id: any): Observable<any> {
    return this.http.put<any>(this.api + '/document-par-niveau/niveau/fournir/' + id, {status: status + ''});
  }

  archiveDocumentNiveau(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/document-par-niveau/' + id);
  }

  // ------------------ SEMESTRE NIVEAU service
  addSemestreNiveau(semestreNiveau: any[]): Observable<any> {
    return this.http.post<any>(this.api + '/semestre-niveau', semestreNiveau);
  }

  getAllSemestreNiveauByNiveau(niveauId: number): Observable<any> {
    return this.http.get(this.api + '/semestre-niveau/niveau/' + niveauId);
  }

  getSemestreNiveauEncoursByNiveau(niveauId: number): Observable<any> {
    return this.http.get(this.api + '/semestre-niveau/encours/niveau/' + niveauId);
  }

  updateSemestreNiveauEncours(status: boolean, id: any): Observable<any> {
    return this.http.put<any>(this.api + '/semestre-niveau/encours/' + id, {status: status + ''});
  }

  archiveSemestreNiveau(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/semestre-niveau/' + id);
  }

  // ------------------ SPECIALITE service
  addSpecialite(specialite: any): Observable<any> {
    return this.http.post<any>(this.api + '/specialite', specialite);
  }

  getAllSpecialite(): Observable<any> {
    return this.http.get(this.api + '/specialite');
  }

  updateSpecialiteStatus(status: boolean, id: any): Observable<any> {
    return this.http.put<any>(this.api + '/specialite/etat/' + id, {status: status + ''});
  }

  updateSpecialite(id: number, specialite: any): Observable<any> {
    return this.http.put<any>(this.api + '/specialite/' + id, specialite);
  }

  archiveSpecialite(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/specialite/' + id);
  }

  // ------------------ NIVEAU SPECIALITE service
  addNiveauSpecialite(niveauSpecialite: any[]): Observable<any> {
    return this.http.post<any>(this.api + '/niveau-specialite', niveauSpecialite);
  }

  getAllNiveauSpecialiteBySpecialite(specialiteId: number): Observable<any> {
    return this.http.get(this.api + '/niveau-specialite/specialite/' + specialiteId);
  }

  getAllNiveauSpecialiteByNiveau(niveauId: number): Observable<any> {
    return this.http.get(this.api + '/niveau-specialite/niveau/' + niveauId);
  }

  archiveNiveauSpecialite(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/niveau-specialite/' + id);
  }
}
