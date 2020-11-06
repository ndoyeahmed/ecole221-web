import { ReferentielModel } from './referentiel.model';
import { ClasseModel } from './classe.model';
import { AnneeScolaireModel } from './annee-scolaire.model';
export class ClasseReferentielModel {
  public id: number;
  public anneeDebut: number;
  public anneeFin: number;
  public archive: boolean;
  public anneeScolaire: AnneeScolaireModel;
  public classe: ClasseModel;
  public referentiel: ReferentielModel;
}
