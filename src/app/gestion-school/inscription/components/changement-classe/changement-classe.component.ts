import { InscriptionService } from './../../services/inscription.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { MycustomNotificationService } from 'src/app/gestion-school/parametrage/services/mycustom-notification.service';
import { ParametrageClasseService } from 'src/app/gestion-school/parametrage/services/parametrage-classe.service';
import { ParametragesBaseService } from 'src/app/gestion-school/parametrage/services/parametrages-base.service';
import { ParametragesSpecialiteService } from 'src/app/gestion-school/parametrage/services/parametrages-specialite.service';
import { ClasseSousClasse } from 'src/app/shared/models/classe-sous-classe.model';
import { HoraireModel } from 'src/app/shared/models/horaire.model';
import { NiveauSpecialiteModel } from 'src/app/shared/models/niveau-specialite.model';
import { NiveauModel } from 'src/app/shared/models/niveau.model';
import { SousClasseModel } from 'src/app/shared/models/sous-classe.model';
import { SpecialiteModel } from 'src/app/shared/models/specialite.model';

@Component({
  selector: 'app-changement-classe',
  templateUrl: './changement-classe.component.html',
  styleUrls: ['./changement-classe.component.css']
})
export class ChangementClasseComponent implements OnInit {

  subscription = [] as Subscription[];
  listNiveau = [] as NiveauModel[];
  listSousClasse = [] as ClasseSousClasse[];
  listHoraire = [] as HoraireModel[];
  listSpecialite = [] as NiveauSpecialiteModel[];

  niveauModel: NiveauModel;
  sousClasseModel: SousClasseModel;
  horaireModel: HoraireModel;
  specialiteModel: SpecialiteModel;

  regulariser = false;

  constructor(private paramSpecialiteService: ParametragesSpecialiteService,
              private notif: MycustomNotificationService,
              private inscriptionService: InscriptionService,
              private paramBaseService: ParametragesBaseService,
              private paramClasseService: ParametrageClasseService,
              public dialogRef: MatDialogRef<ChangementClasseComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.loadListNiveau();
    this.loadListHoraire();
  }

  loadListHoraire() {
    this.subscription.push(
      this.paramBaseService.getAllHoraire().subscribe(
        (data) => {
          this.listHoraire = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
        }
      )
    );
  }

  getSousClasseAInscrire() {
    if (this.niveauModel && this.niveauModel.id && this.specialiteModel
      && this.specialiteModel.id && this.horaireModel && this.horaireModel.id) {
        const body = {
          niveauId: this.niveauModel.id + '',
          specialiteId: this.specialiteModel.id + '',
          horaireId: this.horaireModel.id + ''
        };
        this.subscription.push(
          this.paramClasseService.getSousClasseAInscrire(body).subscribe(
            (data) => {
              console.log(data);
              this.sousClasseModel = data;
            }, (error) => {
              if (Number(error.status) === 400 && error.error.message === 'sousclasse full') {
                this.sousClasseModel = null;
                this.notif.error('Aucune classe trouvée')
              }
            }
          )
        );
      }
  }

  loadListSpecialite(niveauId) {
    this.subscription.push(
      this.paramSpecialiteService.getAllNiveauSpecialiteByNiveau(niveauId).subscribe(
        (data) => {
          this.listSpecialite = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
        }
      )
    );
  }

  loadListNiveau() {
    this.subscription.push(
      this.paramSpecialiteService.getAllNiveau().subscribe(
        (data) => {
          this.listNiveau = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
        }
      )
    );
  }

  loadListSousClasse() {
    if (this.niveauModel && this.niveauModel.id && this.data.sousClasse.specialite && this.data.sousClasse.specialite.id
      && this.data.sousClasse.horaire && this.data.sousClasse.horaire.id) {
      this.subscription.push(
        this.paramClasseService.getAllClasseSousClasseByNiveauSpecialiteHoraire(this.niveauModel.id,
          this.data.sousClasse.specialite.id, this.data.sousClasse.horaire.id).subscribe(
          (data) => {
            this.listSousClasse = data;
          },
          (error) => {
            console.log(error);
          }
        )
      );
    }
  }

  onRegulariser(value: MatSlideToggleChange) {
    this.regulariser = value.checked;
    console.log(this.regulariser);
  }

  save(item) {
    const body = {
      niveau: this.niveauModel,
      specialite: this.specialiteModel,
      horaire: this.horaireModel,
      sousClasse: this.sousClasseModel,
      inscription: this.data,
      regulariser: this.regulariser
    };

    this.subscription.push(
      this.inscriptionService.changeEtudiantClasse(body).subscribe(
        (data) => {
          if (data.response === true) {
            this.notif.success();
          } else {
            this.notif.error();
          }
        }, (error) => {
          this.notif.error();
        }, () => {
          const response = {
            rep: item,
            item: body
          };
          this.dialogRef.close(response);
        }
      )
    );
  }

  onResponse(item): void {

    const body = {
      niveau: this.niveauModel,
      specialite: this.specialiteModel,
      horaire: this.horaireModel,
      sousClasse: this.sousClasseModel,
      inscription: this.data,
      regulariser: this.regulariser
    };

    const response = {
      rep: item,
      item: body
    };
    this.dialogRef.close(response);
  }
}
