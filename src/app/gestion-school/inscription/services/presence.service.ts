import { Observable } from 'rxjs';
import { PresenceModel } from 'src/app/shared/models/presence.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  api = '/api/presence';

  constructor(private http: HttpClient) { }

  savePresence(presence: PresenceModel[]): Observable<PresenceModel[]> {
    return this.http.post<PresenceModel[]>(this.api, presence);
  }

  getAllPresenceByInscriptionAndEtat(idInscription: number, etat: boolean, idAnneeScolaire: number): Observable<any> {
    return this.http.get(this.api + '/inscription/' + idInscription + '/etat/' + etat + '/anneescolaire/' + idAnneeScolaire);
  }
}
