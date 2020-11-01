import { DocumentParNiveauModel } from './../../../../shared/models/document-par-niveau.model';
import { ParametragesSpecialiteService } from './../../services/parametrages-specialite.service';
import { SemestreModel } from './../../../../shared/models/semestre.model';
import { ParcoursModel } from './../../../../shared/models/parcours.model';
import { CycleModel } from './../../../../shared/models/cycle.model';
import { DocumentModel } from './../../../../shared/models/document.model';
import { NiveauModel } from './../../../../shared/models/niveau.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametragesBaseService } from '../../services/parametrages-base.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SemestreNiveauModel } from 'src/app/shared/models/semestre-niveau.model';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-niveau',
  templateUrl: './niveau.component.html',
  styleUrls: ['./niveau.component.css']
})
export class NiveauComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  LOADERID = 'niveau-loader';
  dialogRef: any;

  listNiveau = [] as NiveauModel[];
  listDocument = [] as DocumentModel[];
  listSelectedDocumentsAFournir = [] as DocumentParNiveauModel[];
  listSelectedDocumentsADonner = [] as DocumentParNiveauModel[];
  listCycle = [] as CycleModel[];
  listParcours = [] as ParcoursModel[];
  listSemestre = [] as SemestreModel[];
  listSemestreNiveau = [] as SemestreNiveauModel[];

  listDocumentParNiveau = [] as DocumentParNiveauModel[];

  niveauModel = new NiveauModel();
  parcoursModel = new ParcoursModel();
  cycleModel = new CycleModel();

  page = 1;
  page2 = 1;

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
    this.ngxService.show(this.LOADERID);
    this.loadListNiveau();
    this.loadListCycle();
    this.loadListSemestre();
    this.loadListParcours();
    this.loadListDocument();
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

  loadListParcours() {
    this.subscription.push(
      this.paramBaseService.getAllParcours().subscribe(
        (data) => {
          this.listParcours = data;
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
              this.paramSpecialiteService.getAllDocumentParNiveauByNiveau(n.id).subscribe(
                (data) => {
                  n.documentParNiveaus = data;
                }
              )
            );
          });
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }

  loadListCycle() {
    this.subscription.push(
      this.paramBaseService.getAllCycle().subscribe(
        (data) => {
          this.listCycle = data;
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

  onCheckedSemestre(event: MatCheckboxChange, semestre) {
    if (event.checked === true) {
      const semestreNiveauModel = new SemestreNiveauModel();
      semestreNiveauModel.semestre = semestre;
      this.listSemestreNiveau.push(semestreNiveauModel);
    } else {
      this.listSemestreNiveau = this.listSemestreNiveau.filter(sn => Number(sn.semestre.id) !== Number(semestre.id));
    }
  }

  onCheckedDocumentAFournir(event: MatCheckboxChange, doc) {
    if (event.checked === true) {
      const documentParNiveauModel = new DocumentParNiveauModel();
      documentParNiveauModel.document = doc;
      this.listSelectedDocumentsAFournir.push(documentParNiveauModel);
    } else {
      this.listSelectedDocumentsAFournir = this.listSelectedDocumentsAFournir.filter(sn => Number(sn.document.id) !== Number(doc.id));
    }
  }

  onCheckedDocumentADonner(event: MatCheckboxChange, doc) {
    if (event.checked === true) {
      const documentParNiveauModel = new DocumentParNiveauModel();
      documentParNiveauModel.document = doc;
      this.listSelectedDocumentsADonner.push(documentParNiveauModel);
    } else {
      this.listSelectedDocumentsADonner = this.listSelectedDocumentsADonner.filter(sn => Number(sn.document.id) !== Number(doc.id));
    }
  }

  save(addForm) {
    if (this.niveauModel.libelle && this.niveauModel.libelle.trim() !== ''
      && this.parcoursModel.libelle && this.parcoursModel.libelle.trim() !== ''
      && this.cycleModel.cycle && this.cycleModel.cycle.trim() !== '') {
      if (this.listSemestreNiveau && this.listSemestreNiveau.length > 0
        && this.listSelectedDocumentsADonner && this.listSelectedDocumentsADonner.length > 0
        && this.listSelectedDocumentsAFournir && this.listSelectedDocumentsAFournir.length > 0) {
        this.ngxService.show(this.LOADERID);
        this.niveauModel.parcours = this.parcoursModel;
        this.niveauModel.cycle = this.cycleModel;
        console.log(this.niveauModel);
        this.subscription.push(
          (this.niveauModel.id ?
            this.paramSpecialiteService.updateNiveau(this.niveauModel.id, this.niveauModel) :
            this.paramSpecialiteService.addNiveau(this.niveauModel)).subscribe(
              (data) => {
                console.log(data);
                if (data && data.id) {
                  this.niveauModel = data as NiveauModel;
                  this.saveDocumentParNiveau(this.listSelectedDocumentsADonner, this.niveauModel);
                  this.saveSemestreNiveau(this.listSemestreNiveau, this.niveauModel);
                }
              }, (error) => {
                this.notif.error();
                this.ngxService.hide(this.LOADERID);
              }, () => {
                addForm.resetForm();
                this.clear();
                this.notif.success();
                this.loadListNiveau();
              }
            )
        );
      } else {
        this.notif.error('Selectionnez au moins un document à donner, un document à fournir et un semestre');
      }
    } else {
      this.notif.error('Veuillez remplir tous le formulaire SVP');
    }

  }

  clear() {
    this.cycleModel = new CycleModel();
    this.parcoursModel = new ParcoursModel();
    this.niveauModel = new NiveauModel();
  }

  saveDocumentParNiveau(docParNiveau: DocumentParNiveauModel[], niveau: NiveauModel) {
    docParNiveau.forEach(x => x.niveau = niveau);
    this.subscription.push(
      this.paramSpecialiteService.addDocumentParNiveau(docParNiveau).subscribe(
        (data) => {
          console.log(data);
        }, (error) => {
          this.notif.error();
          this.ngxService.hide(this.LOADERID);
        }, () => {
          docParNiveau = [];
          this.loadListDocument();
          this.loadListNiveau();
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }

  saveSemestreNiveau(semestreNiveau: SemestreNiveauModel[], niveau: NiveauModel) {
    semestreNiveau.forEach(x => x.niveau = niveau);
    this.subscription.push(
      this.paramSpecialiteService.addSemestreNiveau(semestreNiveau).subscribe(
        (data) => {
          console.log(data);
        }, (error) => {
          this.notif.error();
          this.ngxService.hide(this.LOADERID);
        }, () => {
          semestreNiveau = [];
          this.loadListSemestre();
          this.loadListNiveau();
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

  archive(id) {
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

  openDialog(item): void {
    this.dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '20%',
      data: item
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result.rep === true) {
        this.archive(result.item.id);
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

}
