import { JourModel } from './jour.model';
import { InscriptionModel } from './inscription.model';

export class PresenceModel {
  public id: number;
  public etat: boolean;
  public inscription: InscriptionModel;
  public jour: JourModel;
  public motif: string;
  public updateMotif = false;
}
