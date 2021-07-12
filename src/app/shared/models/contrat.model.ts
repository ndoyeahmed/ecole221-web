import {TypeContratModel} from "./type-contrat.model";
import {ProfesseurModel} from "./professeur.model";

export class ContratModel {
  public id: number;
  public dateDebut: any;
  public dateFin: any;
  public enCours: boolean;
  public horaireVacataire: number;
  public nombreHeure: number;
  public montantContractuel: number;
  public document: string;
  public typeContrat: TypeContratModel;
  public professeur: ProfesseurModel;
}
