import { ProgrammeUEModel } from './programme-ue.model';
import { ModuleModel } from './module.model';
export class ProgrammeModuleModel {
  public id: number;
  public code: string;
  public num: string;
  public budget: number;
  public coef: number;
  public nbreCreditModule: number;
  public td: number;
  public tp: number;
  public tpe: number;
  public vh: number;
  public vht: number;
  public archive: boolean;
  public module: ModuleModel;
  public programmeUE: ProgrammeUEModel;
  public expanded = true;
  public expandedNew = true;
}
