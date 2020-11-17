import { SpecialiteModel } from './specialite.model';
import { NiveauModel } from './niveau.model';
export class ReferentielModel {
  public id: number;
  public description: string;
  public annee: number;
  public credit: number;
  public volumeHeureTotal: number;
  public date: any;
  public expanded = true;
  public expandedNew = true;
  public archive: boolean;
  public niveau: NiveauModel;
  public specialite: SpecialiteModel;
  public affected: number;
}
