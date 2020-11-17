import { HoraireModel } from './../../../../shared/models/horaire.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametragesBaseService } from '../../services/parametrages-base.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-horaire',
  templateUrl: './horaire.component.html',
  styleUrls: ['./horaire.component.css']
})
export class HoraireComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  LOADERID = 'horaire-loader';
  dialogRef: any;

  dataSource: MatTableDataSource<HoraireModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  horaireColumnsToDisplay = ['horaire', 'actions'];

  listHoraire = [] as HoraireModel[];
  horaireModel = new HoraireModel();

  constructor(
    private paramBaseService: ParametragesBaseService, private dialog: MatDialog,
    private notif: MycustomNotificationService, private ngxService: NgxSpinnerService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.ngxService.show(this.LOADERID);
    this.loadListHoraire();
  }

  loadListHoraire() {
    this.subscription.push(
      this.paramBaseService.getAllHoraire().subscribe(
        (data) => {
          this.listHoraire = data;
          this.dataSource = new MatTableDataSource<HoraireModel>(this.listHoraire);
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

  save() {
    if (this.horaireModel.libelle && this.horaireModel.libelle.trim() !== '') {
      this.ngxService.show(this.LOADERID);
      this.subscription.push(
        (this.horaireModel.id ?
          this.paramBaseService.updateHoraire(this.horaireModel.id, this.horaireModel) :
          this.paramBaseService.addHoraire(this.horaireModel)).subscribe(
            (data) => {
              this.loadListHoraire();
              this.horaireModel = new HoraireModel();
              this.notif.success();
            }, (error) => {
              this.notif.error();
              this.ngxService.hide(this.LOADERID);
            }, () => {
              this.ngxService.hide(this.LOADERID);
            }
          )
      );
    }
  }

  onEdit(item) {
    this.horaireModel = item as HoraireModel;
  }

  archive(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramBaseService.archiveHoraire(id).subscribe(
        (data) => {
          this.loadListHoraire();
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

}
