import { ParcoursModel } from './../../../../shared/models/parcours.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametragesBaseService } from '../../services/parametrages-base.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-parcours',
  templateUrl: './parcours.component.html',
  styleUrls: ['./parcours.component.css']
})
export class ParcoursComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  LOADERID = 'parcours-loader';
  dialogRef: any;

  dataSource: MatTableDataSource<ParcoursModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  parcoursColumnsToDisplay = ['parcours', 'status', 'actions'];

  listParcours = [] as ParcoursModel[];
  parcours = new ParcoursModel();

  constructor(
    private paramBaseService: ParametragesBaseService, private dialog: MatDialog,
    private notif: MycustomNotificationService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {

    this.loadListParcours();
  }

  loadListParcours() {
    this.subscription.push(
      this.paramBaseService.getAllParcours().subscribe(
        (data) => {
          this.listParcours = data;
          this.dataSource = new MatTableDataSource<ParcoursModel>(this.listParcours);
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');

        },
        () => {

        }
      )
    );
  }

  save() {
    if (this.parcours.libelle && this.parcours.libelle.trim() !== '') {

      this.subscription.push(
        (this.parcours.id ?
          this.paramBaseService.updateParcours(this.parcours.id, this.parcours) :
          this.paramBaseService.addParcours(this.parcours)).subscribe(
            (data) => {
              this.loadListParcours();
              this.parcours = new ParcoursModel();
              this.notif.success();
            }, (error) => {
              this.notif.error();

            }, () => {

            }
          )
      );
    }
  }

  onEdit(item) {
    this.parcours = item as ParcoursModel;
  }

  archive(id) {

    this.subscription.push(
      this.paramBaseService.archiveParcours(id).subscribe(
        (data) => {
          this.loadListParcours();
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
      this.paramBaseService.updateParcoursStatus(value.checked, item.id)
      .subscribe(
        (data) => {
          this.loadListParcours();
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
