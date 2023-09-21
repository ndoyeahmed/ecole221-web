import { CycleModel } from './../../../../shared/models/cycle.model';
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
  selector: 'app-cycle',
  templateUrl: './cycle.component.html',
  styleUrls: ['./cycle.component.css']
})
export class CycleComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  LOADERID = 'cycle-loader';
  dialogRef: any;

  dataSource: MatTableDataSource<CycleModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  cycleColumnsToDisplay = ['cycle', 'status', 'actions'];

  listCycle = [] as CycleModel[];
  cycleModel = new CycleModel();

  constructor(
    private paramBaseService: ParametragesBaseService, private dialog: MatDialog,
    private notif: MycustomNotificationService
  ) { }
  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {

    this.loadListCycle();
  }

  loadListCycle() {
    this.subscription.push(
      this.paramBaseService.getAllCycle().subscribe(
        (data) => {
          this.listCycle = data;
          this.dataSource = new MatTableDataSource<CycleModel>(this.listCycle);
          this.dataSource.paginator = this.paginator;
        }, (error) => {
          this.notif.error('Echec de chargement des données');

        }, () => {

        }
      )
    );
  }

  save() {
    if (this.cycleModel.cycle && this.cycleModel.cycle.trim() !== '') {

      this.subscription.push(
        (this.cycleModel.id ?
          this.paramBaseService.updateCycle(this.cycleModel.id, this.cycleModel) :
          this.paramBaseService.addCycle(this.cycleModel)).subscribe(
            (data) => {
              this.loadListCycle();
              this.cycleModel = new CycleModel();
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
    this.cycleModel = item as CycleModel;
  }

  archive(id) {

    this.subscription.push(
      this.paramBaseService.archiveCycle(id).subscribe(
        (data) => {
          this.loadListCycle();
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
      this.paramBaseService.updateCycleStatus(value.checked, item.id)
      .subscribe(
        (data) => {
          this.loadListCycle();
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
