import { DocumentModel } from './document.model';
import { NiveauModel } from './niveau.model';

export class DocumentParNiveauModel {
  public id: number;
  public archive: boolean;
  public niveau: NiveauModel;
  public document: DocumentModel;
}
