import { DocumentModel } from 'src/app/shared/models/document.model';
import { EtudiantModel } from './etudiant.model';
export class DocumentParEtudiantModel {
  public id: number;
  public url: string;
  public etudiant: EtudiantModel;
  public document: DocumentModel;
  public file: string
  public fileType: string
}
