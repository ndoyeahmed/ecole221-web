import { MentionModel } from './mention.model';
import { UeModel } from './ue.model';
export class MentionUEModel {
  public id: number;
  public archive: boolean;
  public ue: UeModel;
  public mention: MentionModel;
}
