import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  api = '/api/notes/';
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
}
