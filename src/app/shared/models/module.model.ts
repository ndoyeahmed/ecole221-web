import { MentionModuleModel } from './mention-module.model';
export class ModuleModel {
  public id: number;
  public code: string;
  public libelle: string;
  public etat: boolean;
  public archive: boolean;
  public mentionModule: MentionModuleModel[];
}
