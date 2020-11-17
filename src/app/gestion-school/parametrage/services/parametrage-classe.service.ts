import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametrageClasseService {
  api = '/api/parametrage-classe';
  constructor(private http: HttpClient) { }

  // ------------------ CLASSE service
  addClasse(classe: any): Observable<any> {
    return this.http.post<any>(this.api + '/classe', classe);
  }

  getAllClasse(): Observable<any> {
    return this.http.get(this.api + '/classe');
  }

  getAllClasseByNiveau(niveauId: number): Observable<any> {
    return this.http.get(this.api + '/classe/niveau/' + niveauId);
  }

  getAllClasseBySpecialite(specialiteId: number): Observable<any> {
    return this.http.get(this.api + '/classe/specialite/' + specialiteId);
  }

  getAllClasseByNiveauAndSpecialite(niveauId: number, specialiteId: number): Observable<any> {
    return this.http.get(this.api + '/classe/niveau-specialite/' + niveauId + '/' + specialiteId);
  }

  archiveClasse(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/classe/' + id);
  }

  updateClasse(id: any, classe: any): Observable<any> {
    console.log(classe);
    return this.http.put<any>(this.api + '/classe/' + id,
    {
      libelle: classe.libelle,
      niveauId: classe.niveau.id + '',
      specialiteId: classe.specialite.id + '',
      horaireId: classe.horaire.id + ''
    });
  }

  updateClasseStatus(statut: any, id: any): Observable<any> {
    return this.http.put<any>(this.api + '/classe/etat/' + id, {status: statut + ''});
  }

  // ------------------ SOUS CLASSE service
  addSousClasse(sousClasse: any): Observable<any> {
    return this.http.post<any>(this.api + '/sous-classe', sousClasse);
  }

  getAllSousClasse(): Observable<any> {
    return this.http.get(this.api + '/sous-classe');
  }

  getAllSousClasseByNiveau(niveauId: number): Observable<any> {
    return this.http.get(this.api + '/sous-classe/niveau/' + niveauId);
  }

  getAllSousClasseBySpecialite(specialiteId: number): Observable<any> {
    return this.http.get(this.api + '/sous-classe/specialite/' + specialiteId);
  }

  getAllSousClasseByNiveauAndSpecialite(niveauId: number, specialiteId: number): Observable<any> {
    return this.http.get(this.api + '/sous-classe/niveau-specialite/' + niveauId + '/' + specialiteId);
  }

  archiveSousClasse(id: any): Observable<any> {
    return this.http.delete<any>(this.api + '/sous-classe/' + id);
  }

  updateSousClasse(id: any, sousclasse: any): Observable<any> {
    return this.http.put<any>(this.api + '/sous-classe/' + id,
    {
      libelle: sousclasse.libelle,
      niveauId: sousclasse.niveau.id + '',
      specialiteId: sousclasse.specialite.id + '',
      horaireId: sousclasse.horaire.id + ''
    });
  }

  updateSousClasseStatus(statut: any, id: any): Observable<any> {
    return this.http.put<any>(this.api + '/sous-classe/etat/' + id, {status: statut + ''});
  }

  // ------------------ CLASSE REFERENTIEL service
  addClasseReferentiel(classeReferentiel: any[]): Observable<any> {
    return this.http.post<any>(this.api + '/classe-referentiel', classeReferentiel);
  }

  getClasseReferentielByClasseAndReferentiel(classeId: number, referentielId: number): Observable<any> {
    return this.http.get(this.api + '/classe-referentiel/classe/' + classeId + '/referentiel/' + referentielId);
  }

  getFirstClasseReferentielByReferentiel(referentielId: number): Observable<any> {
    return this.http.get(this.api + '/classe-referentiel/referentiel/' + referentielId);
  }

  getAllClasseReferentielByClasse(classeId: number): Observable<any> {
    return this.http.get(this.api + '/classe-referentiel/classe/' + classeId);
  }

  getAllClasseReferentiel(): Observable<any> {
    return this.http.get(this.api + '/classe-referentiel');
  }
}
