import { NiveauModel } from './niveau.model';
import { SpecialiteModel } from './specialite.model';

export class SousClasseModel {
  public id: number;
  public libelle: string;
  public etat: boolean;
  public archive: boolean;
  public niveau: NiveauModel;
  public specialite: SpecialiteModel;
}
