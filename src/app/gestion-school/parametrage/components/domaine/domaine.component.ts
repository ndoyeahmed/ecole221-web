import { DomaineModel } from './../../../../shared/models/domaine.model';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametragesBaseService } from '../../services/parametrages-base.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-domaine',
  templateUrl: './domaine.component.html',
  styleUrls: ['./domaine.component.css']
})
export class DomaineComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  LOADERID = 'domaine-loader';
  dialogRef: any;

  dataSource: MatTableDataSource<DomaineModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  domaineColumnsToDisplay = ['domaine', 'status', 'actions'];

  listDomaine = [] as DomaineModel[];
  domaineModel = new DomaineModel();

  constructor(
    private paramBaseService: ParametragesBaseService, private dialog: MatDialog,
    private notif: MycustomNotificationService, private ngxService: NgxSpinnerService
  ) {
  }
  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.ngxService.show(this.LOADERID);
    this.loadListDomaine();
  }

  loadListDomaine() {
    this.subscription.push(
      this.paramBaseService.getAllDomaine().subscribe(
        (data) => {
          this.listDomaine = data;
          this.dataSource = new MatTableDataSource<DomaineModel>(this.listDomaine);
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
    if (this.domaineModel.libelle && this.domaineModel.libelle.trim() !== '') {
      this.ngxService.show(this.LOADERID);
      this.subscription.push(
        (this.domaineModel.id ?
          this.paramBaseService.updateDomaine(this.domaineModel.id, this.domaineModel) :
          this.paramBaseService.addDomaine(this.domaineModel)).subscribe(
            (data) => {
              this.loadListDomaine();
              this.domaineModel = new DomaineModel();
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
    this.domaineModel = item as DomaineModel;
  }

  archive(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramBaseService.archiveDomaine(id).subscribe(
        (data) => {
          this.loadListDomaine();
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
      this.paramBaseService.updateDomaineStatus(value.checked, item.id)
      .subscribe(
        (data) => {
          this.loadListDomaine();
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
