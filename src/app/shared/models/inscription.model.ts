import { EtudiantModel } from './etudiant.model';
import { AnneeScolaireModel } from './annee-scolaire.model';
import { SousClasseModel } from 'src/app/shared/models/sous-classe.model';
import { PromotionModel } from './promotion.model';

export class InscriptionModel {
  public id: number;
  public date: any;
  public passe: number;
  public archive: boolean;
  public promotion: PromotionModel;
  public sousClasse: SousClasseModel;
  public anneeScolaire: AnneeScolaireModel;
  public etudiant: EtudiantModel;
}
