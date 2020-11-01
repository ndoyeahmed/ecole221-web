import { NiveauSpecialiteModel } from './niveau-specialite.model';
import { MentionModel } from './mention.model';

export class SpecialiteModel {
  public id: number;
  public libelle: string;
  public num: string;
  public archive: boolean;
  public etat: boolean;
  public mention: MentionModel;
  public niveauSpecialite: NiveauSpecialiteModel[];
}
