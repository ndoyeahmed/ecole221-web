import { NiveauModel } from './niveau.model';
import { SpecialiteModel } from './specialite.model';

export class NiveauSpecialiteModel {
  public id: number;
  public archive: boolean;
  public specialite: SpecialiteModel;
  public niveau: NiveauModel;
}
