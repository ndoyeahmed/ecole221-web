import {ProfesseurModel} from "./professeur.model";
import {ModuleModel} from "./module.model";

export class ProfesseurModuleModel {
  public id: number;
  public professeur: ProfesseurModel;
  public module: ModuleModel;
}
