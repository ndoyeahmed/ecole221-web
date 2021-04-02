import {SemestreModel} from './semestre.model';
import {RecapProgrammeModuleModel} from './recap-programme-module.model';

export class RecapProgrammeAnnuelleModel {
  public semestre: SemestreModel;
  public listRecapProgrammeModule: RecapProgrammeModuleModel[];
}
