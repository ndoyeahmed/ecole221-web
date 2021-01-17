import { DocumentModel } from './document.model';
import { NiveauModel } from './niveau.model';

export class DocumentParNiveauModel {
  public id: number;
  public fournir: boolean;
  public archive: boolean;
  public niveau: NiveauModel;
  public document: DocumentModel;
  public checkedDoc: boolean;
}
