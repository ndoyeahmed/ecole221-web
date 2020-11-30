import { PaysModel } from './pays.model';
export class EtudiantModel {
  public id: number;
  public matricule: string;
  public cin: string;
  public abandon: number;
  public nom: string;
  public prenom: string;
  public telephone: string;
  public email: string;
  public emailPro: string;
  public lieuNaissance: string;
  public dateNaissance: any;
  public genre: string;
  public etablissementPrecedent: string;
  public motifEntree: string;
  public niveauEntree: string;
  public metier: string;
  public ambition: string;
  public autresRenseignements: string;
  public photo: string;
  public pays: PaysModel;
}
