import { UeModel } from './ue.model';
import { SemestreModel } from './semestre.model';
import { ReferentielModel } from './referentiel.model';
export class ProgrammeUEModel {
  public id: number;
  public code: string;
  public credit: number;
  public fondamental: number;
  public nbreHeureUE: number;
  public num: number;
  public archive: boolean;
  public referentiel: ReferentielModel;
  public semestre: SemestreModel;
  public ue: UeModel;
  public expanded = true;
  public expandedNew = true;
}
