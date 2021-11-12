import {InscriptionModel} from "./inscription.model";
import {SemestreNiveauModel} from "./semestre-niveau.model";
import {BulletinRecapModel} from "./bulletin-recap.model";
import {RecapNoteProgrammeModuleByProgrammeUeModel} from "./recap-note-programme-module-by-programme-ue.model";

export class BulletinAllModel {
  public inscription: InscriptionModel;
  public sommeCreditUE: number;
  public sommeMoyenneUE: number;
  public sommeMCR: number;
  public sommeCoef: number;
  public moyenneGeneral: number;
  public semestModel: SemestreNiveauModel;
  public bulletinRecaps: BulletinRecapModel[];
  public recapListNoteProgrammeModuleByProgrammeUe: RecapNoteProgrammeModuleByProgrammeUeModel[];
}
