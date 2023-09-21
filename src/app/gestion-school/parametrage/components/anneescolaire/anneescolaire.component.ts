import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { DeleteDialogComponent } from './../delete-dialog/delete-dialog.component';
import { ParametragesBaseService } from './../../services/parametrages-base.service';
import { AnneeScolaireModel } from './../../../../shared/models/annee-scolaire.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-anneescolaire',
  templateUrl: './anneescolaire.component.html',
  styleUrls: ['./anneescolaire.component.css']
})
export class AnneescolaireComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  listAnneeScolaire = [] as AnneeScolaireModel[];
  anneeScolaire = new AnneeScolaireModel();
  dataSource: MatTableDataSource<AnneeScolaireModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  anneeColumnsToDisplay = ['anneescolaire', 'encours', 'status', 'actions'];

  LOADERID = 'annee-scolaire-loader';

  dialogRef: any;

  constructor(private paramBaseService: ParametragesBaseService, private dialog: MatDialog,
              private notif: MycustomNotificationService) { }

  ngOnInit(): void {
    this.loadListAnneeScolaire();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  loadListAnneeScolaire() {
    this.subscription.push(
      this.paramBaseService.getAllAnneeScolaire().subscribe(
        (data) => {
          this.listAnneeScolaire = data;
          this.dataSource = new MatTableDataSource<AnneeScolaireModel>(this.listAnneeScolaire);
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          this.notif.error('Echec chargement des données');

        },
        () => {

        }
      )
    );
  }

  save() {
    if (this.anneeScolaire.libelle && this.anneeScolaire.libelle.trim() !== '') {
      
      this.subscription.push(
        (this.anneeScolaire.id ?
          this.paramBaseService.updateAnneeScolaire(this.anneeScolaire, this.anneeScolaire.id) :
          this.paramBaseService.addAnneeScolaire(this.anneeScolaire)).subscribe(
            (data) => {
              this.loadListAnneeScolaire();
              this.anneeScolaire = new AnneeScolaireModel();
              this.notif.success();
            },
            (error) => {
              this.notif.error();

            }, () => {

            }
          )
      );
    } else {
      this.notif.error('Le libellé est obligatoire');
    }
  }

  onEdit(item) {
    this.anneeScolaire = item as AnneeScolaireModel;
  }

  archive(id) {
    
    this.subscription.push(
      this.paramBaseService.archiveAnneeScolaire(id).subscribe(
        (data) => {
          this.loadListAnneeScolaire();
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
      this.paramBaseService.updateAnneeScolaireEnCoursStatus(value.checked, item.id)
      .subscribe(
        (data) => {
          this.loadListAnneeScolaire();
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
