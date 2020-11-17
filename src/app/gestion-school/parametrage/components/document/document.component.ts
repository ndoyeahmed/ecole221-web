import { DocumentModel } from './../../../../shared/models/document.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametragesBaseService } from '../../services/parametrages-base.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit, OnDestroy {
  subscription = [] as Subscription[];
  LOADERID = 'document-loader';
  dialogRef: any;

  dataSource: MatTableDataSource<DocumentModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  documentColumnsToDisplay = ['document', 'actions'];

  listDocument = [] as DocumentModel[];
  documentModel = new DocumentModel();

  constructor(
    private paramBaseService: ParametragesBaseService, private dialog: MatDialog,
    private notif: MycustomNotificationService, private ngxService: NgxSpinnerService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.ngxService.show(this.LOADERID);
    this.loadListDocument();
  }

  loadListDocument() {
    this.subscription.push(
      this.paramBaseService.getAllDocument().subscribe(
        (data) => {
          this.listDocument = data;
          this.dataSource = new MatTableDataSource<DocumentModel>(this.listDocument);
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
    if (this.documentModel.libelle && this.documentModel.libelle.trim() !== '') {
      this.ngxService.show(this.LOADERID);
      this.subscription.push(
        (this.documentModel.id ?
          this.paramBaseService.updateDocument(this.documentModel.id, this.documentModel) :
          this.paramBaseService.addDocument(this.documentModel)).subscribe(
            (data) => {
              this.loadListDocument();
              this.documentModel = new DocumentModel();
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
    this.documentModel = item as DocumentModel;
  }

  archive(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramBaseService.archiveDocument(id).subscribe(
        (data) => {
          this.loadListDocument();
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

}
