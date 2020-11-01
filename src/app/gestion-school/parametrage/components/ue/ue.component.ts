import { UeModel } from './../../../../shared/models/ue.model';
import { MentionUEModel } from './../../../../shared/models/mention-ue.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MentionModel } from 'src/app/shared/models/mention.model';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametrageModuleUeService } from '../../services/parametrage-module-ue.service';
import { ParametragesBaseService } from '../../services/parametrages-base.service';

@Component({
  selector: 'app-ue',
  templateUrl: './ue.component.html',
  styleUrls: ['./ue.component.css']
})
export class UeComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  LOADERID = 'ue-loader';
  dialogRef: any;

  listMention = [] as MentionModel[];
  listMentionUE = [] as MentionUEModel[];
  listSelectedMention = [] as MentionModel[];
  listUE = [] as UeModel[];

  ueModel = new UeModel();
  mentionModel = new MentionModel();

  page = 1;

  constructor(
    private paramBaseService: ParametragesBaseService, private dialog: MatDialog,
    private notif: MycustomNotificationService, private ngxService: NgxSpinnerService,
    private paramModuleUE: ParametrageModuleUeService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.ngxService.show(this.LOADERID);
    this.loadListUE();
    this.loadListMention();
  }

  loadListUE() {
    this.subscription.push(
      this.paramModuleUE.getAllUE().subscribe(
        (data) => {
          this.listUE = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
          this.ngxService.hide(this.LOADERID);
        },
        () => {
          this.listUE.forEach(n => {
            this.subscription.push(
              this.paramModuleUE.getAllMentionUEByUE(n.id).subscribe(
                (data) => {
                  n.mentionUE = data;
                }
              )
            );
            this.ngxService.hide(this.LOADERID);
          }
          );
        }
      ));
  }

  loadListMention() {
    this.subscription.push(
      this.paramBaseService.getAllMention().subscribe(
        (data) => {
          this.listMention = data;
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
    if (this.ueModel.libelle && this.ueModel.libelle.trim() !== '') {
      if (this.listSelectedMention && this.listSelectedMention.length > 0) {
        this.ngxService.show(this.LOADERID);
        this.listSelectedMention.forEach(x => {
          const mentionUE = new MentionUEModel();
          mentionUE.mention = x;
          this.listMentionUE.push(mentionUE);
        });
        this.subscription.push(
          (this.ueModel.id ?
            this.paramModuleUE.updateUE(this.ueModel.id, this.ueModel) :
            this.paramModuleUE.addUE(this.ueModel)).subscribe(
              (data) => {
                if (data && data.id) {
                  this.ueModel = data as UeModel;
                  this.saveMentionUE(this.listMentionUE, this.ueModel);
                }
              }, (error) => {
                this.notif.error();
                this.ngxService.hide(this.LOADERID);
              }, () => {
                addForm.resetForm();
                this.clear();
                this.notif.success();
                this.loadListUE();
              }
            )
        );
      } else {
        this.notif.error('Selectionnez au moins une mention');
      }
    } else {
      this.notif.error('Veuillez remplir tous le formulaire SVP');
    }
  }

  clear() {
    this.ueModel = new UeModel();
  }

  saveMentionUE(mentionUEModel: MentionUEModel[], ue: UeModel) {
    mentionUEModel.forEach(x => x.ue = ue);
    this.subscription.push(
      this.paramModuleUE.addMentionUE(mentionUEModel).subscribe(
        (data) => {
        }, (error) => {
          this.notif.error();
          this.ngxService.hide(this.LOADERID);
        }, () => {
          mentionUEModel = [];
          this.listSelectedMention = [];
          this.listMentionUE = [];
          this.loadListUE();
          this.loadListMention();
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }
  onEdit(item) {
    this.ueModel = item as UeModel;
  }

  archive(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramModuleUE.archiveUE(id).subscribe(
        (data) => {
          this.loadListUE();
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
      this.paramModuleUE.updateUEStatus(value.checked, item.id)
      .subscribe(
        (data) => {
          this.loadListUE();
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
