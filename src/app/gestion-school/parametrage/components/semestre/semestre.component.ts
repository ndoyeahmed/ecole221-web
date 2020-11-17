import { ParametragesSpecialiteService } from './../../services/parametrages-specialite.service';
import { SemestreModel } from './../../../../shared/models/semestre.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-semestre',
  templateUrl: './semestre.component.html',
  styleUrls: ['./semestre.component.css']
})
export class SemestreComponent implements OnInit, OnDestroy {
  subscription = [] as Subscription[];
  LOADERID = 'semestre-loader';
  dialogRef: any;

  dataSource: MatTableDataSource<SemestreModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  semestreColumnsToDisplay = ['semestre', 'status', 'actions'];

  listSemestre = [] as SemestreModel[];
  semestreModel = new SemestreModel();

  constructor(
    private paramSpecialiteService: ParametragesSpecialiteService, private dialog: MatDialog,
    private notif: MycustomNotificationService, private ngxService: NgxSpinnerService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.ngxService.show(this.LOADERID);
    this.loadListSemestre();
  }

  loadListSemestre() {
    this.subscription.push(
      this.paramSpecialiteService.getAllSemestre().subscribe(
        (data) => {
          this.listSemestre = data;
          this.dataSource = new MatTableDataSource<SemestreModel>(this.listSemestre);
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
    if (this.semestreModel.libelle && this.semestreModel.libelle.trim() !== '') {
      this.ngxService.show(this.LOADERID);
      this.subscription.push(
        (this.semestreModel.id ?
          this.paramSpecialiteService.updateSemestre(this.semestreModel.id, this.semestreModel) :
          this.paramSpecialiteService.addSemestre(this.semestreModel)).subscribe(
            (data) => {
              this.loadListSemestre();
              this.semestreModel = new SemestreModel();
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
    this.semestreModel = item as SemestreModel;
  }

  archive(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramSpecialiteService.archiveSemestre(id).subscribe(
        (data) => {
          this.loadListSemestre();
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
      this.paramSpecialiteService.updateSemestreStatus(value.checked, item.id)
      .subscribe(
        (data) => {
          this.loadListSemestre();
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
