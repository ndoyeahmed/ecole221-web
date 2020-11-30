import { ProgrammeModuleModel } from './programme-module.model';
import { NoteModel } from './note.model';
export class NoteProgrammeModuleModel {
  public id: number;
  public note: NoteModel;
  public programmeModule: ProgrammeModuleModel;
}
