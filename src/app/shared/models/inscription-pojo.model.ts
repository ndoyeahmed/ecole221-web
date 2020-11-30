import { DocumentModel } from 'src/app/shared/models/document.model';
import { UtilisateurModel } from './utilisateur.model';
import { SousClasseModel } from 'src/app/shared/models/sous-classe.model';
import { InscriptionModel } from './inscription.model';
import { EtudiantModel } from './etudiant.model';

export class InscriptionPojoModel {
  public etudiant: EtudiantModel;
  public inscription: InscriptionModel;
  public sousClasse: SousClasseModel;
  public pere: UtilisateurModel;
  public mere: UtilisateurModel;
  public tuteur: UtilisateurModel;
  public documents: DocumentModel[];
}
