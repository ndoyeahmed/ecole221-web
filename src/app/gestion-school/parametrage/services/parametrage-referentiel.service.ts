import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametrageReferentielService {

  api = '/api/parametrage-referentiel';

  constructor(private http: HttpClient) { }

  // ------------------ REFERENTIEL service
  addReferentiel(referentiel: any): Observable<any> {
    return this.http.post<any>(this.api + '/referentiel', referentiel);
  }

  cloneReferentiel(oldReferenrielId: any, referentiel: any): Observable<any> {
    return this.http.post<any>(this.api + '/referentiel/' + oldReferenrielId, {
      description: referentiel.description,
      annee: referentiel.annee + '',
      credit: referentiel.credit + '',
      volumeHeureTotal: referentiel.volumeHeureTotal + '',
      niveau: referentiel.niveau.id + '',
      specialite: referentiel.specialite.id + '',
    });
  }

  getAllReferentiel(): Observable<any> {
    return this.http.get(this.api + '/referentiel');
  }

  getAllReferentielByNiveau(niveauId: number): Observable<any> {
    return this.http.get(this.api + '/referentiel/niveau/' + niveauId);
  }

  getAllReferentielBySpecialite(specialiteId: number): Observable<any> {
    return this.http.get(this.api + '/referentiel/specialite/' + specialiteId);
  }

  getAllReferentielByNiveauAndSpecialite(niveauId: number, specialiteId: number): Observable<any> {
    return this.http.get(this.api + '/referentiel/niveau-specialite/' + niveauId + '/' + specialiteId);
  }

  archiveReferentiel(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/referentiel/' + id);
  }

  updateReferentiel(id: any, referentiel: any): Observable<any> {
    return this.http.put<any>(this.api + '/referentiel/' + id, referentiel);
  }

  getReferentielByNiveauAndSpecialiteAndAnnee(body: any): Observable<any> {
    return this.http.put<any>(this.api + '/referentiel/niveau/specialite/annee', body);
  }

  // ------------------ PROGRAMME UE service
  addProgrammeUE(programmeUE: any): Observable<any> {
    return this.http.post<any>(this.api + '/programme-ue', programmeUE);
  }

  getAllProgrammeUE(): Observable<any> {
    return this.http.get(this.api + '/programme-ue');
  }

  getAllProgrammeUEByReferentiel(referentielId: number): Observable<any> {
    return this.http.get(this.api + '/programme-ue/referentiel/' + referentielId);
  }

  getAllProgrammeUEBySemestre(semestreId: number): Observable<any> {
    return this.http.get(this.api + '/programme-ue/semestre/' + semestreId);
  }

  getAllProgrammeUEByReferentielAndSemestre(referentielId: number, semestreId: number): Observable<any> {
    return this.http.get(this.api + '/programme-ue/referentiel/semestre/' + referentielId + '/' + semestreId);
  }

  archiveProgrammeUE(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/programme-ue/' + id);
  }

  updateProgrammeUE(id: any, programmeUE: any): Observable<any> {
    return this.http.put<any>(this.api + '/programme-ue/' + id, programmeUE);
  }

  // ------------------ PROGRAMME MODULE service
  addProgrammeModule(programmeModule: any): Observable<any> {
    return this.http.post<any>(this.api + '/programme-module', programmeModule);
  }

  getAllProgrammeModule(): Observable<any> {
    return this.http.get(this.api + '/programme-module');
  }

  getAllProgrammeModuleByModule(moduleId: number): Observable<any> {
    return this.http.get(this.api + '/programme-module/module/' + moduleId);
  }

  getAllProgrammeModuleByProgrammeUE(programmeUEId: number): Observable<any> {
    return this.http.get(this.api + '/programme-module/programme-ue/' + programmeUEId);
  }

  getAllProgrammeModuleByModuleAndProgrammeUE(moduleId: number, programmeUEId: number): Observable<any> {
    return this.http.get(this.api + '/programme-module/module/programme-ue/' + moduleId + '/' + programmeUEId);
  }

  archiveProgrammeModule(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/programme-module/' + id);
  }

  updateProgrammeModule(id: any, programmeModule: any): Observable<any> {
    return this.http.put<any>(this.api + '/programme-module/' + id, programmeModule);
  }
}
