import { DomaineModel } from './../../../../shared/models/domaine.model';
import { MentionModel } from './../../../../shared/models/mention.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametragesBaseService } from '../../services/parametrages-base.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-mention',
  templateUrl: './mention.component.html',
  styleUrls: ['./mention.component.css']
})
export class MentionComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  LOADERID = 'mention-loader';
  dialogRef: any;

  listMention = [] as MentionModel[];
  listDomaine = [] as DomaineModel[];
  mentionModel = new MentionModel();
  domaineModel = new DomaineModel();

  constructor(
    private paramBaseService: ParametragesBaseService, private dialog: MatDialog,
    private notif: MycustomNotificationService, private ngxService: NgxSpinnerService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.ngxService.show(this.LOADERID);
    this.loadListMention();
    this.loadListDomaine();
  }

  loadListDomaine() {
    this.subscription.push(
      this.paramBaseService.getAllDomaine().subscribe(
        (data) => {
          this.listDomaine = data;
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

  save() {
    if (this.domaineModel.libelle && this.domaineModel.libelle.trim() !== ''
        && this.mentionModel.libelle && this.mentionModel.libelle.trim() !== '') {
      this.ngxService.show(this.LOADERID);
      this.mentionModel.domaine = this.domaineModel;
      this.subscription.push(
        (this.mentionModel.id ?
          this.paramBaseService.updateMention(this.mentionModel.id, this.mentionModel) :
          this.paramBaseService.addMention(this.mentionModel)).subscribe(
            (data) => {
              this.loadListMention();
              this.domaineModel = new DomaineModel();
              this.mentionModel = new MentionModel();
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
    this.mentionModel = item as MentionModel;
    this.domaineModel = this.mentionModel.domaine;
  }

  archive(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramBaseService.archiveMention(id).subscribe(
        (data) => {
          this.loadListMention();
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
      this.paramBaseService.updateMentionStatus(value.checked, item.id)
      .subscribe(
        (data) => {
          this.loadListMention();
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
