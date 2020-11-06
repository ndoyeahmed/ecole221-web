import { SousClasseModel } from './sous-classe.model';
import { ClasseModel } from './classe.model';
export class ClasseSousClasse {
  public id: number;
  public archive: boolean;
  public classe: ClasseModel;
  public sousClasse: SousClasseModel;
}
