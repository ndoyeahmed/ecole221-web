import { DocumentModel } from 'src/app/shared/models/document.model';
import { InscriptionModel } from './inscription.model';
export class DocumentPourEtudiantModel {
  public id: number;
  public prix: number;
  public document: DocumentModel;
  public inscription: InscriptionModel;
}
