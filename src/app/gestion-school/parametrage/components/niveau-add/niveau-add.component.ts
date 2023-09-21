import { SharedService } from './../../../../shared/services/shared.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { CycleModel } from 'src/app/shared/models/cycle.model';
import { DocumentParNiveauModel } from 'src/app/shared/models/document-par-niveau.model';
import { DocumentModel } from 'src/app/shared/models/document.model';
import { NiveauModel } from 'src/app/shared/models/niveau.model';
import { ParcoursModel } from 'src/app/shared/models/parcours.model';
import { SemestreNiveauModel } from 'src/app/shared/models/semestre-niveau.model';
import { SemestreModel } from 'src/app/shared/models/semestre.model';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametragesBaseService } from '../../services/parametrages-base.service';
import { ParametragesSpecialiteService } from '../../services/parametrages-specialite.service';

@Component({
  selector: 'app-niveau-add',
  templateUrl: './niveau-add.component.html',
  styleUrls: ['./niveau-add.component.css']
})
export class NiveauAddComponent implements OnInit, OnDestroy {
  subscription = [] as Subscription[];
  LOADERID = 'niveau-loader';
  dialogRef: any;

  listDocument = [] as DocumentModel[];
  listSelectedDocumentsAFournir = [] as DocumentParNiveauModel[];
  listSelectedDocumentsADonner = [] as DocumentParNiveauModel[];
  listCycle = [] as CycleModel[];
  listParcours = [] as ParcoursModel[];
  listSemestre = [] as SemestreModel[];
  listSemestreNiveau = [] as SemestreNiveauModel[];

  listDocumentParNiveau = [] as DocumentParNiveauModel[];

  @Input()
  niveauModel: NiveauModel;
  @Input()
  parcoursModel: ParcoursModel;
  @Input()
  cycleModel: CycleModel;

  page = 1;
  page2 = 1;

  constructor(
    private paramSpecialiteService: ParametragesSpecialiteService,
    private notif: MycustomNotificationService,
    private paramBaseService: ParametragesBaseService, private sharedService: SharedService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {

    this.loadListCycle();
    this.loadListSemestre();
    this.loadListParcours();
    this.loadListDocument();

    this.sharedService.isVisibleSource.subscribe(
      (data) => {
        if (data) {
          this.loadListCycle();
          this.loadListSemestre();
          this.loadListParcours();
          this.loadListDocument();
        }
      }
    )
  }

  loadListDocument() {
    this.subscription.push(
      this.paramBaseService.getAllDocument().subscribe(
        (data) => {
          this.listDocument = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');

        },
        () => {

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

        },
        () => {

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

        },
        () => {

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

        },
        () => {

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
      documentParNiveauModel.fournir = true;
      this.listSelectedDocumentsAFournir.push(documentParNiveauModel);
    } else {
      this.listSelectedDocumentsAFournir = this.listSelectedDocumentsAFournir.filter(sn => Number(sn.document.id) !== Number(doc.id));
    }
  }

  onCheckedDocumentADonner(event: MatCheckboxChange, doc) {
    if (event.checked === true) {
      const documentParNiveauModel = new DocumentParNiveauModel();
      documentParNiveauModel.document = doc;
      documentParNiveauModel.fournir = false;
      this.listSelectedDocumentsAFournir.push(documentParNiveauModel);
    } else {
      this.listSelectedDocumentsAFournir = this.listSelectedDocumentsAFournir.filter(sn => Number(sn.document.id) !== Number(doc.id));
    }
  }

  save(addForm) {
    if (this.niveauModel.libelle && this.niveauModel.libelle.trim() !== ''
      && this.parcoursModel.libelle && this.parcoursModel.libelle.trim() !== ''
      && this.cycleModel.cycle && this.cycleModel.cycle.trim() !== '') {
      if ((this.listSemestreNiveau && this.listSemestreNiveau.length > 0
        && this.listSelectedDocumentsAFournir && this.listSelectedDocumentsAFournir.length > 0) || this.niveauModel.id) {

        this.niveauModel.parcours = this.parcoursModel;
        this.niveauModel.cycle = this.cycleModel;
        console.log(this.niveauModel);

        const body = {
          niveau: this.niveauModel,
          documentParNiveaus: this.listSelectedDocumentsAFournir,
          semestreNiveaus: this.listSemestreNiveau
        }
        this.subscription.push(
          (this.niveauModel.id ?
            this.paramSpecialiteService.updateNiveau(this.niveauModel.id, this.niveauModel) :
            this.paramSpecialiteService.addNiveau(body)).subscribe(
              (data) => {
                console.log(data);
                // if (!this.niveauModel.id) {
                //   if (data && data.id) {
                //     this.niveauModel = data as NiveauModel;
                //     this.saveDocumentParNiveau(this.listSelectedDocumentsAFournir, this.niveauModel);
                //     this.saveSemestreNiveau(this.listSemestreNiveau, this.niveauModel);
                //   }
                // }
              }, (error) => {
                this.notif.error();

              }, () => {
                addForm.resetForm();
                this.clear();
                this.notif.success();

                this.sharedService.isVisibleSource.next(true);
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

        }, () => {
          docParNiveau = [];
          this.listSelectedDocumentsAFournir = [];
          this.loadListDocument();

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

        }, () => {
          semestreNiveau = [];
          this.listSemestreNiveau = [];
          this.loadListSemestre();

        }
      )
    );
  }

}
