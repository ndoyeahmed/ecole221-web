import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  api = '/api/notes/';
  public onGenerateAllBulletinClasse = new BehaviorSubject<any>([]);
  public onGenerateAllBulletin = new BehaviorSubject<any>([]);
  constructor(private http: HttpClient) { }

  getAllNotesByInscriptionAnneeScolaire(anneeScolaireId: number): Observable<any> {
    return this.http.get(this.api + 'inscription/anneescolaire/' + anneeScolaireId);
  }

  getAllNoteProgrammeModuleByInscriptionAnneeScolaireAndProgrammeModule(anneeScolaireId: number,
                                                                        programmeModuleId: number): Observable<any> {
    return this.http
      .get(this.api + 'note-programme-module/programme-module/' + programmeModuleId + '/inscription/anneescolaire/' + anneeScolaireId);
  }

  getAllNoteProgrammeModuleByInscription(inscriptionId: number): Observable<any> {
    return this.http.get(this.api + 'note-programme-module/inscription/' + inscriptionId );
  }

  // get All NoteProgrammeModule by Inscription Classe Referentiel and semestre
  getAllNoteProgrammeModuleByInsClasseSemestre(inscriptionId: number,
                                               classeId: number,
                                               semestreId: number): Observable<any> {
    return this.http.get(this.api + 'note-programme-module/inscription/' + inscriptionId
      + '/classe/' + classeId + '/semestre/' + semestreId);
  }

  updateNote(note, programmeModuleId): Observable<any> {
    return this.http.put(this.api + 'programme-module/' + programmeModuleId, note);
  }

  updateMoyenneDevoir(noteId: number, note): Observable<any> {
    return this.http.put(this.api + noteId, note);
  }

  getAllDevoirsByNote(noteId: number): Observable<any> {
    return this.http.get(this.api + 'devoirs/note/' + noteId);
  }

  addDevoir(devoir): Observable<any> {
    return this.http.post(this.api + 'devoirs', devoir);
  }

  addDevoirList(devoirs): Observable<any> {
    return this.http.post(this.api + 'devoirs-list', devoirs);
  }

  updateDevoir(devoirId: number, devoir): Observable<any> {
    return this.http.put(this.api + 'devoirs/' + devoirId, devoir);
  }

  // ----------------------- programme UE inscription --------------

  getAllProgrammeUEInscriptionByInscription(idInscription: number): Observable<any> {
    return this.http.get(this.api + 'bulletin/programmeue-inscription/inscription/' + idInscription);
  }

  // ------------------ bulletin -----------------------

  getRecapNoteProgrammeModuleByProgrammeUE(inscriptionId: number): Observable<any> {
    return this.http.get(this.api + 'bulletin/inscription/' + inscriptionId);
  }

  getRecapNoteProgrammeModuleByProgrammeUEAndSemestre(inscriptionId: number, semestreId: number): Observable<any> {
    return this.http.get(this.api + 'bulletin/inscription/' + inscriptionId + '/semestre/' + semestreId);
  }

  getBulletinRecapByInscription(inscriptionId: number): Observable<any> {
    return this.http.get(this.api + 'bulletin-recap/inscription/' + inscriptionId);
  }

  // ------------------------------ recap semestre inscription valide -----------------------------------------------
  getRecapSemestreInscriptionValideByInscriptionEtudiant(etudiantId): Observable<any> {
    return this.http.get(this.api + 'recap-semestre-inscription-valide/inscription/etudiant/' + etudiantId);
  }

  getSumRecapSemestreInscriptionValideByInscription(inscriptionId): Observable<any> {
    return this.http.get(this.api + 'recap-semestre-inscription-valide/somme-credit/inscription/' + inscriptionId);
  }
}
