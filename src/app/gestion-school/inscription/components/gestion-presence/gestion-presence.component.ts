import { AnneeScolaireModel } from './../../../../shared/models/annee-scolaire.model';
import { MycustomNotificationService } from 'src/app/gestion-school/parametrage/services/mycustom-notification.service';
import { Subscription } from 'rxjs';
import { PresenceService } from './../../services/presence.service';
import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InscriptionModel } from 'src/app/shared/models/inscription.model';
import { PresenceModel } from 'src/app/shared/models/presence.model';
import * as moment from 'moment';

@Component({
  selector: 'app-gestion-presence',
  templateUrl: './gestion-presence.component.html',
  styleUrls: ['./gestion-presence.component.css']
})
export class GestionPresenceComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];

  @Input() dataSource: MatTableDataSource<InscriptionModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  presenceColumnsToDisplay = ['nom_prenom', 'telephone', 'email', 'classe', 'absence'];
  inscriptionColumnsToDisplay = ['nom_prenom', 'telephone', 'email', 'classe', 'actions'];

  LOADERID = 'list-inscription-loader';

  dialogRef: any;

  listPresence = [] as PresenceModel[];
  listAbsence = [] as PresenceModel[];
  anneeScolaire: AnneeScolaireModel;

  constructor(private presenceService: PresenceService, private notif: MycustomNotificationService) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.anneeScolaire = JSON.parse(localStorage.getItem('annee-scolaire-encours'));
    this.dataSource.data.forEach(x => {
      const presence = new PresenceModel();
      presence.etat = true;
      presence.inscription = x;
      this.listPresence.push(presence);
    });
  }

  getFormatedDate(date): string {
    return moment(date).format('DD/MM/YYYY');
  }

  onCheckedPresence(event: MatCheckboxChange, inscription) {
    this.listPresence.forEach(x => {
      if (Number(x.inscription.id) === Number(inscription.id)) {
        x.etat = !event.checked;
      }
    });
  }

  loadListPresenceByInscriptionAndEtat(idInscription: number) {
    this.subscription.push(
      this.presenceService.getAllPresenceByInscriptionAndEtat(idInscription, false, this.anneeScolaire.id).subscribe(
        (data) => {
          this.listAbsence = data;
        }, (error) => {
          this.notif.error('Echec chargement des données');
        }
      )
    );
  }

  saveListPresence() {
    console.log(this.listPresence);
    this.subscription.push(
      this.presenceService.savePresence(this.listPresence).subscribe(
        (data) => {
          console.log(data);
        }, (error) => {
          if (error.error.message === 'presence already marked') {
            this.notif.error('Les présences ont déja été gérer pour cette journée');
          } else {
            this.notif.error();
          }
        }, () => {
          this.notif.success();
        }
      )
    );
  }

  clear() {
    this.listPresence = [];
  }

}
