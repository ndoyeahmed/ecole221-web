import { MentionModel } from './../../../../shared/models/mention.model';
import { NiveauSpecialiteModel } from './../../../../shared/models/niveau-specialite.model';
import { SpecialiteModel } from './../../../../shared/models/specialite.model';
import { NiveauModel } from './../../../../shared/models/niveau.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametragesSpecialiteService } from '../../services/parametrages-specialite.service';
import { ParametragesBaseService } from '../../services/parametrages-base.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-specialite',
  templateUrl: './specialite.component.html',
  styleUrls: ['./specialite.component.css']
})
export class SpecialiteComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  LOADERID = 'specialite-loader';
  dialogRef: any;

  listNiveau = [] as NiveauModel[];
  listSpecialite = [] as SpecialiteModel[];
  listSelectedNiveau = [] as NiveauSpecialiteModel[];
  listMention = [] as MentionModel[];

  specialiteModel = new SpecialiteModel();
  mentionModel = new MentionModel();

  page = 1;

  constructor(
    private paramSpecialiteService: ParametragesSpecialiteService, private dialog: MatDialog,
    private notif: MycustomNotificationService, private ngxService: NgxSpinnerService,
    private paramBaseService: ParametragesBaseService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.ngxService.show(this.LOADERID);
    this.loadListSpecialite();
    this.loadListMention();
    this.loadListNiveau();
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
          this.listSpecialite.forEach(n => {
            this.subscription.push(
              this.paramSpecialiteService.getAllNiveauSpecialiteBySpecialite(n.id).subscribe(
                (data) => {
                  n.niveauSpecialite = data;
                }
              )
            );
            this.ngxService.hide(this.LOADERID);
          }
          );
        }
      ));
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

  loadListMention() {
    this.subscription.push(
      this.paramBaseService.getAllMention().subscribe(
        (data) => {
          this.listMention = data;
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

  onCheckedNiveau(event: MatCheckboxChange, niveau) {
    if (event.checked === true) {
      const niveauSpecialiteModel = new NiveauSpecialiteModel();
      niveauSpecialiteModel.niveau = niveau;
      this.listSelectedNiveau.push(niveauSpecialiteModel);
    } else {
      this.listSelectedNiveau = this.listSelectedNiveau.filter(sn => Number(sn.niveau.id) !== Number(niveau.id));
    }

    console.log(this.listSelectedNiveau);
  }

  save(addForm) {
    if (this.specialiteModel.libelle && this.specialiteModel.libelle.trim() !== ''
      && this.mentionModel.id) {
      if (this.listSelectedNiveau && this.listSelectedNiveau.length > 0) {
        this.ngxService.show(this.LOADERID);
        this.specialiteModel.mention = this.mentionModel;
        this.subscription.push(
          (this.specialiteModel.id ?
            this.paramSpecialiteService.updateSpecialite(this.specialiteModel.id, this.specialiteModel) :
            this.paramSpecialiteService.addSpecialite(this.specialiteModel)).subscribe(
              (data) => {
                console.log(data);
                if (data && data.id) {
                  this.specialiteModel = data as SpecialiteModel;
                  this.saveNiveauSpecialite(this.listSelectedNiveau, this.specialiteModel);
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
        this.notif.error('Selectionnez au moins un niveau');
      }
    } else {
      this.notif.error('Veuillez remplir tous le formulaire SVP');
    }
  }

  clear() {
    this.specialiteModel = new SpecialiteModel();
    this.mentionModel = new MentionModel();
  }

  saveNiveauSpecialite(niveauSpecialite: NiveauSpecialiteModel[], specialite: SpecialiteModel) {
    niveauSpecialite.forEach(x => x.specialite = specialite);
    this.subscription.push(
      this.paramSpecialiteService.addNiveauSpecialite(niveauSpecialite).subscribe(
        (data) => {
          console.log(data);
        }, (error) => {
          this.notif.error();
          this.ngxService.hide(this.LOADERID);
        }, () => {
          niveauSpecialite = [];
          this.listSelectedNiveau = [];
          this.loadListSpecialite();
          this.loadListNiveau();
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }
  onEdit(item) {
    this.specialiteModel = item as SpecialiteModel;
    this.mentionModel = this.specialiteModel.mention;
  }

  archive(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramSpecialiteService.archiveSpecialite(id).subscribe(
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
  }

}
