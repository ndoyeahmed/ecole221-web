import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { DeleteDialogComponent } from './../delete-dialog/delete-dialog.component';
import { ParametragesBaseService } from './../../services/parametrages-base.service';
import { AnneeScolaireModel } from './../../../../shared/models/annee-scolaire.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-anneescolaire',
  templateUrl: './anneescolaire.component.html',
  styleUrls: ['./anneescolaire.component.css']
})
export class AnneescolaireComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  listAnneeScolaire = [] as AnneeScolaireModel[];
  anneeScolaire = new AnneeScolaireModel();

  LOADERID = 'annee-scolaire-loader';

  dialogRef: any;

  constructor(private paramBaseService: ParametragesBaseService, private dialog: MatDialog,
              private notif: MycustomNotificationService, private ngxService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.ngxService.show(this.LOADERID);
    this.loadListAnneeScolaire();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  loadListAnneeScolaire() {
    this.subscription.push(
      this.paramBaseService.getAllAnneeScolaire().subscribe(
        (data) => {
          this.listAnneeScolaire = data;
        },
        (error) => {
          this.notif.error('Echec chargement des données');
          this.ngxService.hide(this.LOADERID);
        },
        () => {
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }

  save() {
    if (this.anneeScolaire.libelle && this.anneeScolaire.libelle.trim() !== '') {
      this.ngxService.show(this.LOADERID);
      this.subscription.push(
        (this.anneeScolaire.id ?
          this.paramBaseService.updateAnneeScolaire(this.anneeScolaire, this.anneeScolaire.id) :
          this.paramBaseService.addAnneeScolaire(this.anneeScolaire)).subscribe(
            (data) => {
              this.loadListAnneeScolaire();
              this.anneeScolaire = new AnneeScolaireModel();
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
    } else {
      this.notif.error('Le libellé est obligatoire');
    }
  }

  onEdit(item) {
    this.anneeScolaire = item as AnneeScolaireModel;
  }

  archive(id) {
    this.ngxService.show(this.LOADERID);
    this.subscription.push(
      this.paramBaseService.archiveAnneeScolaire(id).subscribe(
        (data) => {
          this.loadListAnneeScolaire();
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
      this.paramBaseService.updateAnneeScolaireEnCoursStatus(value.checked, item.id)
      .subscribe(
        (data) => {
          this.loadListAnneeScolaire();
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
