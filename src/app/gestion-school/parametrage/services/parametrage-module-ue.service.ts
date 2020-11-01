import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametrageModuleUeService {

  api = '/api/parametrage-module-ue';

  constructor(private http: HttpClient) { }

  // ------------------ MODULE service
  addModule(module: any): Observable<any> {
    return this.http.post<any>(this.api + '/modules', module);
  }

  getAllModule(): Observable<any> {
    return this.http.get(this.api + '/modules');
  }

  updateModuleStatus(status: boolean, id: any): Observable<any> {
    return this.http.put<any>(this.api + '/modules/etat/' + id, {status: status + ''});
  }

  updateModule(id: number, module: any): Observable<any> {
    return this.http.put<any>(this.api + '/modules/' + id, module);
  }

  archiveModule(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/modules/' + id);
  }

  // ------------------ MENTION MODULE service
  addMentionModule(mentionModule: any[]): Observable<any> {
    return this.http.post<any>(this.api + '/mention-module', mentionModule);
  }

  getAllMentionModuleByModule(moduleId: number): Observable<any> {
    return this.http.get(this.api + '/mention-module/module/' + moduleId);
  }

  // ------------------ UE service
  addUE(ue: any): Observable<any> {
    return this.http.post<any>(this.api + '/ue', ue);
  }

  getAllUE(): Observable<any> {
    return this.http.get(this.api + '/ue');
  }

  updateUEStatus(status: boolean, id: any): Observable<any> {
    return this.http.put<any>(this.api + '/ue/etat/' + id, {status: status + ''});
  }

  updateUE(id: number, ue: any): Observable<any> {
    return this.http.put<any>(this.api + '/ue/' + id, ue);
  }

  archiveUE(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/ue/' + id);
  }

  // ------------------ MENTION UE service
  addMentionUE(mentionUE: any[]): Observable<any> {
    return this.http.post<any>(this.api + '/mention-ue', mentionUE);
  }

  getAllMentionUEByUE(ueId: number): Observable<any> {
    return this.http.get(this.api + '/mention-ue/ue/' + ueId);
  }

}
