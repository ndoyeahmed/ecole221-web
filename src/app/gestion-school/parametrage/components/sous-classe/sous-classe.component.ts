import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { NiveauModel } from 'src/app/shared/models/niveau.model';
import { SousClasseModel } from 'src/app/shared/models/sous-classe.model';
import { SpecialiteModel } from 'src/app/shared/models/specialite.model';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametrageClasseService } from '../../services/parametrage-classe.service';
import { ParametragesSpecialiteService } from '../../services/parametrages-specialite.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-sous-classe',
  templateUrl: './sous-classe.component.html',
  styleUrls: ['./sous-classe.component.css']
})
export class SousClasseComponent implements OnInit, OnDestroy {
  subscription = [] as Subscription[];
  LOADERID = 'specialite-loader';
  dialogRef: any;

  listNiveau = [] as NiveauModel[];
  listSpecialite = [] as SpecialiteModel[];
  listSousClasse = [] as SousClasseModel[];

  niveauModel = new NiveauModel();
  specialiteModel = new SpecialiteModel();
  sousClasseModel = new SousClasseModel();

  page = 1;

  constructor(
    private paramSpecialiteService: ParametragesSpecialiteService, private dialog: MatDialog,
    private notif: MycustomNotificationService, private ngxService: NgxSpinnerService,
    private paramClasseService: ParametrageClasseService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.loadListSousClasse();
    this.loadListNiveau();
    this.loadListSpecialite();
  }

  loadListSousClasse() {
    this.subscription.push(
      this.paramClasseService.getAllSousClasse().subscribe(
        (data) => {
          this.listSousClasse = data;
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

  save(addForm) {
    if (this.sousClasseModel.libelle && this.sousClasseModel.libelle.trim() !== ''
      && this.niveauModel.id && this.specialiteModel.id) {
      this.ngxService.show(this.LOADERID);
      this.sousClasseModel.niveau = this.niveauModel;
      this.sousClasseModel.specialite = this.specialiteModel;
      this.subscription.push(
        (this.sousClasseModel.id ?
          this.paramClasseService.updateSousClasse(this.sousClasseModel.id, this.sousClasseModel) :
          this.paramClasseService.addSousClasse(this.sousClasseModel)).subscribe(
            (data) => {
              console.log(data);
            }, (error) => {
              this.notif.error();
              this.ngxService.hide(this.LOADERID);
            }, () => {
              addForm.resetForm();
              this.clear();
              this.notif.success();
              this.loadListSousClasse();
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
    this.sousClasseModel = new SousClasseModel();
  }

  onEdit(item) {
    this.sousClasseModel = item as SousClasseModel;
    this.specialiteModel = this.sousClasseModel.specialite;
    this.niveauModel = this.sousClasseModel.niveau;
  }

  archive(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramClasseService.archiveSousClasse(id).subscribe(
        (data) => {
          this.loadListSousClasse();
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
