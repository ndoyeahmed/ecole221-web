import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ProgrammeModuleModel} from '../../../../../shared/models/programme-module.model';
import {RecapProgrammeModuleModel} from '../../../../../shared/models/recap-programme-module.model';
import {RecapProgrammeAnnuelleModel} from '../../../../../shared/models/recap-programme-annuelle.model';
import {MatDialog} from '@angular/material/dialog';
import {ParametragesSpecialiteService} from '../../../services/parametrages-specialite.service';
import {MycustomNotificationService} from '../../../services/mycustom-notification.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ParametrageReferentielService} from '../../../services/parametrage-referentiel.service';
import {ParametrageModuleUeService} from '../../../services/parametrage-module-ue.service';
import {ParametrageClasseService} from '../../../services/parametrage-classe.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {InscriptionService} from '../../../../inscription/services/inscription.service';
import {UeModel} from '../../../../../shared/models/ue.model';
import {ModuleModel} from '../../../../../shared/models/module.model';
import {ReferentielModel} from '../../../../../shared/models/referentiel.model';


/// <reference path ="../../node_modules/@types/jquery/index.d.ts"/>
declare var $: any;

@Component({
  selector: 'app-recap-referentiel',
  templateUrl: './recap-referentiel.component.html',
  styleUrls: ['./recap-referentiel.component.css']
})
export class RecapReferentielComponent implements OnInit, OnDestroy {
  subscription = [] as Subscription[];
  idReferentiel: number;
  urlSyllabus: string;

  listUE = [] as UeModel[];
  listModule = [] as ModuleModel[];
// for recap programme needs
  listRecapProgrammeModule = [] as RecapProgrammeModuleModel[];
  listRecapProgrammeModuleSemestre = [] as RecapProgrammeAnnuelleModel[];
  @Input()
  listRecapProgrammeUploaded: RecapProgrammeAnnuelleModel[];
  @Input()
  errorList: string[];
  @Input()
  referentiel: ReferentielModel;
  constructor(
    private dialog: MatDialog, private paramSpecialiteService: ParametragesSpecialiteService,
    private notif: MycustomNotificationService, private ngxService: NgxSpinnerService,
    private paramReferentielService: ParametrageReferentielService, private route: ActivatedRoute,
    private sanitizer: DomSanitizer, private inscriptionService: InscriptionService,
    private paramModuleUEService: ParametrageModuleUeService
  ) { }

  ngOnInit(): void {
    this.idReferentiel = Number(this.route.snapshot.paramMap.get('referentielid'));
    console.log(this.idReferentiel);
    if (this.idReferentiel) {
      this.paramReferentielService.downloadModelExcelBehaviorSubject.subscribe(
        (data) => {
          if (data) {
            this.loadRecapProgrammeModule(this.idReferentiel);
          }
        }, (error) => console.log(error)
      );
      this.loadRecapProgrammeModule(this.idReferentiel);
    }
    this.loadListUE();
    this.loadListModule();
  }

  ngOnDestroy() {
    this.subscription.forEach(s => s.unsubscribe());
  }

  loadListUE() {
    this.subscription.push(
      this.paramModuleUEService.getAllUE().subscribe(
        (data) => {
          this.listUE = data;
        }, (error) => console.log(error)
      )
    );
  }

  loadListModule() {
    this.subscription.push(
      this.paramModuleUEService.getAllModule().subscribe(
        (data) => {
          this.listModule = data;
        }, (error) => console.log(error)
      )
    );
  }

  loadSyllabus(programmeModule) {
    this.inscriptionService.getFilesByName(programmeModule.syllabus).subscribe(
      (data) => {
        this.urlSyllabus = 'data:application/pdf;base64, ' + data.response;

      }, (error) => console.log(error), () => {
        $('#ifrm').attr('src', (this.sanitizer.bypassSecurityTrustResourceUrl(this.urlSyllabus) as any)
          .changingThisBreaksApplicationSecurity);
        $('#showSyllabusModal').modal('show');
      }
    );
  }

  secureUlr(url) {
    return this.urlSyllabus ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
      : this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  loadRecapProgrammeModule(referentielid) {
    this.listRecapProgrammeModule = [];
    this.listRecapProgrammeModuleSemestre = [];
    let result = [] as ProgrammeModuleModel[];
    this.subscription.push(
      this.paramReferentielService.getAllProgrammeModuleByReferentiel(referentielid)
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
            this.paramReferentielService.sendListRecapReferentiel(this.listRecapProgrammeModuleSemestre)
              .subscribe(
                (data) => console.log(data),
                (error) => console.log(error)
              );
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

}
