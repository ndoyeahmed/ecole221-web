import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ParametrageReferentielService {

  api = '/api/parametrage-referentiel';

  public downloadModelExcelBehaviorSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  // ------------------ REFERENTIEL service
  downloadFile(): Observable<any> {
    return this.http.get('/api/files-storage/referentiel-upload-model/download',
      {responseType: 'blob'}).pipe(map((response) => {
      return {
        filename: 'Referentiel_upload_model.xlsx',
        data: response
      };
    }));
  }

  // upload doc for inscription
  addReferentielByUploaded(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `/api/parametrage-referentiel/referentiel/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }


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

  sendListRecapReferentiel(listRecapReferentiel): Observable<any> {
    return this.http.post(this.api + '/get-recap-referentiel', listRecapReferentiel);
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

  getAllProgrammeModuleByReferentiel(referentielId: number): Observable<any> {
    return this.http.get(this.api + '/programme-module/programme-ue/referentiel/' + referentielId);
  }

  getAllProgrammeModuleByReferentielAndSemestre(referentielId: number, semestreId: number): Observable<any> {
    return this.http.get(this.api + '/programme-module/programme-ue/referentiel/'
      + referentielId + '/semestre/' + semestreId);
  }
}
