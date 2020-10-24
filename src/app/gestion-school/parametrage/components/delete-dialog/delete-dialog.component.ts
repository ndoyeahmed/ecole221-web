import { AnneeScolaireModel } from './../../../../shared/models/annee-scolaire.model';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AnneeScolaireModel) { }

  onResponse(item): void {
    const response = {
      rep: item,
      item: this.data
    };
    this.dialogRef.close(response);
  }

}
