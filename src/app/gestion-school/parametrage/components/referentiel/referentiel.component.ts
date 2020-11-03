import { ModuleModel } from './../../../../shared/models/module.model';
import { ParametrageModuleUeService } from './../../services/parametrage-module-ue.service';
import { SemestreModel } from './../../../../shared/models/semestre.model';
import { UeModel } from './../../../../shared/models/ue.model';
import { ProgrammeModuleModel } from './../../../../shared/models/programme-module.model';
import { ProgrammeUEModel } from './../../../../shared/models/programme-ue.model';
import { ReferentielModel } from './../../../../shared/models/referentiel.model';
import { SpecialiteModel } from './../../../../shared/models/specialite.model';
import { NiveauModel } from './../../../../shared/models/niveau.model';
import { ParametrageReferentielService } from './../../services/parametrage-referentiel.service';
import { ParametragesSpecialiteService } from './../../services/parametrages-specialite.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-referentiel',
  templateUrl: './referentiel.component.html',
  styleUrls: ['./referentiel.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(500)
      ]),
      transition('* => void', [
        animate(500, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class ReferentielComponent implements OnInit, OnDestroy {
  subscription = [] as Subscription[];
  LOADERID = 'referentiel-loader';
  LOADERPROGRAMMEUE = 'programme-ue-loader';
  dialogRef: any;

  listNiveau = [] as NiveauModel[];
  listSpecialite = [] as SpecialiteModel[];
  listReferentiel = [] as ReferentielModel[];
  listProgrammeUE = [] as ProgrammeUEModel[];
  listProgrammeModule = [] as ProgrammeModuleModel[];

  niveauModel: NiveauModel;
  specialiteModel: SpecialiteModel;
  referentielModel = new ReferentielModel();
  programmeUEModel = new ProgrammeUEModel();
  programmeModuleModel = new ProgrammeModuleModel();

  ueModel = new UeModel();
  listUe = [] as UeModel[];

  semestreModel = new SemestreModel();
  listSemestre = [] as SemestreModel[];

  moduleModel = new ModuleModel();
  listModule = [] as ModuleModel[];

  page = 1;
  expandedNewProgrammeUE = false;
  expandedNewProgrammeModule = false;

  constructor(
    private dialog: MatDialog, private paramSpecialiteService: ParametragesSpecialiteService,
    private notif: MycustomNotificationService, private ngxService: NgxSpinnerService,
    private paramReferentielService: ParametrageReferentielService, private paramModuleUEService: ParametrageModuleUeService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.ngxService.show(this.LOADERID);
    this.loadListNiveau();
    this.loadListSpecialite();
    this.loadListReferentiel();
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
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }

  onAddNewProgrammeUE() {
    this.ngxService.show(this.LOADERPROGRAMMEUE);
    this.loadListUe();
    this.loadListSemestre();
  }

  onAddNewProgrammeModule() {
    this.ngxService.show(this.LOADERPROGRAMMEUE);
    this.loadListModule();
  }

  loadListUe() {
    this.subscription.push(
      this.paramModuleUEService.getAllUE().subscribe(
        (data) => {
          this.listUe = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
          this.ngxService.hide(this.LOADERPROGRAMMEUE);
        },
        () => {
          this.ngxService.hide(this.LOADERPROGRAMMEUE);
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
          this.ngxService.hide(this.LOADERPROGRAMMEUE);
        },
        () => {
          this.ngxService.hide(this.LOADERPROGRAMMEUE);
        }
      )
    );
  }

  loadListSpecialite() {
    this.subscription.push(
      this.paramSpecialiteService.getAllSpecialite().subscribe(
        (data) => {
          this.listSpecialite = data;
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

  loadListReferentiel() {
    this.subscription.push(
      this.paramReferentielService.getAllReferentiel().subscribe(
        (data) => {
          this.listReferentiel = data;
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

  loadListModule() {
    this.subscription.push(
      this.paramModuleUEService.getAllModule().subscribe(
        (data) => {
          this.listModule = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
          this.ngxService.hide(this.LOADERPROGRAMMEUE);
        },
        () => {
          this.ngxService.hide(this.LOADERPROGRAMMEUE);
        }
      )
    );
  }

  loadListProgrammeUE(referentiel: ReferentielModel) {
    this.ngxService.show(this.LOADERPROGRAMMEUE);
    this.subscription.push(
      this.paramReferentielService.getAllProgrammeUEByReferentiel(referentiel.id).subscribe(
        (data) => {
          this.listProgrammeUE = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
          this.ngxService.hide(this.LOADERPROGRAMMEUE);
        },
        () => {
          this.ngxService.hide(this.LOADERPROGRAMMEUE);
        }
      )
    );
  }

  loadListProgrammeModule(programmeUE: ProgrammeUEModel) {
    this.ngxService.show(this.LOADERPROGRAMMEUE);
    this.subscription.push(
      this.paramReferentielService.getAllProgrammeModuleByProgrammeUE(programmeUE.id).subscribe(
        (data) => {
          this.listProgrammeModule = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
          this.ngxService.hide(this.LOADERPROGRAMMEUE);
        },
        () => {
          this.ngxService.hide(this.LOADERPROGRAMMEUE);
        }
      )
    );
  }

  save(addForm) {
    if (this.referentielModel.annee && this.referentielModel.credit
      && this.referentielModel.volumeHeureTotal && this.referentielModel.description) {
      if (this.niveauModel && this.niveauModel.id && this.specialiteModel && this.specialiteModel.id) {
        this.ngxService.show(this.LOADERID);
        this.referentielModel.niveau = this.niveauModel;
        this.referentielModel.specialite = this.specialiteModel;
        this.subscription.push(
          (this.referentielModel.id ?
            this.paramReferentielService.updateReferentiel(this.referentielModel.id, this.referentielModel) :
            this.paramReferentielService.addReferentiel(this.referentielModel)).subscribe(
              (data) => {
                console.log(data);
              }, (error) => {
                this.notif.error();
                this.ngxService.hide(this.LOADERID);
              }, () => {
                addForm.resetForm();
                this.clear();
                this.notif.success();
                this.loadListReferentiel();
                this.ngxService.hide(this.LOADERID);
              }
            )
        );
      } else {
        this.notif.error('Niveau et spécialité obligatoire');
      }
    } else {
      this.notif.error('Veuillez remplir tout le formulaire SVP');
    }
  }

  saveProgrammeUE(referentiel) {
    if (this.programmeUEModel.fondamental && this.programmeUEModel.credit
      && this.programmeUEModel.nbreHeureUE) {
      if (this.ueModel && this.ueModel.id && this.semestreModel && this.semestreModel.id) {
        this.ngxService.show(this.LOADERPROGRAMMEUE);
        this.programmeUEModel.ue = this.ueModel;
        this.programmeUEModel.semestre = this.semestreModel;
        this.programmeUEModel.referentiel = referentiel;
        this.subscription.push(
          (this.programmeUEModel.id ?
            this.paramReferentielService.updateProgrammeUE(this.programmeUEModel.id, this.programmeUEModel) :
            this.paramReferentielService.addProgrammeUE(this.programmeUEModel)).subscribe(
              (data) => {
                console.log(data);
              }, (error) => {
                this.notif.error();
                this.ngxService.hide(this.LOADERPROGRAMMEUE);
              }, () => {
                this.loadListProgrammeUE(this.programmeUEModel.referentiel);
                this.semestreModel = new SemestreModel();
                this.ueModel = new UeModel();
                this.programmeUEModel = new ProgrammeUEModel();
                this.expandedNewProgrammeUE = false;
                this.notif.success();
                this.ngxService.hide(this.LOADERPROGRAMMEUE);
              }
            )
        );
      } else {
        this.notif.error('Niveau et spécialité obligatoire');
      }
    } else {
      this.notif.error('Veuillez remplir tout le formulaire SVP');
    }
  }

  saveProgrammeModule(programmeUE) {
    if (this.programmeModuleModel.budget && this.programmeModuleModel.coef
      && this.programmeModuleModel.nbreCreditModule && this.programmeModuleModel.td
      && this.programmeModuleModel.tp && this.programmeModuleModel.tpe
      && this.programmeModuleModel.vh && this.programmeModuleModel.vht) {
      if (this.moduleModel && this.moduleModel.id) {
        this.ngxService.show(this.LOADERPROGRAMMEUE);
        this.programmeModuleModel.module = this.moduleModel;
        this.programmeModuleModel.programmeUE = programmeUE;
        this.subscription.push(
          (this.programmeModuleModel.id ?
            this.paramReferentielService.updateProgrammeModule(this.programmeModuleModel.id, this.programmeModuleModel) :
            this.paramReferentielService.addProgrammeModule(this.programmeModuleModel)).subscribe(
              (data) => {
                console.log(data);
              }, (error) => {
                this.notif.error();
                this.ngxService.hide(this.LOADERPROGRAMMEUE);
              }, () => {
                this.loadListProgrammeModule(this.programmeModuleModel.programmeUE);
                this.moduleModel = new ModuleModel();
                this.programmeModuleModel = new ProgrammeModuleModel();
                this.expandedNewProgrammeModule = false;
                this.notif.success();
                this.ngxService.hide(this.LOADERPROGRAMMEUE);
              }
            )
        );
      } else {
        this.notif.error('Niveau et spécialité obligatoire');
      }
    } else {
      this.notif.error('Veuillez remplir tout le formulaire SVP');
    }
  }

  clear() {
    this.specialiteModel = new SpecialiteModel();
    this.niveauModel = new NiveauModel();
    this.referentielModel = new ReferentielModel();
  }

}
