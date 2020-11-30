import { InscriptionModel } from './inscription.model';
export class NoteModel {
  public id: number;
  public dateSaisie: any;
  public dateMAJ: any;
  public mds: number;
  public nef: number;
  public session: number;
  public inscription: InscriptionModel;
}
