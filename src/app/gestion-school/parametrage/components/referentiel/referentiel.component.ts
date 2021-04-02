import {NiveauSpecialiteModel} from './../../../../shared/models/niveau-specialite.model';
import {SemestreNiveauModel} from './../../../../shared/models/semestre-niveau.model';
import {ModuleModel} from './../../../../shared/models/module.model';
import {ParametrageModuleUeService} from './../../services/parametrage-module-ue.service';
import {SemestreModel} from './../../../../shared/models/semestre.model';
import {UeModel} from './../../../../shared/models/ue.model';
import {ProgrammeModuleModel} from './../../../../shared/models/programme-module.model';
import {ProgrammeUEModel} from './../../../../shared/models/programme-ue.model';
import {ReferentielModel} from './../../../../shared/models/referentiel.model';
import {SpecialiteModel} from './../../../../shared/models/specialite.model';
import {NiveauModel} from './../../../../shared/models/niveau.model';
import {ParametrageReferentielService} from './../../services/parametrage-referentiel.service';
import {ParametragesSpecialiteService} from './../../services/parametrages-specialite.service';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {MycustomNotificationService} from '../../services/mycustom-notification.service';
import {trigger, transition, style, animate, state} from '@angular/animations';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MentionUEModel} from 'src/app/shared/models/mention-ue.model';
import {MentionModuleModel} from 'src/app/shared/models/mention-module.model';
import {DeleteDialogComponent} from '../delete-dialog/delete-dialog.component';
import {ParametrageClasseService} from '../../services/parametrage-classe.service';
import {RecapProgrammeModuleModel} from '../../../../shared/models/recap-programme-module.model';
import {RecapProgrammeAnnuelleModel} from '../../../../shared/models/recap-programme-annuelle.model';
import {InscriptionService} from "../../../inscription/services/inscription.service";
import {DomSanitizer} from "@angular/platform-browser";


/// <reference path ="../../node_modules/@types/jquery/index.d.ts"/>
declare var $: any;

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
export class ReferentielComponent implements OnInit, OnDestroy, AfterViewInit {
  subscription = [] as Subscription[];
  LOADERID = 'referentiel-loader';
  LOADERPROGRAMMEUE = 'programme-ue-loader';
  dialogRef: any;

  dataSource: MatTableDataSource<ReferentielModel>;

  referentielColumnsToDisplay = ['annee', 'credit', 'vht', 'type', 'actions'];
  programmeUEColumnsToDisplay = ['designation', 'creditProgrammeUe', 'fondamental', 'nbrHeureUE', 'actionsProgrammeUE'];
  programmeModuleColumnsToDisplay = ['nomModule', 'coef', 'nbrCreditModule', 'td', 'tp', 'tpe', 'vhpModule', 'vhtModule', 'cm', 'syllabus', 'actionsProgrammeModule'];

  listTypeReferentiel = [
    {id: 1, name: 'Affecté'},
    {id: 2, name: 'Non affecté'},
    // {id: 3, name: 'Cloturé'},
    // {id: 4, name: 'En cours'},
  ];

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
  listUe = [] as MentionUEModel[];

  semestreModel = new SemestreModel();
  listSemestre = [] as SemestreModel[];

  moduleModel = new ModuleModel();
  listModule = [] as MentionModuleModel[];

  page = 1;
  expandedNewProgrammeUE = false;
  expandedNewProgrammeModule = false;

  onAdd = false;
  etat = 'add';
  annee = '';
  typeReferentiel: number;

  // for recap programme needs

  listRecapProgrammeModule = [] as RecapProgrammeModuleModel[];
  listRecapProgrammeModuleSemestre = [] as RecapProgrammeAnnuelleModel[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  filename = '';
  urlSyllabus: string;

  constructor(
    private dialog: MatDialog, private paramSpecialiteService: ParametragesSpecialiteService,
    private notif: MycustomNotificationService, private ngxService: NgxSpinnerService,
    private paramReferentielService: ParametrageReferentielService, private paramModuleUEService: ParametrageModuleUeService,
    private paramClasseService: ParametrageClasseService, private inscriptionService: InscriptionService,
    private sanitizer: DomSanitizer
  ) {
  }


  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  onAddReferentiel() {
    this.onAdd = true;
    this.etat = 'add';
    this.referentielModel = new ReferentielModel();
    this.niveauModel = new NiveauModel();
    this.specialiteModel = new SpecialiteModel();
  }

  ngOnInit(): void {
    this.ngxService.show(this.LOADERID);
    this.loadListNiveau();
    this.loadListReferentiel();
  }

  onSelectFile(event) {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'application/pdf') {
        const reader = new FileReader();
        this.filename = event.target.files[0].name;
        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event1: any) => { // called once readAsDataURL is completed
          this.programmeModuleModel.syllabus = event1.target.result;
        };
      } else {
        this.notif.error('Veuillez choisir un fichier pdf SVP');
      }
    }
  }

  onDuplicateReferentiel(referentiel) {
    this.etat = 'clone';
    this.onAdd = true;
    this.referentielModel = referentiel;
    this.niveauModel = referentiel.niveau;
    this.specialiteModel = referentiel.specialite;
  }

  onEditReferentiel(referentiel) {
    this.etat = 'edit';
    this.onAdd = true;
    this.referentielModel = referentiel;
    this.niveauModel = referentiel.niveau;
    this.specialiteModel = referentiel.specialite;
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

  onAddNewProgrammeUE(referentiel) {
    this.ngxService.show(this.LOADERPROGRAMMEUE);
    this.loadListUe(referentiel.specialite.id);
    this.loadListSemestre();
  }

  onAddNewProgrammeModule(referentiel) {
    this.ngxService.show(this.LOADERPROGRAMMEUE);
    this.loadListModule(referentiel.specialite.id);
  }

  loadListUe(specialiteId) {
    this.subscription.push(
      this.paramModuleUEService.getAllMentionUEByMentionWithSpecialiteId(specialiteId).subscribe(
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
    this.dataSource = new MatTableDataSource<ReferentielModel>(this.listReferentielFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadReferentielBySpecialite(specialiteId) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.specialite.id) === Number(specialiteId)
    );
    this.dataSource = new MatTableDataSource<ReferentielModel>(this.listReferentielFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadReferentielByAnnee(annee) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.annee) === Number(annee)
    );
    this.dataSource = new MatTableDataSource<ReferentielModel>(this.listReferentielFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadReferentielByType(type) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.affected) === Number(type)
    );
    this.dataSource = new MatTableDataSource<ReferentielModel>(this.listReferentielFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadReferentielByNiveauAndSpecialite(niveauId, specialiteId) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.niveau.id) === Number(niveauId) && Number(x.specialite.id) === Number(specialiteId)
    );
    this.dataSource = new MatTableDataSource<ReferentielModel>(this.listReferentielFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadReferentielByNiveauAndSpecialiteAndType(niveauId, specialiteId, type) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.niveau.id) === Number(niveauId) && Number(x.specialite.id) === Number(specialiteId)
        && Number(x.affected) === Number(type)
    );
    this.dataSource = new MatTableDataSource<ReferentielModel>(this.listReferentielFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadReferentielByNiveauAndSpecialiteAndAnnee(niveauId, specialiteId, annee) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.niveau.id) === Number(niveauId) && Number(x.specialite.id) === Number(specialiteId) && Number(x.annee) === Number(annee)
    );
    this.dataSource = new MatTableDataSource<ReferentielModel>(this.listReferentielFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadReferentielByNiveauAndSpecialiteAndAnneeAndType(niveauId, specialiteId, annee, type) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.niveau.id) === Number(niveauId) && Number(x.specialite.id) === Number(specialiteId) && Number(x.annee) === Number(annee)
        && Number(x.affected) === Number(type)
    );
    this.dataSource = new MatTableDataSource<ReferentielModel>(this.listReferentielFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadReferentielByNiveauAndAnnee(niveauId, annee) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.niveau.id) === Number(niveauId) && Number(x.annee) === Number(annee)
    );
    this.dataSource = new MatTableDataSource<ReferentielModel>(this.listReferentielFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadReferentielByNiveauAndType(niveauId, type) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.niveau.id) === Number(niveauId) && Number(x.affected) === Number(type)
    );
    this.dataSource = new MatTableDataSource<ReferentielModel>(this.listReferentielFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadReferentielByNiveauAndAnneeAndType(niveauId, annee, type) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.niveau.id) === Number(niveauId) && Number(x.annee) === Number(annee) && Number(x.affected) === Number(type)
    );
    this.dataSource = new MatTableDataSource<ReferentielModel>(this.listReferentielFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadReferentielBySpecialiteAndAnnee(specialiteId, annee) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.specialite.id) === Number(specialiteId) && Number(x.annee) === Number(annee)
    );
    this.dataSource = new MatTableDataSource<ReferentielModel>(this.listReferentielFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadReferentielByTypeAndAnnee(type, annee) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.affected) === Number(type) && Number(x.annee) === Number(annee)
    );
    this.dataSource = new MatTableDataSource<ReferentielModel>(this.listReferentielFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadReferentielBySpecialiteAndType(specialiteId, type) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.specialite.id) === Number(specialiteId) && Number(x.affected) === Number(type)
    );
    this.dataSource = new MatTableDataSource<ReferentielModel>(this.listReferentielFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadReferentielBySpecialiteAndAnneeAndType(specialiteId, annee, type) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.specialite.id) === Number(specialiteId) && Number(x.annee) === Number(annee) && Number(x.affected) === Number(type)
    );
    this.dataSource = new MatTableDataSource<ReferentielModel>(this.listReferentielFiltered);
    this.dataSource.paginator = this.paginator;
  }

  searchByNiveauAndSpecialite() {
    if (this.niveauModel && this.niveauModel.id && Number(this.annee) !== 0
      && this.specialiteModel && this.specialiteModel.id && this.typeReferentiel) {
      this.loadReferentielByNiveauAndSpecialiteAndAnneeAndType(this.niveauModel.id, this.specialiteModel.id, this.annee,
        this.typeReferentiel);
    } else if (this.niveauModel && this.niveauModel.id && Number(this.annee) !== 0
      && this.specialiteModel && this.specialiteModel.id) {

      this.loadReferentielByNiveauAndSpecialiteAndAnnee(this.niveauModel.id, this.specialiteModel.id, this.annee);

    } else if (this.niveauModel && this.niveauModel.id && Number(this.annee) !== 0) {

      this.loadReferentielByNiveauAndAnnee(this.niveauModel.id, this.annee);

    } else if (this.specialiteModel && this.specialiteModel.id && Number(this.annee) !== 0) {

      this.loadReferentielBySpecialiteAndAnnee(this.specialiteModel.id, this.annee);

    } else if (this.specialiteModel && this.specialiteModel.id && this.niveauModel && this.niveauModel.id) {

      this.loadReferentielByNiveauAndSpecialite(this.niveauModel.id, this.specialiteModel.id);

    } else if (this.niveauModel && this.niveauModel.id) {

      this.loadReferentielByNiveau(this.niveauModel.id);

    } else if (this.specialiteModel && this.specialiteModel.id) {

      this.loadReferentielBySpecialite(this.specialiteModel.id);
    } else if (Number(this.annee) !== 0) {

      this.loadReferentielByAnnee(this.annee);
    } else if (this.typeReferentiel) {

      this.loadReferentielByType(this.typeReferentiel);
    }
  }

  cancelSearchReferentielByNiveauAndSpecialite(searchForm) {
    searchForm.resetForm();
    this.niveauModel = new NiveauModel();
    this.specialiteModel = new SpecialiteModel();
    this.listSpecialite = [];
    this.listReferentielFiltered = [];
    this.loadListReferentiel();
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
          this.listReferentiel.forEach(x => {
            this.subscription.push(
              this.paramClasseService.getFirstClasseReferentielByReferentiel(x.id).subscribe(
                (classeref) => {
                  if (classeref) {
                    x.affected = 1;
                  } else {
                    x.affected = 2;
                  }
                }, (error) => console.log(error)
              )
            );
          });
          this.dataSource = new MatTableDataSource<ReferentielModel>(this.listReferentiel);
          this.dataSource.paginator = this.paginator;
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

  loadListModule(specialiteId) {
    this.subscription.push(
      this.paramModuleUEService.getAllMentionModuleByMentionWithSpecialiteId(specialiteId).subscribe(
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
    /*this.checkTotalVHPAndTPEParAnnee(referentiel);
    this.checkTotalVHPAndTPEParSemestre(referentiel, semestre);*/
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
    /*this.checkTotalVHPAndTPEParAnnee(programmeUE.referentiel);
    this.checkTotalVHPAndTPEParSemestre(programmeUE.referentiel, programmeUE.semestre);*/
     if (this.programmeModuleModel.budget && this.programmeModuleModel.coef
      && this.programmeModuleModel.nbreCreditModule && this.programmeModuleModel.td
      && this.programmeModuleModel.tp && this.programmeModuleModel.tpe
      && this.programmeModuleModel.vhp && this.programmeModuleModel.vht) {
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

  archive(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramReferentielService.archiveReferentiel(id).subscribe(
        (data) => {
          this.loadListReferentiel();
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

  onSetVhtProgrammeModule(event, s) {
    console.log(s);
    const vht = Number(event.target.value);
    this.programmeModuleModel.vhp = (vht * 12) / 20;
    this.programmeModuleModel.tpe = (vht * 8) / 20;
    this.programmeModuleModel.nbreCreditModule = vht / 20;
  }

  onCheckTDAndTPAndCM() {
    if (this.programmeModuleModel.td && this.programmeModuleModel.tp && this.programmeModuleModel.cm) {
      const somme = Number(this.programmeModuleModel.td) + Number(this.programmeModuleModel.tp) + Number(this.programmeModuleModel.cm);
      if (Number(somme) !== Number(this.programmeModuleModel.vhp)) {
        this.notif.error('La somme de TD, TP et CM doit être égale au VHP');
      }
    }
  }

  checkTotalVHPAndTPEParSemestre(referentiel, semestre) {
    console.log(referentiel);
    console.log(semestre);
  }

  checkTotalVHPAndTPEParAnnee(referentiel) {
    console.log(referentiel);
  }

  loadRecapProgrammeModule(referentiel) {
    this.listRecapProgrammeModule = [];
    this.listRecapProgrammeModuleSemestre = [];
    let result = [] as ProgrammeModuleModel[];
    this.subscription.push(
      this.paramReferentielService.getAllProgrammeModuleByReferentiel(referentiel.id)
        .subscribe(
          (data) => {
            result = data;
          }, (error) => console.log(error),
          () => {
            this.groupByProgrammeUE(result, this.listRecapProgrammeModule);
            this.listProgrammeModuleByProgrammeUE(result, this.listRecapProgrammeModule);

            this.groupBySemestre(this.listRecapProgrammeModule, this.listRecapProgrammeModuleSemestre);
            this.listProgrammeModuleBySemestre(this.listRecapProgrammeModule, this.listRecapProgrammeModuleSemestre);
            console.log(this.listRecapProgrammeModuleSemestre);
          }
        )
    );
  }

  groupByProgrammeUE(result, list) {
    let recapProgrammeModule: RecapProgrammeModuleModel;
    let trouve = false;
    for (const p of result) {
      trouve = false;
      if (result.indexOf(p) === 0) {
        trouve = true;
        recapProgrammeModule = new RecapProgrammeModuleModel();
        recapProgrammeModule.programmeUE = p.programmeUE;
        list.push(recapProgrammeModule);
      } else {
        for (const j of list) {
          if (Number(j.programmeUE.id) === Number(p.programmeUE.id)) {
            trouve = true;
            break;
          }
        }
      }

      if (trouve === false) {
        recapProgrammeModule = new RecapProgrammeModuleModel();
        recapProgrammeModule.programmeUE = p.programmeUE;
        list.push(recapProgrammeModule);
      }
    }
  }

  listProgrammeModuleByProgrammeUE(result, list) {
    let pmList;
    for (const l of list) {
      pmList = [];
      for (const p of result) {
        if (l.programmeUE.id === p.programmeUE.id) {
          pmList.push(p);
        }
      }
      l.programmeModuleList = pmList;
    }
  }

  groupBySemestre(result, list) {
    let recapProgrammeAnnuel: RecapProgrammeAnnuelleModel;
    let trouve = false;
    for (const p of result) {
      trouve = false;
      if (result.indexOf(p) === 0) {
        trouve = true;
        recapProgrammeAnnuel = new RecapProgrammeAnnuelleModel();
        recapProgrammeAnnuel.semestre = p.programmeUE.semestre;
        list.push(recapProgrammeAnnuel);
      } else {
        for (const j of list) {
          if (Number(j.semestre.id) === Number(p.programmeUE.semestre.id)) {
            trouve = true;
            break;
          }
        }
      }

      if (trouve === false) {
        recapProgrammeAnnuel = new RecapProgrammeAnnuelleModel();
        recapProgrammeAnnuel.semestre = p.programmeUE.semestre;
        list.push(recapProgrammeAnnuel);
      }
    }
  }

  listProgrammeModuleBySemestre(result, list) {
    let pmList;
    for (const l of list) {
      pmList = [];
      for (const p of result) {
        if (l.semestre.id === p.programmeUE.semestre.id) {
          pmList.push(p);
        }
      }
      l.listRecapProgrammeModule = pmList;
    }
  }

  loadSyllabus(programmeModule) {
    this.inscriptionService.getFilesByName(programmeModule.syllabus).subscribe(
      (data) => {
        this.urlSyllabus = 'data:application/pdf;base64, ' + data.response;

      }, (error) => console.log(error), () => {
        $('#showSyllabusModal').modal('show');
      }
    );
  }

  secureUlr(url) {
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
      : this.sanitizer.bypassSecurityTrustResourceUrl('');
  }
}
