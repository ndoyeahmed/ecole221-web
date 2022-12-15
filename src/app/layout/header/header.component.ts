import { AnneeScolaireModel } from './../../shared/models/annee-scolaire.model';
import { Subscription } from 'rxjs';
import { ParametragesBaseService } from './../../gestion-school/parametrage/services/parametrages-base.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { UtilisateurModel } from 'src/app/shared/models/utilisateur.model';

/// <reference path ="../../node_modules/@types/jquery/index.d.ts"/>
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  listAnneeScolaire = [];
  anneeScolaire: AnneeScolaireModel;
  id: any;

  subscription = [] as Subscription[];
  userConnected = new UtilisateurModel();

  constructor(private paramBaseService: ParametragesBaseService, private auth: AuthService) { }

  ngOnInit(): void {
    this.subscription.push(
      this.paramBaseService.getAllAnneeScolaire().subscribe(
        (data) => {
          this.listAnneeScolaire = data;
        }, (error) => {
          console.log(error);
        }
      )
    );

    this.anneeScolaire = JSON.parse(localStorage.getItem('annee-scolaire-encours'));
    if (!this.anneeScolaire) {
      this.subscription.push(
        this.paramBaseService.getAnneeScolaireEnCours().subscribe(
          (data) => {
            this.anneeScolaire = data;
            this.id = this.anneeScolaire.id;
          }, (error) => {
            console.log(error);
          }
        )
      );
    } else {
      this.id = this.anneeScolaire.id;
    }

    this.getConnectedUser();
  }

  onSelectedAnneeScolaire(event) {
    this.id = event.target.value;
    this.listAnneeScolaire.forEach(x => {
      if (Number(x.id) === Number(this.id)) {
        this.anneeScolaire = x;
      }
    });
    $('#alerteModal').modal('show');
  }

  changeAnneeScolaire() {
    localStorage.setItem('annee-scolaire-encours', JSON.stringify(this.anneeScolaire));
    this.paramBaseService.onChangeAnneeScolaireEncoursSession.next(true);
    $('#alerteModal').modal('hide');
  }

  onCloseModal() {
    this.anneeScolaire = JSON.parse(localStorage.getItem('annee-scolaire-encours'));
    this.id = this.anneeScolaire.id;
    $('#alerteModal').modal('hide');
  }

  logout() {
    this.auth.logout();
  }

  getConnectedUser() {
    this.subscription.push(
      this.auth.identity().subscribe(
        (data) => {
          console.log(data);
          this.userConnected = data;
        }, (error) => {
          console.log(error);
        }
      )
    );
  }

}
