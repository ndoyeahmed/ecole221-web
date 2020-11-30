import { ProfilModel } from './profil.model';
export class UtilisateurModel {
  public id: number;
  public cin: string;
  public nom: string;
  public prenom: string;
  public adresse: string;
  public telephone: string;
  public email: string;
  public profession: string;
  public etat: boolean;
  public archive: boolean;
  public login: string;
  public password: string;
  public fonction: string;
  public profil: ProfilModel;
}
