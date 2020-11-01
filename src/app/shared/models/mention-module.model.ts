import { ModuleModel } from './module.model';
import { MentionModel } from './mention.model';
export class MentionModuleModel {
  public id: number;
  public archive: boolean;
  public mention: MentionModel;
  public module: ModuleModel;
}
