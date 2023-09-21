import { SharedService } from './../../../../shared/services/shared.service';
import { MentionModel } from './../../../../shared/models/mention.model';
import { NiveauSpecialiteModel } from './../../../../shared/models/niveau-specialite.model';
import { SpecialiteModel } from './../../../../shared/models/specialite.model';
import { NiveauModel } from './../../../../shared/models/niveau.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametragesSpecialiteService } from '../../services/parametrages-specialite.service';
import { ParametragesBaseService } from '../../services/parametrages-base.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-specialite',
  templateUrl: './specialite.component.html',
  styleUrls: ['./specialite.component.css']
})
export class SpecialiteComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  LOADERID = 'specialite-loader';
  dialogRef: any;

  dataSource: MatTableDataSource<SpecialiteModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  specialiteColumnsToDisplay = ['specialite', 'mention', 'niveau', 'status', 'actions'];

  listNiveau = [] as NiveauModel[];
  listSpecialite = [] as SpecialiteModel[];
  listSelectedNiveau = [] as NiveauSpecialiteModel[];
  listSelectedNiveauUpdate = [] as NiveauModel[];
  listMention = [] as MentionModel[];

  specialiteModel = new SpecialiteModel();
  mentionModel = new MentionModel();

  page = 1;

  onNewNiveauSpecialite = false;

  constructor(
    private paramSpecialiteService: ParametragesSpecialiteService, private dialog: MatDialog,
    private notif: MycustomNotificationService,
    private paramBaseService: ParametragesBaseService, private sharedService: SharedService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {

    this.loadListSpecialite();
    this.loadListMention();
    this.loadListNiveau();

    this.sharedService.isVisibleSource.subscribe(
      (data) => {
        if (data) {
          this.loadListNiveau();
          this.loadListMention();
        }
      }
    );
  }

  onAddNiveauSpecialite() {
    this.onNewNiveauSpecialite = true;
    this.listSelectedNiveauUpdate = [];
  }

  loadListSpecialite() {
    this.subscription.push(
      this.paramSpecialiteService.getAllSpecialite().subscribe(
        (data) => {
          this.listSpecialite = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');

        },
        () => {
          if (this.listSpecialite.length > 0) {
            this.listSpecialite.forEach(n => {
              this.subscription.push(
                this.paramSpecialiteService.getAllNiveauSpecialiteBySpecialite(n.id).subscribe(
                  (data) => {
                    n.niveauSpecialite = data;
                  }
                )
              );
              this.dataSource = new MatTableDataSource<SpecialiteModel>(this.listSpecialite);
              this.dataSource.paginator = this.paginator;

            }
            );
          } else {
            this.dataSource = new MatTableDataSource<SpecialiteModel>(this.listSpecialite);
            this.dataSource.paginator = this.paginator;

          }
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

        },
        () => {

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

        },
        () => {

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

        this.specialiteModel.mention = this.mentionModel;
        const body = {
          specialite: this.specialiteModel,
          niveauSpecialites: this.listSelectedNiveau
        };
        this.subscription.push(
          (this.specialiteModel.id ?
            this.paramSpecialiteService.updateSpecialite(this.specialiteModel.id, this.specialiteModel) :
            this.paramSpecialiteService.addSpecialite(body)).subscribe(
              (data) => {
                console.log(data);
                /* if (data && data.id) {
                  this.specialiteModel = data as SpecialiteModel;
                  this.saveNiveauSpecialite(this.listSelectedNiveau, this.specialiteModel);
                } */
              }, (error) => {
                this.notif.error();

              }, () => {
                addForm.resetForm();
                this.clear();
                this.notif.success();
                this.loadListNiveau();
                this.loadListSpecialite();
              }
            )
        );
      } else {
        this.notif.error('Selectionnez au moins un niveau');
      }
    } else {
      this.notif.error('Veuillez remplir tout le formulaire SVP');
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

        }, () => {
          niveauSpecialite = [];
          this.listSelectedNiveau = [];
          this.loadListSpecialite();
          this.loadListNiveau();

        }
      )
    );
  }

  saveNiveauSpecialite2(specialite: SpecialiteModel) {
    this.listSelectedNiveau = [];
    if (this.listSelectedNiveauUpdate && this.listSelectedNiveauUpdate.length > 0) {
      this.listSelectedNiveauUpdate.forEach(x => {
        const niveauSpec = new NiveauSpecialiteModel();
        niveauSpec.niveau = x;
        niveauSpec.specialite = specialite;
        this.listSelectedNiveau.push(niveauSpec);
      });
      this.subscription.push(
        this.paramSpecialiteService.addNiveauSpecialite(this.listSelectedNiveau).subscribe(
          (data) => {
            console.log(data);
          }, (error) => {
            this.onNewNiveauSpecialite = false;
            this.notif.error();

          }, () => {
            this.onNewNiveauSpecialite = false;
            this.listSelectedNiveauUpdate = [];
            this.listSelectedNiveau = [];
            this.notif.success();
            this.loadListSpecialite();

          }
        )
      );
    } else {
      this.notif.error('Veuillez remplir tout le formulaire SVP');
    }
  }

  onEdit(item) {
    this.specialiteModel = item as SpecialiteModel;
    this.mentionModel = this.specialiteModel.mention;
  }

  archiveSpecialite(id) {

    this.subscription.push(
      this.paramSpecialiteService.archiveSpecialite(id).subscribe(
        (data) => {
          // this.loadListSpecialite();
          this.notif.success();
        },
        (error) => {
          this.notif.error();

        }, () => {

          this.loadListSpecialite();
        }
      )
    );
  }

  archiveNiveauSpecialite(id) {

    this.subscription.push(
      this.paramSpecialiteService.archiveNiveauSpecialite(id).subscribe(
        (data) => {
          // this.loadListSpecialite();
          this.notif.success();
        },
        (error) => {
          this.notif.error();

        }, () => {

          this.loadListSpecialite();
        }
      )
    );
  }

  openDialog(item, modelToArchive: string): void {
    this.dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '20%',
      data: item
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result.rep === true) {
        if (modelToArchive === 'niveau') {
          this.archiveNiveauSpecialite(result.item.id);
        } else {
          this.archiveSpecialite(result.item.id);
        }
      }
    });
  }

  onChangeStatus(value: MatSlideToggleChange, item) {

    this.subscription.push(
      this.paramSpecialiteService.updateSpecialiteStatus(value.checked, item.id)
        .subscribe(
          (data) => {
            this.loadListSpecialite();
            this.notif.success();
          },
          (error) => {
            this.notif.error();

          }, () => {

          }
        )
    );
  }

}
