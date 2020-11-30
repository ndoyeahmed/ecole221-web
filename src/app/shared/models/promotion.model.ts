import { AnneeScolaireModel } from './annee-scolaire.model';
import { ReferentielModel } from 'src/app/shared/models/referentiel.model';
export class PromotionModel {
  public id: number;
  public description: string;
  public num: number;
  public referentiel: ReferentielModel;
  public anneeScolaire: AnneeScolaireModel;
}
