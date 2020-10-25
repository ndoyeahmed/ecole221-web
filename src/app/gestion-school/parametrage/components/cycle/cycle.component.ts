import { CycleModel } from './../../../../shared/models/cycle.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametragesBaseService } from '../../services/parametrages-base.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-cycle',
  templateUrl: './cycle.component.html',
  styleUrls: ['./cycle.component.css']
})
export class CycleComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  LOADERID = 'cycle-loader';
  dialogRef: any;

  listCycle = [] as CycleModel[];
  cycleModel = new CycleModel();

  constructor(
    private paramBaseService: ParametragesBaseService, private dialog: MatDialog,
    private notif: MycustomNotificationService, private ngxService: NgxSpinnerService
  ) { }
  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.ngxService.show(this.LOADERID);
    this.loadListCycle();
  }

  loadListCycle() {
    this.subscription.push(
      this.paramBaseService.getAllCycle().subscribe(
        (data) => {
          this.listCycle = data;
        }, (error) => {
          this.notif.error('Echec de chargement des données');
          this.ngxService.hide(this.LOADERID);
        }, () => {
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }

  save() {
    if (this.cycleModel.cycle && this.cycleModel.cycle.trim() !== '') {
      this.ngxService.show(this.LOADERID);
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
              this.ngxService.hide(this.LOADERID);
            }, () => {
              this.ngxService.hide(this.LOADERID);
            }
          )
      );
    }
  }

  onEdit(item) {
    this.cycleModel = item as CycleModel;
  }

  archive(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramBaseService.archiveCycle(id).subscribe(
        (data) => {
          this.loadListCycle();
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
      this.paramBaseService.updateCycleStatus(value.checked, item.id)
      .subscribe(
        (data) => {
          this.loadListCycle();
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
