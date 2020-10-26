import { DomaineModel } from './domaine.model';
export class MentionModel {
  public id: number;
  public libelle: string;
  public etat: boolean;
  public archive: boolean;
  public domaine: DomaineModel;
}
