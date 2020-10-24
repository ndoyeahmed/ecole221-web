import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MycustomSnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  success(message = 'Opération réussie') {
    const config = new MatSnackBarConfig();
    config.panelClass = ['success-snacbar'];
    config.duration = 6000;
    this.snackBar.open(message, '', config);
  }

  error(message = 'Echec de l\'opération') {
    const config = new MatSnackBarConfig();
    config.panelClass = ['error-snacbar'];
    this.snackBar.open(message, '', config);
  }

  info(message = 'Information') {
    const config = new MatSnackBarConfig();
    config.panelClass = ['info-snacbar'];
    this.snackBar.open(message, '', config);
  }

  warning(message = 'Attention') {
    const config = new MatSnackBarConfig();
    config.panelClass = ['warning-snacbar'];
    this.snackBar.open(message, '', config);
  }

  close() {
    this.snackBar.dismiss();
  }
}
