import { UeModel } from './../../../../shared/models/ue.model';
import { MentionUEModel } from './../../../../shared/models/mention-ue.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MentionModel } from 'src/app/shared/models/mention.model';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametrageModuleUeService } from '../../services/parametrage-module-ue.service';
import { ParametragesBaseService } from '../../services/parametrages-base.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-ue',
  templateUrl: './ue.component.html',
  styleUrls: ['./ue.component.css']
})
export class UeComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  LOADERID = 'ue-loader';
  dialogRef: any;

  dataSource: MatTableDataSource<UeModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ueColumnsToDisplay = ['code', 'ue', 'mention', 'status', 'actions'];

  listMention = [] as MentionModel[];
  listMentionUE = [] as MentionUEModel[];
  listSelectedMention = [] as MentionModel[];
  listSelectedMentionUpdate = [] as MentionModel[];
  listUE = [] as UeModel[];

  ueModel = new UeModel();
  mentionModel = new MentionModel();

  page = 1;

  onNewUEMention = false;

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

  onAddMentionUE() {
    this.onNewUEMention = true;
    this.listSelectedMentionUpdate = [];
  }

  saveMentionUE2(ue: UeModel) {
    this.listMentionUE = [];
    if (this.listSelectedMentionUpdate && this.listSelectedMentionUpdate.length > 0) {
      this.listSelectedMentionUpdate.forEach(x => {
        const mentionUE = new MentionUEModel();
        mentionUE.mention = x;
        mentionUE.ue = ue;
        this.listMentionUE.push(mentionUE);
      });
      this.subscription.push(
        this.paramModuleUE.addMentionUE(this.listMentionUE).subscribe(
          (data) => {
            console.log(data);
          }, (error) => {
            this.onNewUEMention = false;
            this.notif.error();
            this.ngxService.hide(this.LOADERID);
          }, () => {
            this.onNewUEMention = false;
            this.listSelectedMentionUpdate = [];
            this.listMentionUE = [];
            this.notif.success();
            this.loadListUE();
            this.ngxService.hide(this.LOADERID);
          }
        )
      );
    } else {
      this.notif.error('Veuillez remplir tout le formulaire SVP');
    }
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
            this.dataSource = new MatTableDataSource<UeModel>(this.listUE);
            this.dataSource.paginator = this.paginator;
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
                if (!this.ueModel.id) {
                  if (data && data.id) {
                    this.ueModel = data as UeModel;
                    this.saveMentionUE(this.listMentionUE, this.ueModel);
                  } else {
                    this.listSelectedMention = [];
                  }
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
    this.listSelectedMention = [];
    this.ueModel = item as UeModel;
    item.mentionUE.forEach(x => this.listSelectedMention.push(x.mention));
  }

  comparer(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o2 === o2;
  }

  archiveUE(id) {
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

  archiveMentionModule(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramModuleUE.archiveMentionModule(id).subscribe(
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

  openDialog(item, modelToArchive: string): void {
    this.dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '20%',
      data: item
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result.rep === true) {
        if (modelToArchive === 'mention') {
          this.archiveMentionModule(result.item.id);
        } else {
          this.archiveUE(result.item.id);
        }
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
