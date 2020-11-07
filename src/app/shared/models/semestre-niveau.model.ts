import { SemestreModel } from './semestre.model';
import { NiveauModel } from './niveau.model';

export class SemestreNiveauModel {
  public id: number;
  public enCours: boolean;
  public archive: boolean;
  public niveau: NiveauModel;
  public semestre: SemestreModel;
}
