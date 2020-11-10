import { NiveauSpecialiteModel } from './../../../../shared/models/niveau-specialite.model';
import { SemestreNiveauModel } from './../../../../shared/models/semestre-niveau.model';
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
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ReferentielComponent implements OnInit, OnDestroy {
  subscription = [] as Subscription[];
  LOADERID = 'referentiel-loader';
  LOADERPROGRAMMEUE = 'programme-ue-loader';
  dialogRef: any;

  referentielColumnsToDisplay = ['annee', 'credit', 'vht', 'actions'];
  programmeUEColumnsToDisplay = ['designation', 'creditProgrammeUe', 'fondamental', 'nbrHeureUE', 'actionsProgrammeUE'];
  programmeModuleColumnsToDisplay = ['nomModule', 'budget', 'coef', 'nbrCreditModule', 'td', 'tp', 'tpe', 'vhModule', 'vhtModule', 'actionsProgrammeModule'];
  expandedReferentiel: ReferentielModel | null;
  expandedProgrammeUE: ProgrammeUEModel | null;

  listNiveau = [] as NiveauModel[];
  listSpecialite = [] as NiveauSpecialiteModel[];
  listReferentiel = [] as ReferentielModel[];
  listReferentielFiltered = [] as ReferentielModel[];
  listProgrammeUE = [] as ProgrammeUEModel[];
  listProgrammeModule = [] as ProgrammeModuleModel[];

  niveauModel: NiveauModel;
  specialiteModel: SpecialiteModel;
  referentielModel = new ReferentielModel();
  programmeUEModel = new ProgrammeUEModel();
  programmeModuleModel = new ProgrammeModuleModel();

  listSemestreNiveau: SemestreNiveauModel[] = [];

  ueModel = new UeModel();
  listUe = [] as UeModel[];

  semestreModel = new SemestreModel();
  listSemestre = [] as SemestreModel[];

  moduleModel = new ModuleModel();
  listModule = [] as ModuleModel[];

  page = 1;
  expandedNewProgrammeUE = false;
  expandedNewProgrammeModule = false;

  onAdd = false;

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

  loadSemestreNiveauList(niveau) {
    this.subscription.push(
      this.paramSpecialiteService.getAllSemestreNiveauByNiveau(niveau.id).subscribe(
        (data) => {
          this.listSemestreNiveau = data;
        }, (error) => console.log(error)
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

  loadReferentielByNiveau(niveauId) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.niveau.id) === Number(niveauId)
    );
  }

  loadReferentielBySpecialite(specialiteId) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.specialite.id) === Number(specialiteId)
    );
  }

  loadReferentielByNiveauAndSpecialite(niveauId, specialiteId) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.niveau.id) === Number(niveauId) && Number(x.specialite.id) === Number(specialiteId)
    );
  }

  searchReferentielByNiveauAndSpecialite() {
    if (this.niveauModel && this.niveauModel.id
      && this.specialiteModel && this.specialiteModel.id) {
        this.loadReferentielByNiveauAndSpecialite(this.niveauModel.id, this.specialiteModel.id);
      } else if (this.niveauModel && this.niveauModel.id) {
        this.loadReferentielByNiveau(this.niveauModel.id);
      } else if (this.specialiteModel && this.specialiteModel.id) {
        this.loadReferentielBySpecialite(this.specialiteModel.id);
      }
  }

  cancelSearchReferentielByNiveauAndSpecialite(searchForm) {
    searchForm.resetForm();
    this.niveauModel = new NiveauModel();
    this.specialiteModel = new SpecialiteModel();
    this.listSpecialite = [];
    this.listReferentielFiltered = [];
  }

  loadListSpecialite(niveauId) {
    this.subscription.push(
      this.paramSpecialiteService.getAllNiveauSpecialiteByNiveau(niveauId).subscribe(
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

  /* loadListProgrammeUE(referentiel: ReferentielModel) {
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
  } */

  loadListProgrammeUE(referentiel: ReferentielModel, semestre: SemestreModel) {
    this.ngxService.show(this.LOADERPROGRAMMEUE);
    this.subscription.push(
      this.paramReferentielService.getAllProgrammeUEByReferentielAndSemestre(referentiel.id, semestre.id).subscribe(
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
          console.log(data);
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

  saveProgrammeUE(referentiel, semestre) {
    if (this.programmeUEModel.fondamental && this.programmeUEModel.credit
      && this.programmeUEModel.nbreHeureUE) {
      if (this.ueModel && this.ueModel.id ) {
        this.ngxService.show(this.LOADERPROGRAMMEUE);
        this.programmeUEModel.ue = this.ueModel;
        this.programmeUEModel.semestre = semestre;
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
                this.loadListProgrammeUE(this.programmeUEModel.referentiel, semestre);
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
        this.notif.error('UE obligatoire');
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
        this.notif.error('Module obligatoire');
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
