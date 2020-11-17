import { ClasseModel } from './../../../../shared/models/classe.model';
import { ConfirmDialogComponent } from './../confirm-dialog/confirm-dialog.component';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { HoraireModel } from 'src/app/shared/models/horaire.model';
import { NiveauSpecialiteModel } from 'src/app/shared/models/niveau-specialite.model';
import { NiveauModel } from 'src/app/shared/models/niveau.model';
import { SousClasseModel } from 'src/app/shared/models/sous-classe.model';
import { SpecialiteModel } from 'src/app/shared/models/specialite.model';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametrageClasseService } from '../../services/parametrage-classe.service';
import { ParametragesBaseService } from '../../services/parametrages-base.service';
import { ParametragesSpecialiteService } from '../../services/parametrages-specialite.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-sous-classe',
  templateUrl: './sous-classe.component.html',
  styleUrls: ['./sous-classe.component.css']
})
export class SousClasseComponent implements OnInit, OnDestroy {
  subscription = [] as Subscription[];
  LOADERID = 'sous-classe-loader';
  dialogRef: any;

  dataSource: MatTableDataSource<SousClasseModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  sousclasseColumnsToDisplay = ['sousclasse', 'niveau', 'specialite', 'horaire', 'status', 'actions'];

  listNiveau = [] as NiveauModel[];
  listSpecialite = [] as NiveauSpecialiteModel[];
  listSousClasse = [] as SousClasseModel[];
  listSousClasseFilter = [] as SousClasseModel[];
  listHoraire = [] as HoraireModel[];

  niveauModel = new NiveauModel();
  specialiteModel = new NiveauSpecialiteModel();
  sousClasseModel = new SousClasseModel();
  horaireModel = new HoraireModel();
  horaireSearch = new HoraireModel();

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
    this.loadListSousClasse();
    this.loadListNiveau();
    this.loadListHoraire();
  }

  search() {
    if (this.horaireSearch && this.horaireSearch.id) {
      this.listSousClasseFilter = this.listSousClasse.filter(x => x.horaire.id === this.horaireSearch.id);
      this.dataSource = new MatTableDataSource<SousClasseModel>(this.listSousClasseFilter);
      this.dataSource.paginator = this.paginator;
    }
  }

  cancelSearch(searchForm) {
    searchForm.resetForm();
    this.horaireSearch = new HoraireModel();
    this.listSousClasseFilter = [];
    this.loadListSousClasse();
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

  loadListSousClasse() {
    this.subscription.push(
      this.paramClasseService.getAllSousClasse().subscribe(
        (data) => {
          this.listSousClasse = data;
          this.dataSource = new MatTableDataSource<SousClasseModel>(this.listSousClasse);
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

  save(addForm) {
    if (this.sousClasseModel.libelle && this.sousClasseModel.libelle.trim() !== ''
      && this.niveauModel.id && this.specialiteModel.id && this.horaireModel.id) {
      this.ngxService.show(this.LOADERID);
      this.sousClasseModel.niveau = this.niveauModel;
      this.sousClasseModel.specialite = this.specialiteModel.specialite;
      this.sousClasseModel.horaire = this.horaireModel;
      this.subscription.push(
        (this.sousClasseModel.id ?
          this.paramClasseService.updateSousClasse(this.sousClasseModel.id, this.sousClasseModel) :
          this.paramClasseService.addSousClasse(this.sousClasseModel)).subscribe(
            (data) => {
              console.log(data);
            }, (error) => {
              if (error.error.message === 'can not bind to any existing classe') {
                const classe = new ClasseModel();
                classe.libelle = this.sousClasseModel.libelle;
                classe.horaire = this.sousClasseModel.horaire;
                classe.niveau = this.sousClasseModel.niveau;
                classe.specialite = this.sousClasseModel.specialite;
                this.onClasseNotExist(classe);
              } else {
                this.notif.error();
                this.ngxService.hide(this.LOADERID);
              }
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
    this.specialiteModel = new NiveauSpecialiteModel();
    this.niveauModel = new NiveauModel();
    this.sousClasseModel = new SousClasseModel();
  }

  onEdit(item) {
    this.sousClasseModel = item as SousClasseModel;
    this.specialiteModel = new NiveauSpecialiteModel();
    this.specialiteModel.specialite = this.sousClasseModel.specialite;
    this.specialiteModel.niveau = this.sousClasseModel.niveau;
    this.niveauModel = this.sousClasseModel.niveau;
    this.horaireModel = this.sousClasseModel.horaire;
    this.loadListSpecialite(this.niveauModel.id);
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

  createClasseAndSousClasse(item) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramClasseService.addClasse(item).subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          this.notif.error();
          this.ngxService.hide(this.LOADERID);
        }, () => {
          this.paramClasseService.addSousClasse(this.sousClasseModel).subscribe(
            (result) => {
              console.log(result);
            }, (error) => {
              console.log(error);
              this.notif.error();
            }, () => {
              this.loadListSousClasse();
              this.notif.success();
              this.ngxService.hide(this.LOADERID);
            }
          );
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

  onClasseNotExist(item) {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20%',
      data: item
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result.rep === true) {
        this.createClasseAndSousClasse(result.item);
      }
    });
  }

  onChangeStatus(value: MatSlideToggleChange, item) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramClasseService.updateSousClasseStatus(value.checked, item.id)
      .subscribe(
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

}
