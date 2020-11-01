import { ParametrageModuleUeService } from './../../services/parametrage-module-ue.service';
import { MentionModuleModel } from './../../../../shared/models/mention-module.model';
import { ModuleModel } from './../../../../shared/models/module.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { MentionModel } from 'src/app/shared/models/mention.model';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametragesBaseService } from '../../services/parametrages-base.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  LOADERID = 'module-loader';
  dialogRef: any;

  listMention = [] as MentionModel[];
  listMentionModule = [] as MentionModuleModel[];
  listSelectedMention = [] as MentionModel[];
  listModule = [] as ModuleModel[];

  moduleModel = new ModuleModel();
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
    this.loadListModule();
    this.loadListMention();
  }

  loadListModule() {
    this.subscription.push(
      this.paramModuleUE.getAllModule().subscribe(
        (data) => {
          this.listModule = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
          this.ngxService.hide(this.LOADERID);
        },
        () => {
          this.listModule.forEach(n => {
            this.subscription.push(
              this.paramModuleUE.getAllMentionModuleByModule(n.id).subscribe(
                (data) => {
                  n.mentionModule = data;
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
    if (this.moduleModel.libelle && this.moduleModel.libelle.trim() !== '') {
      if (this.listSelectedMention && this.listSelectedMention.length > 0) {
        this.ngxService.show(this.LOADERID);
        this.listSelectedMention.forEach(x => {
          const mentionModule = new MentionModuleModel();
          mentionModule.mention = x;
          this.listMentionModule.push(mentionModule);
        });
        this.subscription.push(
          (this.moduleModel.id ?
            this.paramModuleUE.updateModule(this.moduleModel.id, this.moduleModel) :
            this.paramModuleUE.addModule(this.moduleModel)).subscribe(
              (data) => {
                if (data && data.id) {
                  this.moduleModel = data as ModuleModel;
                  this.saveMentionModule(this.listMentionModule, this.moduleModel);
                }
              }, (error) => {
                this.notif.error();
                this.ngxService.hide(this.LOADERID);
              }, () => {
                addForm.resetForm();
                this.clear();
                this.notif.success();
                this.loadListModule();
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
    this.moduleModel = new ModuleModel();
  }

  saveMentionModule(mentionModuleModel: MentionModuleModel[], module: ModuleModel) {
    mentionModuleModel.forEach(x => x.module = module);
    this.subscription.push(
      this.paramModuleUE.addMentionModule(mentionModuleModel).subscribe(
        (data) => {
        }, (error) => {
          this.notif.error();
          this.ngxService.hide(this.LOADERID);
        }, () => {
          mentionModuleModel = [];
          this.listSelectedMention = [];
          this.listMentionModule = [];
          this.loadListModule();
          this.loadListMention();
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }
  onEdit(item) {
    this.moduleModel = item as ModuleModel;
  }

  archive(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramModuleUE.archiveModule(id).subscribe(
        (data) => {
          this.loadListModule();
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
      this.paramModuleUE.updateModuleStatus(value.checked, item.id)
      .subscribe(
        (data) => {
          this.loadListModule();
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
