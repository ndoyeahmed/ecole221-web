import { MentionUEModel } from './mention-ue.model';
export class UeModel {
  public id: number;
  public code: string;
  public libelle: string;
  public etat: boolean;
  public archive: boolean;
  public mentionUE: MentionUEModel[];
}
