import {ProgrammeUEModel} from "./programme-ue.model";
import {NoteProgrammeModuleModel} from "./note-programme-module.model";

export class RecapNoteProgrammeModuleByProgrammeUeModel {
  public programmeUE: ProgrammeUEModel;
  public noteProgrammeModules: NoteProgrammeModuleModel[];
  public moyenneUE: number;
  public valide: boolean;
}
