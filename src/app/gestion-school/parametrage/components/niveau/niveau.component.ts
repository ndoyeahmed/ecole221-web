import { DocumentParNiveauModel } from './../../../../shared/models/document-par-niveau.model';
import { ParametragesSpecialiteService } from './../../services/parametrages-specialite.service';
import { SemestreModel } from './../../../../shared/models/semestre.model';
import { ParcoursModel } from './../../../../shared/models/parcours.model';
import { CycleModel } from './../../../../shared/models/cycle.model';
import { DocumentModel } from './../../../../shared/models/document.model';
import { NiveauModel } from './../../../../shared/models/niveau.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametragesBaseService } from '../../services/parametrages-base.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SemestreNiveauModel } from 'src/app/shared/models/semestre-niveau.model';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-niveau',
  templateUrl: './niveau.component.html',
  styleUrls: ['./niveau.component.css']
})
export class NiveauComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  LOADERID = 'niveau-loader';
  dialogRef: any;

  dataSource: MatTableDataSource<NiveauModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  niveauColumnsToDisplay = ['niveau', 'cycle', 'parcours', 'semestreniveau', 'documentafournir', 'documentadonner', 'status', 'actions'];

  listNiveau = [] as NiveauModel[];
  listDocument = [] as DocumentModel[];
  listSelectedDocument = [] as DocumentModel[];
  listCycle = [] as CycleModel[];
  listParcours = [] as ParcoursModel[];
  listSemestre = [] as SemestreModel[];
  listSelectedSemestre = [] as SemestreModel[];
  listSemestreNiveau = [] as SemestreNiveauModel[];

  listDocumentParNiveau = [] as DocumentParNiveauModel[];

  niveauModel = new NiveauModel();
  parcoursModel = new ParcoursModel();
  cycleModel = new CycleModel();

  page = 1;
  page2 = 1;

  onAdd = false;
  onNewSemestreNiveau = false;
  onNewDocumentFournirNiveau = false;
  onNewDocumentDonnerNiveau = false;

  constructor(
    private paramSpecialiteService: ParametragesSpecialiteService, private dialog: MatDialog,
    private notif: MycustomNotificationService, private ngxService: NgxSpinnerService,
    private paramBaseService: ParametragesBaseService
  ) {
  }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.loadListNiveau();
  }

  clear() {
    this.niveauModel = new NiveauModel();
    this.parcoursModel = new ParcoursModel();
    this.cycleModel = new CycleModel();
  }

  onAddSemestreNiveau() {
    this.onNewSemestreNiveau = true;
    this.loadListSemestre();
  }

  onAddDocumentAFournirNiveau() {
    this.onNewDocumentFournirNiveau = true;
    this.loadListDocument();
  }

  onAddDocumentDonnerNiveau() {
    this.onNewDocumentDonnerNiveau = true;
    this.loadListDocument();
  }

  saveSemestreNiveau(niveau) {
    this.listSemestreNiveau = [];
    if (this.listSelectedSemestre && this.listSelectedSemestre.length > 0) {
      this.ngxService.show(this.LOADERID);
      this.listSelectedSemestre.forEach(s => {
        const semestreNiveau = new SemestreNiveauModel();
        semestreNiveau.niveau = niveau;
        semestreNiveau.semestre = s;
        this.listSemestreNiveau.push(semestreNiveau);
      });
      this.subscription.push(
        this.paramSpecialiteService.addSemestreNiveau(this.listSemestreNiveau).subscribe(
          (data) => {
            console.log(data);
          }, (error) => {
            this.listSelectedSemestre = [];
            this.onNewSemestreNiveau = false;
            this.notif.error();
            this.ngxService.hide(this.LOADERID);
          }, () => {
            this.onNewSemestreNiveau = false;
            this.listSelectedSemestre = [];
            this.notif.success();
            this.ngxService.hide(this.LOADERID);
            this.loadListNiveau();
          }
        )
      );
    } else {
      this.notif.error('Veuillez remplir tout le formulaire SVP');
    }
  }

  saveDocumentNiveauAFournir(niveau) {
    this.listDocumentParNiveau = [];
    if (this.listSelectedDocument && this.listSelectedDocument.length > 0) {
      this.ngxService.show(this.LOADERID);
      this.listSelectedDocument.forEach(s => {
        const documentNiveau = new DocumentParNiveauModel();
        documentNiveau.niveau = niveau;
        documentNiveau.document = s;
        documentNiveau.fournir = true;
        this.listDocumentParNiveau.push(documentNiveau);
      });
      this.subscription.push(
        this.paramSpecialiteService.addDocumentParNiveau(this.listDocumentParNiveau).subscribe(
          (data) => {
            console.log(data);
          }, (error) => {
            this.listSelectedDocument = [];
            this.onNewDocumentFournirNiveau = false;
            this.notif.error();
            this.ngxService.hide(this.LOADERID);
          }, () => {
            this.onNewDocumentFournirNiveau = false;
            this.listSelectedDocument = [];
            this.notif.success();
            this.ngxService.hide(this.LOADERID);
            this.loadListNiveau();
          }
        )
      );
    } else {
      this.notif.error('Veuillez remplir tout le formulaire SVP');
    }
  }

  saveDocumentNiveauADonner(niveau) {
    this.listDocumentParNiveau = [];
    if (this.listSelectedDocument && this.listSelectedDocument.length > 0) {
      this.ngxService.show(this.LOADERID);
      this.listSelectedDocument.forEach(s => {
        const documentNiveau = new DocumentParNiveauModel();
        documentNiveau.niveau = niveau;
        documentNiveau.document = s;
        documentNiveau.fournir = false;
        this.listDocumentParNiveau.push(documentNiveau);
      });
      this.subscription.push(
        this.paramSpecialiteService.addDocumentParNiveau(this.listDocumentParNiveau).subscribe(
          (data) => {
            console.log(data);
          }, (error) => {
            this.listSelectedDocument = [];
            this.onNewDocumentDonnerNiveau = false;
            this.notif.error();
            this.ngxService.hide(this.LOADERID);
          }, () => {
            this.onNewDocumentDonnerNiveau = false;
            this.listSelectedDocument = [];
            this.notif.success();
            this.ngxService.hide(this.LOADERID);
            this.loadListNiveau();
          }
        )
      );
    } else {
      this.notif.error('Veuillez remplir tout le formulaire SVP');
    }
  }

  loadListDocument() {
    this.subscription.push(
      this.paramBaseService.getAllDocument().subscribe(
        (data) => {
          this.listDocument = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
          this.ngxService.hide(this.LOADERID);
        },
        () => {
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }

  loadListSemestre() {
    this.subscription.push(
      this.paramSpecialiteService.getAllSemestre().subscribe(
        (data) => {
          this.listSemestre = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
          this.ngxService.hide(this.LOADERID);
        },
        () => {
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }

  loadListNiveau() {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramSpecialiteService.getAllNiveau().subscribe(
        (data) => {
          this.listNiveau = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
          this.ngxService.hide(this.LOADERID);
        },
        () => {
          this.listNiveau.forEach(n => {
            this.subscription.push(
              this.paramSpecialiteService.getAllSemestreNiveauByNiveau(n.id).subscribe(
                (data) => {
                  n.semestreNiveaus = data;
                }
              )
            );
            this.subscription.push(
              this.paramSpecialiteService.getAllDocumentParNiveauByNiveauAndFournir(true, n.id).subscribe(
                (data) => {
                  n.documentAFournir = data;
                }
              )
            );
            this.subscription.push(
              this.paramSpecialiteService.getAllDocumentParNiveauByNiveauAndFournir(false, n.id).subscribe(
                (data) => {
                  n.documentADonner = data;
                }
              )
            );
          });
          this.dataSource = new MatTableDataSource<NiveauModel>(this.listNiveau);
          this.dataSource.paginator = this.paginator;
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }

  onEdit(item) {
    this.niveauModel = item as NiveauModel;
    this.cycleModel = this.niveauModel.cycle;
    this.parcoursModel = this.niveauModel.parcours;
  }

  archiveNiveau(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramSpecialiteService.archiveNiveau(id).subscribe(
        (data) => {
          this.loadListNiveau();
          this.notif.success();
        },
        (error) => {
          this.notif.error();
          this.ngxService.hide(this.LOADERID);
        }, () => {
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }

  archiveSemestreNiveau(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramSpecialiteService.archiveSemestreNiveau(id).subscribe(
        (data) => {
          this.loadListNiveau();
          this.notif.success();
        },
        (error) => {
          this.notif.error();
          this.ngxService.hide(this.LOADERID);
        }, () => {
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }

  archiveDocumentNiveau(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramSpecialiteService.archiveDocumentNiveau(id).subscribe(
        (data) => {
          this.loadListNiveau();
          this.notif.success();
        },
        (error) => {
          this.notif.error();
          this.ngxService.hide(this.LOADERID);
        }, () => {
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }

  openDialog(item, modelToArchive: string): void {
    this.dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '20%',
      data: item
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result.rep === true) {
        if (modelToArchive === 'niveau') {
          this.archiveNiveau(result.item.id);
        } else if (modelToArchive === 'semestre') {
          this.archiveSemestreNiveau(result.item.id);
        } else {
          this.archiveDocumentNiveau(result.item.id);
        }
      }
    });
  }

  onChangeStatus(value: MatSlideToggleChange, item) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramSpecialiteService.updateNiveauStatus(value.checked, item.id)
        .subscribe(
          (data) => {
            this.loadListNiveau();
            this.notif.success();
          },
          (error) => {
            this.notif.error();
            this.ngxService.hide(this.LOADERID);
          }, () => {
            this.ngxService.hide(this.LOADERID);
          }
        )
    );
  }

  onChangeStatusSemestre(value: MatSlideToggleChange, item) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramSpecialiteService.updateSemestreNiveauEncours(value.checked, item.id)
        .subscribe(
          (data) => {
            this.loadListNiveau();
            this.notif.success();
          },
          (error) => {
            this.notif.error();
            this.ngxService.hide(this.LOADERID);
          }, () => {
            this.ngxService.hide(this.LOADERID);
          }
        )
    );
  }

}
