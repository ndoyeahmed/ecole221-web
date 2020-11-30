import { EtudiantModel } from './etudiant.model';
import { UtilisateurModel } from './utilisateur.model';
export class EtudiantTuteurModel {
  public id: number;
  public etudiant: EtudiantModel;
  public tuteur: UtilisateurModel;
}
