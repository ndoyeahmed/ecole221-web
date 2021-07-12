import {ReferentielModel} from './referentiel.model';
import {RecapProgrammeAnnuelleModel} from './recap-programme-annuelle.model';

export class ReferentielUploadRecapModel {
  public referentiel: ReferentielModel;
  public recapReferentielList: RecapProgrammeAnnuelleModel[];
  public errorList: string[];
}
