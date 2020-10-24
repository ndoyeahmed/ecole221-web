import { MycustomSnackbarService } from './../../services/mycustom-snackbar.service';
import { DeleteDialogComponent } from './../delete-dialog/delete-dialog.component';
import { ParametragesBaseService } from './../../services/parametrages-base.service';
import { AnneeScolaireModel } from './../../../../shared/models/annee-scolaire.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-anneescolaire',
  templateUrl: './anneescolaire.component.html',
  styleUrls: ['./anneescolaire.component.css']
})
export class AnneescolaireComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  listAnneeScolaire = [] as AnneeScolaireModel[];
  anneeScolaire = new AnneeScolaireModel();

  dialogRef: any;

  constructor(private paramBaseService: ParametragesBaseService, private dialog: MatDialog,
              private snacbar: MycustomSnackbarService) { }

  ngOnInit(): void {
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
        (error) => console.log(error)
      )
    );
  }

  save() {
    if (this.anneeScolaire.libelle && this.anneeScolaire.libelle.trim() !== '') {
      this.subscription.push(
        (this.anneeScolaire.id ?
          this.paramBaseService.updateAnneeScolaire(this.anneeScolaire, this.anneeScolaire.id) :
          this.paramBaseService.addAnneeScolaire(this.anneeScolaire)).subscribe(
            (data) => {
              console.log(data);
              this.loadListAnneeScolaire();
              this.anneeScolaire = new AnneeScolaireModel();
              this.snacbar.success();
            },
            (error) => this.snacbar.error()
          )
      );
    } else {
      console.log('libelle is required');
    }
  }

  onEdit(item) {
    this.anneeScolaire = item as AnneeScolaireModel;
  }

  archive(id) {
    this.subscription.push(
      this.paramBaseService.archiveAnneeScolaire(id).subscribe(
        (data) => {
          this.loadListAnneeScolaire();
        },
        (error) => console.log(error)
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
