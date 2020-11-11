import { ParametragesBaseService } from './../../services/parametrages-base.service';
import { HoraireModel } from './../../../../shared/models/horaire.model';
import { ClasseModel } from './../../../../shared/models/classe.model';
import { ParametrageClasseService } from './../../services/parametrage-classe.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametragesSpecialiteService } from '../../services/parametrages-specialite.service';
import { NiveauModel } from 'src/app/shared/models/niveau.model';
import { SpecialiteModel } from 'src/app/shared/models/specialite.model';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { NiveauSpecialiteModel } from 'src/app/shared/models/niveau-specialite.model';

@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.css']
})
export class ClasseComponent implements OnInit, OnDestroy {
  subscription = [] as Subscription[];
  LOADERID = 'specialite-loader';
  dialogRef: any;

  listNiveau = [] as NiveauModel[];
  listSpecialite = [] as NiveauSpecialiteModel[];
  listClasse = [] as ClasseModel[];
  listHoraire = [] as HoraireModel[];

  niveauModel = new NiveauModel();
  specialiteModel = new SpecialiteModel();
  horaireModel = new HoraireModel();
  classeModel = new ClasseModel();

  page = 1;

  constructor(
    private paramSpecialiteService: ParametragesSpecialiteService, private dialog: MatDialog,
    private notif: MycustomNotificationService, private ngxService: NgxSpinnerService,
    private paramClasseService: ParametrageClasseService, private paramBaseService: ParametragesBaseService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.loadListClasse();
    this.loadListNiveau();
    this.loadListHoraire();
  }

  loadListClasse() {
    this.subscription.push(
      this.paramClasseService.getAllClasse().subscribe(
        (data) => {
          this.listClasse = data;
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
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
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

  loadListHoraire() {
    this.subscription.push(
      this.paramBaseService.getAllHoraire().subscribe(
        (data) => {
          this.listHoraire = data;
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

  save(addForm) {
    if (this.classeModel.libelle && this.classeModel.libelle.trim() !== ''
      && this.niveauModel.id && this.specialiteModel.id && this.horaireModel.id) {
      this.ngxService.show(this.LOADERID);
      this.classeModel.niveau = this.niveauModel;
      this.classeModel.specialite = this.specialiteModel;
      this.classeModel.horaire = this.horaireModel;
      this.subscription.push(
        (this.classeModel.id ?
          this.paramClasseService.updateClasse(this.classeModel.id, this.classeModel) :
          this.paramClasseService.addClasse(this.classeModel)).subscribe(
            (data) => {
              console.log(data);
            }, (error) => {
              this.notif.error();
              this.ngxService.hide(this.LOADERID);
            }, () => {
              addForm.resetForm();
              this.clear();
              this.notif.success();
              this.loadListClasse();
            }
          )
      );
    } else {
      this.notif.error('Veuillez remplir tout le formulaire SVP');
    }
  }

  clear() {
    this.specialiteModel = new SpecialiteModel();
    this.niveauModel = new NiveauModel();
    this.classeModel = new ClasseModel();
    this.horaireModel = new HoraireModel();
  }

  onEdit(item) {
    this.classeModel = item as ClasseModel;
    this.specialiteModel = this.classeModel.specialite;
    this.niveauModel = this.classeModel.niveau;
    this.horaireModel = this.classeModel.horaire;
  }

  archive(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramClasseService.archiveClasse(id).subscribe(
        (data) => {
          this.loadListClasse();
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

  /* onChangeStatus(value: MatSlideToggleChange, item) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramSpecialiteService.updateSpecialiteStatus(value.checked, item.id)
        .subscribe(
          (data) => {
            this.loadListSpecialite();
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
  } */

}
