import { ProgrammeUEModel } from './programme-ue.model';
import { ModuleModel } from './module.model';
export class ProgrammeModuleModel {
  public id: number;
  public code: string;
  public num: string;
  public syllabus: string;
  public budget: number;
  public coef: number;
  public nbreCreditModule: number;
  public td: number; // nbr heures travaux dirigés
  public tp: number; // nbr heures travaux pratique
  public tpe: number; // nbr heures travail personnel etudiant
  public vhp: number; // volume horaire presentiel
  public cm: number; // nbr heures cours magistral
  public vht: number; // volume heures total
  public archive: boolean;
  public module: ModuleModel;
  public programmeUE: ProgrammeUEModel;
  public expanded = true;
  public expandedNew = true;
}
