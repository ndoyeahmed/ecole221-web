import { ParametragesBaseService } from './../../services/parametrages-base.service';
import { HoraireModel } from './../../../../shared/models/horaire.model';
import { ClasseModel } from './../../../../shared/models/classe.model';
import { ParametrageClasseService } from './../../services/parametrage-classe.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametragesSpecialiteService } from '../../services/parametrages-specialite.service';
import { NiveauModel } from 'src/app/shared/models/niveau.model';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { NiveauSpecialiteModel } from 'src/app/shared/models/niveau-specialite.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ClasseReferentielModel } from 'src/app/shared/models/classe-referentiel.model';

@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.css']
})
export class ClasseComponent implements OnInit, OnDestroy {
  subscription = [] as Subscription[];
  LOADERID = 'classe-loader';
  dialogRef: any;

  dataSource: MatTableDataSource<ClasseModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  classeColumnsToDisplay = ['classe', 'niveau', 'specialite', 'horaire', 'referentiel', 'status', 'actions'];

  listNiveau = [] as NiveauModel[];
  listSpecialite = [] as NiveauSpecialiteModel[];
  listClasse = [] as ClasseModel[];
  listClasseReferentiel = [] as ClasseReferentielModel[];
  listClasseFilter = [] as ClasseModel[];
  listHoraire = [] as HoraireModel[];

  niveauModel = new NiveauModel();
  specialiteModel = new NiveauSpecialiteModel();
  horaireModel = new HoraireModel();
  horaireSearch = new HoraireModel();
  classeModel = new ClasseModel();

  page = 1;

  constructor(
    private paramSpecialiteService: ParametragesSpecialiteService, private dialog: MatDialog,
    private notif: MycustomNotificationService,
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

  search() {
    if (this.horaireSearch && this.horaireSearch.id) {
      this.listClasseFilter = this.listClasse.filter(x => x.horaire.id === this.horaireSearch.id);
      this.dataSource = new MatTableDataSource<ClasseModel>(this.listClasseFilter);
      this.dataSource.paginator = this.paginator;
    }
  }

  cancelSearch(searchForm) {
    searchForm.resetForm();
    this.horaireSearch = new HoraireModel();
    this.listClasseFilter = [];
    this.loadListClasse();
  }

  loadListClasse() {
    this.subscription.push(
      this.paramClasseService.getAllClasseReferentiel().subscribe(
        (classeref) => {
          this.listClasseReferentiel = classeref;
        }, (error) => console.log(error),
        () => {
          this.paramClasseService.getAllClasse().subscribe(
            (data) => {
              this.listClasse = data;
            },
            (error) => {
              this.notif.error('Echec de chargement des données');

            },
            () => {
              this.listClasse.forEach(x => {
                this.listClasseReferentiel.forEach(s => {
                  if (s.classe.id === x.id) {
                    x.ref = s.referentiel;
                  }
                });
              });
              this.dataSource = new MatTableDataSource<ClasseModel>(this.listClasse);
              this.dataSource.paginator = this.paginator;

            }
          );
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

        },
        () => {

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

        },
        () => {

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

        },
        () => {

        }
      )
    );
  }

  save(addForm) {
    if (this.classeModel.libelle && this.classeModel.libelle.trim() !== ''
      && this.niveauModel.id && this.specialiteModel.specialite && this.horaireModel.id) {

      this.classeModel.niveau = this.niveauModel;
      this.classeModel.specialite = this.specialiteModel.specialite;
      this.classeModel.horaire = this.horaireModel;
      console.log(this.specialiteModel);
      this.subscription.push(
        (this.classeModel.id ?
          this.paramClasseService.updateClasse(this.classeModel.id, this.classeModel) :
          this.paramClasseService.addClasse(this.classeModel)).subscribe(
            (data) => {
              console.log(data);
            }, (error) => {
              this.notif.error();

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
    this.specialiteModel = new NiveauSpecialiteModel();
    this.niveauModel = new NiveauModel();
    this.classeModel = new ClasseModel();
    this.horaireModel = new HoraireModel();
  }

  onEdit(item) {
    this.classeModel = item as ClasseModel;
    this.specialiteModel = new NiveauSpecialiteModel();
    this.specialiteModel.specialite = this.classeModel.specialite;
    this.specialiteModel.niveau = this.classeModel.niveau;
    this.niveauModel = this.classeModel.niveau;
    this.horaireModel = this.classeModel.horaire;
    this.loadListSpecialite(this.niveauModel.id);
  }

  archive(id) {

    this.subscription.push(
      this.paramClasseService.archiveClasse(id).subscribe(
        (data) => {
          this.loadListClasse();
          this.notif.success();
        },
        (error) => {
          this.notif.error();

        }, () => {

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

    this.subscription.push(
      this.paramClasseService.updateClasseStatus(value.checked, item.id)
      .subscribe(
        (data) => {
          this.loadListClasse();
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
