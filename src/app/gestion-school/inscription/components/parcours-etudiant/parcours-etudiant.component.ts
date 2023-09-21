import { InscriptionModel } from './../../../../shared/models/inscription.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { InscriptionService } from '../../services/inscription.service';
import { MycustomNotificationService } from 'src/app/gestion-school/parametrage/services/mycustom-notification.service';
import * as moment from 'moment';

@Component({
  selector: 'app-parcours-etudiant',
  templateUrl: './parcours-etudiant.component.html',
  styleUrls: ['./parcours-etudiant.component.css']
})
export class ParcoursEtudiantComponent implements OnInit {

  subscription = [] as Subscription[];
  listInscription = [] as InscriptionModel[];

  LOADERID = 'list-inscription-loader';

  dataSource: MatTableDataSource<InscriptionModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  parcoursColumnsToDisplay = ['anneedebut', 'anneefin', 'etablissement', 'motifentree', 'motifsortie', 'dossier'];

  idInscription: number;
  url: string;
  inscriptionModel = new InscriptionModel();

  constructor(
    private inscriptionService: InscriptionService,
    private route: ActivatedRoute,
    private notif: MycustomNotificationService
  ) { }

  ngOnInit(): void {

    this.idInscription = Number(this.route.snapshot.paramMap.get('inscriptionid'));
    this.subscription.push(
      this.inscriptionService.getInscriptionById(this.idInscription).subscribe(
        (data) => {
          this.inscriptionModel = data;
        }, (error) => {
          console.log(error);
        }
      )
    );
    this.loadListInscription(this.idInscription);
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event1: any) => { // called once readAsDataURL is completed
        this.url = event1.target.result;
      };
    }
  }

  getFormatedDate(date): string {
    return moment(date).format('DD/MM/YYYY');
  }

  loadListInscription(idInscription) {
    this.subscription.push(
      this.inscriptionService.getAllEtudiantInscriptionByIdInscription(idInscription).subscribe(
        (data) => {
          this.listInscription = data;
          this.dataSource = new MatTableDataSource<InscriptionModel>(this.listInscription);
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          this.notif.error('Echec chargement des données');

        },
        () => {

        }
      )
    );
  }

}
