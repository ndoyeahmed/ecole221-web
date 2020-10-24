import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class MycustomNotificationService {

  constructor(private toastr: ToastrService) { }

  success(message = 'Opération effectuée avec succès') {
    this.toastr.success(message, 'Succès');
  }

  error(message = 'Echec de l\'opération') {
    this.toastr.error(message, 'Erreur');
  }

  info(message = 'Information') {
    this.toastr.info(message, 'Info');
  }

  warning(message = 'Attention') {
    this.toastr.warning(message, 'Attention');
  }
}
