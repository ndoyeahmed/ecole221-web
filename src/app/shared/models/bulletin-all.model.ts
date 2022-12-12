import {InscriptionModel} from "./inscription.model";
import {SemestreNiveauModel} from "./semestre-niveau.model";
import {BulletinRecapModel} from "./bulletin-recap.model";
import {RecapNoteProgrammeModuleByProgrammeUeModel} from "./recap-note-programme-module-by-programme-ue.model";

export class BulletinAllModel {
  public inscription: InscriptionModel | undefined;
  public decision: string | undefined;
  public sommeCreditUE: number | undefined;
  public sommeMoyenneUE: number | undefined;
  public sommeMCR: number | undefined;
  public sommeCoef: number | undefined;
  public moyenneGeneral: number | undefined;
  public semestModel: SemestreNiveauModel | undefined;
  public bulletinRecaps: BulletinRecapModel[] | undefined;
  public recapListNoteProgrammeModuleByProgrammeUe: RecapNoteProgrammeModuleByProgrammeUeModel[] | undefined;
}
