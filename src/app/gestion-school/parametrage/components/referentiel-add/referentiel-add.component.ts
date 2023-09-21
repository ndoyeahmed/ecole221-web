import { NiveauSpecialiteModel } from './../../../../shared/models/niveau-specialite.model';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NiveauModel } from 'src/app/shared/models/niveau.model';
import { ReferentielModel } from 'src/app/shared/models/referentiel.model';
import { SpecialiteModel } from 'src/app/shared/models/specialite.model';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametrageModuleUeService } from '../../services/parametrage-module-ue.service';
import { ParametrageReferentielService } from '../../services/parametrage-referentiel.service';
import { ParametragesSpecialiteService } from '../../services/parametrages-specialite.service';
import {RecapProgrammeModuleModel} from '../../../../shared/models/recap-programme-module.model';
import {RecapProgrammeAnnuelleModel} from '../../../../shared/models/recap-programme-annuelle.model';
import {ReferentielUploadRecapModel} from "../../../../shared/models/referentiel-upload-recap.model";

@Component({
  selector: 'app-referentiel-add',
  templateUrl: './referentiel-add.component.html',
  styleUrls: ['./referentiel-add.component.css']
})
export class ReferentielAddComponent implements OnInit, OnDestroy {
  subscription = [] as Subscription[];
  LOADERID = 'referentiel-loader';
  LOADERPROGRAMMEUE = 'programme-ue-loader';
  dialogRef: any;

  listNiveau = [] as NiveauModel[];
  listSpecialite = [] as NiveauSpecialiteModel[];

  @Input()
  niveauModel: NiveauModel;
  @Input()
  specialiteModel: SpecialiteModel;
  @Input()
  referentielModel: ReferentielModel;

  @Input()
  status: string;

  excelFile: File;

  recapReferentielList: RecapProgrammeAnnuelleModel[];
  referentielUploadRecap: ReferentielUploadRecapModel;

  constructor(
    private paramSpecialiteService: ParametragesSpecialiteService,
    private notif: MycustomNotificationService,
    private paramReferentielService: ParametrageReferentielService, private paramModuleUEService: ParametrageModuleUeService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {

    this.loadListNiveau();
  }

  loadListNiveau() {
    this.subscription.push(
      this.paramSpecialiteService.getAllNiveau().subscribe(
        (data) => {
          this.listNiveau = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
          
        },
        () => {
          
        }
      )
    );
  }

  onCheckIfReferentielExist() {
    if (this.status === 'add') {
      if (this.niveauModel && this.niveauModel.id && this.specialiteModel
        && this.specialiteModel.id && this.referentielModel && this.referentielModel.annee) {
          const body = {
            niveauId: this.niveauModel.id + '',
            specialiteId: this.specialiteModel.id + '',
            annee: this.referentielModel.annee + ''
          };
          this.subscription.push(
            this.paramReferentielService.getReferentielByNiveauAndSpecialiteAndAnnee(body).subscribe(
              (data) => {
                if (data) {
                  this.referentielModel = data;
                } else {
                  this.referentielModel.credit = null;
                  this.referentielModel.volumeHeureTotal = null;
                  this.referentielModel.description = null;
                }
              }, (error) => {
                this.notif.error('Erreur de chargement des données');
              }
            )
          );
        }
    }
  }

  loadListSpecialite(niveauId) {
    this.subscription.push(
      this.paramSpecialiteService.getAllNiveauSpecialiteByNiveau(niveauId).subscribe(
        (data) => {
          this.listSpecialite = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
          
        },
        () => {
          
        }
      )
    );
  }

  save(addForm) {
    if (this.referentielModel.annee && this.referentielModel.credit
      && this.referentielModel.volumeHeureTotal && this.referentielModel.description) {
      if (this.niveauModel && this.niveauModel.id && this.specialiteModel && this.specialiteModel.id) {

        this.referentielModel.niveau = this.niveauModel;
        this.referentielModel.specialite = this.specialiteModel;
        if (this.status === 'clone') {
          const oldReferentielId = this.referentielModel.id;
          this.referentielModel.id = null;
          this.subscription.push(
            this.paramReferentielService.cloneReferentiel(oldReferentielId, this.referentielModel).subscribe(
              (data) => {
                console.log(data);
              }, (error) => {
                this.notif.error();
                
              }, () => {
                addForm.resetForm();
                this.clear();
                this.notif.success();
                
              }
            )
          );
        } else {
          this.subscription.push(
            (this.referentielModel.id ?
              this.paramReferentielService.updateReferentiel(this.referentielModel.id, this.referentielModel) :
              this.paramReferentielService.addReferentiel(this.referentielModel)).subscribe(
                (data) => {
                  console.log(data);
                }, (error) => {
                  this.notif.error();
                  
                }, () => {
                  addForm.resetForm();
                  this.clear();
                  this.notif.success();
                  
                }
              )
          );
        }
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

  uploadReferentiel() {
    this.paramReferentielService.addReferentielByUploaded(this.excelFile).subscribe(
      (data) => {
        this.referentielUploadRecap = data as ReferentielUploadRecapModel;
        this.recapReferentielList = this.referentielUploadRecap.recapReferentielList;
        console.log(this.referentielUploadRecap);
      }, (error) => console.log(error),
      () => {
        this.excelFile = null;
      }
    );
  }

  onSelectFile(event) {
    if (event && event.target.files && event.target.files.length > 0) {
      this.excelFile = event.target.files.item(0);
      if (this.excelFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.excelFile = undefined;
        console.log('please choose an excel file');
      }
    }
  }
}
