import { AnneeScolaireModel } from './../../../../shared/models/annee-scolaire.model';
import { PresenceModel } from './../../../../shared/models/presence.model';
import { PresenceService } from './../../services/presence.service';
import { MycustomNotificationService } from './../../../parametrage/services/mycustom-notification.service';
import { InscriptionService } from './../../services/inscription.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { InscriptionModel } from './../../../../shared/models/inscription.model';
import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-afficher-dossier-absence',
  templateUrl: './afficher-dossier-absence.component.html',
  styleUrls: ['./afficher-dossier-absence.component.css']
})
export class AfficherDossierAbsenceComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];

  @Input() dataSource: MatTableDataSource<PresenceModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  presenceColumnsToDisplay = ['jour', 'justification', 'actions'];

  inscription: InscriptionModel;
  url: string;
  idInscription: number;
  listAbsence = [] as PresenceModel[];
  anneeScolaire: AnneeScolaireModel;

  dateDebut: any;
  dateFin: any;

  constructor(
    private inscriptionService: InscriptionService,
    private route: ActivatedRoute,
    private notif: MycustomNotificationService,
    private presenceService: PresenceService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.idInscription = Number(this.route.snapshot.paramMap.get('inscriptionid'));
    this.anneeScolaire = JSON.parse(localStorage.getItem('annee-scolaire-encours'));

    this.getInscriptionById(this.idInscription);
    this.loadListPresenceByInscriptionAndEtat(this.idInscription);
  }

  secureUlr(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getInscriptionById(idInscription) {
    this.subscription.push(
      this.inscriptionService.getInscriptionById(idInscription).subscribe(
        (data) => {
          this.inscription = data;
        }, (error) => {
          console.log(error);
        }, () => {
          this.subscription.push(
            this.inscriptionService.getFilesByName(this.inscription.etudiant.photo).subscribe(
              (data) => {
                this.url = 'data:image/png;base64, ' + data.response;
              }, (error) => {
                console.log(error);
              }
            )
          );
        }
      )
    );
  }

  loadListPresenceByInscriptionAndEtat(idInscription: number) {
    this.subscription.push(
      this.presenceService.getAllPresenceByInscriptionAndEtat(idInscription, false, this.anneeScolaire.id).subscribe(
        (data) => {
          this.listAbsence = data;
          this.dataSource = new MatTableDataSource<PresenceModel>(this.listAbsence);
          this.dataSource.paginator = this.paginator;
        }, (error) => {
          this.notif.error('Echec chargement des données');
        }
      )
    );
  }

  getFormatedDate(date): string {
    return moment(date).format('DD/MM/YYYY');
  }

  updatePresence(presence: PresenceModel) {
    if (presence.motif && presence.motif === '') {
      presence.motif = null;
    }
    this.subscription.push(
      this.presenceService.updatePresenceMotif(presence.id, { motif: presence.motif }).subscribe(
        (data) => {
          console.log(data);
        }, (error) => {
          console.log(error);
          this.notif.error();
        }, () => {
          this.notif.success();
          this.loadListPresenceByInscriptionAndEtat(this.idInscription);
        }
      )
    );
  }

  cancelUpdatePresence(presence: PresenceModel) {
    presence.updateMotif = false;
    this.loadListPresenceByInscriptionAndEtat(this.idInscription);
  }

  search() {
    const listFilter = this.listAbsence.filter(x =>
      moment(x.jour.date).isSameOrAfter(this.dateDebut)
      && moment(x.jour.date).isSameOrBefore(this.dateFin));

    this.dataSource = new MatTableDataSource<PresenceModel>(listFilter);
    this.dataSource.paginator = this.paginator;
  }

  cancelSearch(searchForm) {
    this.loadListPresenceByInscriptionAndEtat(this.idInscription);
    searchForm.reset();
   }

}
