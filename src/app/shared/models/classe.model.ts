import { SpecialiteModel } from './specialite.model';
import { NiveauModel } from './niveau.model';
import { HoraireModel } from './horaire.model';
export class ClasseModel {
  public id: number;
  public libelle: string;
  public etat: boolean;
  public archive: boolean;
  public horaire: HoraireModel;
  public niveau: NiveauModel;
  public specialite: SpecialiteModel;
  public affected: boolean;
}
