import { ParametrageModuleUeService } from './../../services/parametrage-module-ue.service';
import { MentionModuleModel } from './../../../../shared/models/mention-module.model';
import { ModuleModel } from './../../../../shared/models/module.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MentionModel } from 'src/app/shared/models/mention.model';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametragesBaseService } from '../../services/parametrages-base.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  LOADERID = 'module-loader';
  dialogRef: any;

  dataSource: MatTableDataSource<ModuleModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  moduleColumnsToDisplay = ['code', 'module', 'mention', 'status', 'actions'];

  listMention = [] as MentionModel[];
  listMentionModule = [] as MentionModuleModel[];
  listSelectedMentionUpdate = [] as MentionModel[];
  listSelectedMention = [] as MentionModel[];
  listModule = [] as ModuleModel[];

  moduleModel = new ModuleModel();
  mentionModel = new MentionModel();

  page = 1;

  onNewModuleMention = false;

  constructor(
    private paramBaseService: ParametragesBaseService, private dialog: MatDialog,
    private notif: MycustomNotificationService,
    private paramModuleUE: ParametrageModuleUeService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {

    this.loadListModule();
    this.loadListMention();
  }

  onAddModuleMention() {
    this.onNewModuleMention = true;
    this.listSelectedMentionUpdate = [];
  }

  saveModuleMention2(module: ModuleModel) {
    this.listMentionModule = [];
    if (this.listSelectedMentionUpdate && this.listSelectedMentionUpdate.length > 0) {
      this.listSelectedMentionUpdate.forEach(x => {
        const moduleMention = new MentionModuleModel();
        moduleMention.mention = x;
        moduleMention.module = module;
        this.listMentionModule.push(moduleMention);
      });
      this.subscription.push(
        this.paramModuleUE.addMentionModule(this.listMentionModule).subscribe(
          (data) => {
            console.log(data);
          }, (error) => {
            this.onNewModuleMention = false;
            this.notif.error();
            
          }, () => {
            this.onNewModuleMention = false;
            this.listSelectedMentionUpdate = [];
            this.listMentionModule = [];
            this.notif.success();
            this.loadListModule();
            
          }
        )
      );
    } else {
      this.notif.error('Veuillez remplir tout le formulaire SVP');
    }
  }

  loadListModule() {
    this.subscription.push(
      this.paramModuleUE.getAllModule().subscribe(
        (data) => {
          this.listModule = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
          
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
            this.dataSource = new MatTableDataSource<ModuleModel>(this.listModule);
            this.dataSource.paginator = this.paginator;
            
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
          
        },
        () => {
          
        }
      )
    );
  }

  save(addForm) {
    if (this.moduleModel.libelle && this.moduleModel.libelle.trim() !== '') {
      if (this.listSelectedMention && this.listSelectedMention.length > 0) {

        this.listSelectedMention.forEach(x => {
          const mentionModule = new MentionModuleModel();
          mentionModule.mention = x;
          this.listMentionModule.push(mentionModule);
        });
        console.log(this.moduleModel);
        this.subscription.push(
          (this.moduleModel.id ?
            this.paramModuleUE.updateModule(this.moduleModel.id, this.moduleModel) :
            this.paramModuleUE.addModule(this.moduleModel)).subscribe(
              (data) => {
                if (!this.moduleModel.id) {
                  if (data && data.id) {
                    this.moduleModel = data as ModuleModel;
                    this.saveMentionModule(this.listMentionModule, this.moduleModel);
                  } else {
                    this.listSelectedMention = [];
                  }
                }
              }, (error) => {
                this.notif.error();
                
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
          
        }, () => {
          mentionModuleModel = [];
          this.listSelectedMention = [];
          this.listMentionModule = [];
          this.loadListModule();
          this.loadListMention();
          
        }
      )
    );
  }
  onEdit(item) {
    this.listSelectedMention = [];
    this.moduleModel = item as ModuleModel;
    item.mentionModule.forEach(x => this.listSelectedMention.push(x.mention));
  }

  comparer(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o2 === o2;
  }

  archiveModule(id) {

    this.subscription.push(
      this.paramModuleUE.archiveModule(id).subscribe(
        (data) => {
          this.loadListModule();
          this.notif.success();
        },
        (error) => {
          this.notif.error();
          
        }, () => {
          
        }
      )
    );
  }

  archiveMentionModule(id) {

    this.subscription.push(
      this.paramModuleUE.archiveMentionModule(id).subscribe(
        (data) => {
          this.loadListModule();
          this.notif.success();
        },
        (error) => {
          this.notif.error();
          
        }, () => {
          
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
          this.archiveModule(result.item.id);
        }
      }
    });
  }

  onChangeStatus(value: MatSlideToggleChange, item) {

    this.subscription.push(
      this.paramModuleUE.updateModuleStatus(value.checked, item.id)
      .subscribe(
        (data) => {
          this.loadListModule();
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
