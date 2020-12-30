import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {

  api = '/api/inscription';

  constructor(private http: HttpClient) { }

  inscription(body: any): Observable<any> {
    return this.http.post<any>(this.api + '/inscription', body);
  }

  getAllInscription(): Observable<any> {
    return this.http.get<any>(this.api + '/inscription');
  }

  getInscriptionById(id): Observable<any> {
    return this.http.get<any>(this.api + '/inscription/' + id);
  }

  getInscriptionByCinEtudiant(cin: string): Observable<any> {
    return this.http.get<any>(this.api + '/etudiant/cin/' + cin);
  }

  getParentByCinAndProfil(cin: string, profil: string): Observable<any>{
    return this.http.get<any>(this.api + '/utilisateur/parent/' + profil + '/' + cin);
  }

  changeEtudiantClasse(body: any): Observable<any>{
    return this.http.put<any>(this.api + '/etudiant/change/classe', body);
  }

  getAllEtudiantInscriptionByIdInscription(idInscription): Observable<any> {
    return this.http.get<any>(this.api + '/etudiant/inscriptions/' + idInscription);
  }

  // upload doc for inscription
  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `/api/files-storage/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`/api/files-storage/files`);
  }
}
