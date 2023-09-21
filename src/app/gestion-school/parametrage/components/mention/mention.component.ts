import { DomaineModel } from './../../../../shared/models/domaine.model';
import { MentionModel } from './../../../../shared/models/mention.model';
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
  selector: 'app-mention',
  templateUrl: './mention.component.html',
  styleUrls: ['./mention.component.css']
})
export class MentionComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  LOADERID = 'mention-loader';
  dialogRef: any;

  dataSource: MatTableDataSource<MentionModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  mentionColumnsToDisplay = ['mention', 'domaine', 'status', 'actions'];

  listMention = [] as MentionModel[];
  listDomaine = [] as DomaineModel[];
  mentionModel = new MentionModel();
  domaineModel = new DomaineModel();

  constructor(
    private paramBaseService: ParametragesBaseService, private dialog: MatDialog,
    private notif: MycustomNotificationService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {

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

        },
        () => {

        }
      )
    );
  }

  loadListMention() {
    this.subscription.push(
      this.paramBaseService.getAllMention().subscribe(
        (data) => {
          this.listMention = data;
          this.dataSource = new MatTableDataSource<MentionModel>(this.listMention);
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
    if (this.domaineModel.libelle && this.domaineModel.libelle.trim() !== ''
        && this.mentionModel.libelle && this.mentionModel.libelle.trim() !== '') {

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

            }, () => {

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

    this.subscription.push(
      this.paramBaseService.archiveMention(id).subscribe(
        (data) => {
          this.loadListMention();
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
      this.paramBaseService.updateMentionStatus(value.checked, item.id)
      .subscribe(
        (data) => {
          this.loadListMention();
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
