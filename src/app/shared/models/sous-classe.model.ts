import { HoraireModel } from './horaire.model';
import { NiveauModel } from './niveau.model';
import { SpecialiteModel } from './specialite.model';

export class SousClasseModel {
  public id: number;
  public libelle: string;
  public nbrEleve: number;
  public etat: boolean;
  public archive: boolean;
  public niveau: NiveauModel;
  public specialite: SpecialiteModel;
  public horaire: HoraireModel;
}
