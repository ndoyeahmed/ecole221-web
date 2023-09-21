import { Injectable } from '@angular/core';
import { AlertService } from 'src/app/shared/services/alert.service';


@Injectable({
  providedIn: 'root'
})
export class MycustomNotificationService {

  constructor(private alertService: AlertService) { }

  success(message = 'Opération effectuée avec succès') {
    this.alertService.success(message);
  }

  error(message = 'Echec de l\'opération') {
    this.alertService.error(message);
  }

  info(message = 'Information') {
    this.alertService.info(message);
  }

  warning(message = 'Attention') {
    this.alertService.warn(message);
  }
}
