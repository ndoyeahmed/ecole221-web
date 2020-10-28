import { DocumentParNiveauModel } from './document-par-niveau.model';
import { SemestreNiveauModel } from 'src/app/shared/models/semestre-niveau.model';
import { ParcoursModel } from './parcours.model';
import { SemestreModel } from './semestre.model';
import { CycleModel } from './cycle.model';

export class NiveauModel {
  public id: number;
  public libelle: string;
  public niveau: number;
  public etat: boolean;
  public archive: boolean;
  public cycle: CycleModel;
  public semestre: SemestreModel;
  public parcours: ParcoursModel;
  public semestreNiveaus: SemestreNiveauModel[];
  public documentParNiveaus: DocumentParNiveauModel[];
}
