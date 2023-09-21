import { AnneeScolaireModel } from './../../../../shared/models/annee-scolaire.model';
import { ParametragesBaseService } from './../../services/parametrages-base.service';
import { ClasseReferentielModel } from './../../../../shared/models/classe-referentiel.model';
import { ClasseModel } from './../../../../shared/models/classe.model';
import { ParametrageClasseService } from './../../services/parametrage-classe.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReferentielModel } from 'src/app/shared/models/referentiel.model';
import { MycustomNotificationService } from '../../services/mycustom-notification.service';
import { ParametrageReferentielService } from '../../services/parametrage-referentiel.service';
import { ParametragesSpecialiteService } from '../../services/parametrages-specialite.service';
import { NiveauSpecialiteModel } from 'src/app/shared/models/niveau-specialite.model';
import { NiveauModel } from 'src/app/shared/models/niveau.model';
import { SpecialiteModel } from 'src/app/shared/models/specialite.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-affectation-classe-referentiel',
  templateUrl: './affectation-classe-referentiel.component.html',
  styleUrls: ['./affectation-classe-referentiel.component.css']
})
export class AffectationClasseReferentielComponent implements OnInit, OnDestroy {
  subscription = [] as Subscription[];
  LOADERID = 'affectation-ref-classe-loader';
  dialogRef: any;

  listNiveau = [] as NiveauModel[];
  listSpecialite = [] as NiveauSpecialiteModel[];
  listReferentiel = [] as ReferentielModel[];
  listReferentielFiltered = [] as ReferentielModel[];
  listClasse: ClasseModel[] = [];
  listClasseFiltered: ClasseModel[] = [];
  listClasseReferentiel: ClasseReferentielModel[] = [];

  niveauModel: NiveauModel;
  specialiteModel: SpecialiteModel;
  annee = '';
  referentielModel: ReferentielModel;

  anneScolaireEncours: AnneeScolaireModel;

  constructor(
    private paramSpecialiteService: ParametragesSpecialiteService, private paramBaseService: ParametragesBaseService,
    private notif: MycustomNotificationService,
    private paramReferentielService: ParametrageReferentielService, private paramClasseService: ParametrageClasseService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {

    this.loadListClasse();
    this.loadListNiveau();
    this.loadListReferentiel();
    this.loadAnneeScolaireEnCours();
  }

  loadAnneeScolaireEnCours() {
    this.subscription.push(
      this.paramBaseService.getAnneeScolaireEnCours().subscribe(
        (data) => {
          this.anneScolaireEncours = data;
        }, (error) => {
          console.log(error);
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

        },
        () => {

        }
      )
    );
  }

  loadListSpecialite(niveauId) {
    this.subscription.push(
      this.paramSpecialiteService.getAllNiveauSpecialiteByNiveau(niveauId).subscribe(
        (data) => {
          this.listSpecialite = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');

        },
        () => {

        }
      )
    );
  }

  loadListClasse() {
    this.subscription.push(
      this.paramClasseService.getAllClasse().subscribe(
        (data) => {
          this.listClasse = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');

        },
        () => {

        }
      )
    );
  }

  onSelectedReferentiel(event: MatRadioChange) {
    // console.log(event);
    this.listClasse.forEach(x => {
      this.paramClasseService.getClasseReferentielByClasseAndReferentiel(x.id, event.value.id)
      .subscribe(
        (data) => {
          if (data) {
            x.affected = true;
          } else {
            x.affected = false;
          }
        }
      );
    });
  }

  loadListReferentiel() {
    this.subscription.push(
      this.paramReferentielService.getAllReferentiel().subscribe(
        (data) => {
          this.listReferentiel = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');

        },
        () => {

        }
      )
    );
  }

  loadClassByNiveau(niveauId) {
    this.listClasseFiltered = this.listClasse.filter(
      x => Number(x.niveau.id) === Number(niveauId)
    );
  }

  loadClassBySpecialite(specialiteId) {
    this.listClasseFiltered = this.listClasse.filter(
      x => Number(x.specialite.id) === Number(specialiteId)
    );
  }

  loadClassByNiveauAndSpecialite(niveauId, specialiteId) {
    this.listClasseFiltered = this.listClasse.filter(
      x => Number(x.niveau.id) === Number(niveauId) && Number(x.specialite.id) === Number(specialiteId)
    );
  }

  loadReferentielByNiveau(niveauId) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.niveau.id) === Number(niveauId)
    );
  }

  loadReferentielBySpecialite(specialiteId) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.specialite.id) === Number(specialiteId)
    );
  }

  loadReferentielByAnnee(annee) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.annee) === Number(annee)
    );
  }

  loadReferentielByNiveauAndSpecialite(niveauId, specialiteId) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.niveau.id) === Number(niveauId) && Number(x.specialite.id) === Number(specialiteId)
    );
  }

  loadReferentielByNiveauAndSpecialiteAndAnnee(niveauId, specialiteId, annee) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.niveau.id) === Number(niveauId) && Number(x.specialite.id) === Number(specialiteId) && Number(x.annee) === Number(annee)
    );
  }

  loadReferentielByNiveauAndAnnee(niveauId, annee) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.niveau.id) === Number(niveauId) && Number(x.annee) === Number(annee)
    );
  }

  loadReferentielBySpecialiteAndAnnee(specialiteId, annee) {
    this.listReferentielFiltered = this.listReferentiel.filter(
      x => Number(x.specialite.id) === Number(specialiteId) && Number(x.annee) === Number(annee)
    );
  }

  searchByNiveauAndSpecialite() {
    if (this.niveauModel && this.niveauModel.id && Number(this.annee) !== 0
      && this.specialiteModel && this.specialiteModel.id) {

      this.loadReferentielByNiveauAndSpecialiteAndAnnee(this.niveauModel.id, this.specialiteModel.id, this.annee);
      this.loadClassByNiveauAndSpecialite(this.niveauModel.id, this.specialiteModel.id);

    } else if (this.niveauModel && this.niveauModel.id && Number(this.annee) !== 0) {

      this.loadReferentielByNiveauAndAnnee(this.niveauModel.id, this.annee);
      this.loadClassByNiveau(this.niveauModel.id);

    } else if (this.specialiteModel && this.specialiteModel.id && Number(this.annee) !== 0) {

      this.loadReferentielBySpecialiteAndAnnee(this.specialiteModel.id, this.annee);
      this.loadClassBySpecialite(this.specialiteModel.id);

    } else if (this.specialiteModel && this.specialiteModel.id && this.niveauModel && this.niveauModel.id) {

      this.loadClassByNiveauAndSpecialite(this.niveauModel.id, this.specialiteModel.id);
      this.loadReferentielByNiveauAndSpecialite(this.niveauModel.id, this.specialiteModel.id);

    } else if (this.niveauModel && this.niveauModel.id) {

      this.loadReferentielByNiveau(this.niveauModel.id);
      this.loadClassByNiveau(this.niveauModel.id);

    } else if (this.specialiteModel && this.specialiteModel.id) {

      this.loadReferentielBySpecialite(this.specialiteModel.id);
      this.loadClassBySpecialite(this.specialiteModel.id);
    } else if (Number(this.annee) !== 0) {
      this.loadReferentielByAnnee(this.annee);
    }
  }

  cancelSearchByNiveauAndSpecialite(searchForm) {
    searchForm.resetForm();
    this.niveauModel = new NiveauModel();
    this.specialiteModel = new SpecialiteModel();
    this.listSpecialite = [];
    this.listReferentielFiltered = [];
    this.listClasseFiltered = [];
  }

  onCheckedClasse(event: MatCheckboxChange, classe) {
    if (event.checked === true) {
      const classeReferentiel = new ClasseReferentielModel();
      classeReferentiel.classe = classe;
      this.listClasseReferentiel.push(classeReferentiel);
    } else {
      this.listClasseReferentiel = this.listClasseReferentiel.filter(sn => Number(sn.classe.id) !== Number(classe.id));
    }
  }

  saveAffectation(affectForm) {
    if (this.referentielModel && this.referentielModel.id) {
      if (this.listClasseReferentiel && this.listClasseReferentiel.length > 0) {
        this.listClasseReferentiel.forEach(x => {
          x.referentiel = this.referentielModel;
          x.anneeDebut = this.referentielModel.annee;
          x.anneeFin = 999999;
          x.anneeScolaire = this.anneScolaireEncours;
        });
        this.subscription.push(
          this.paramClasseService.addClasseReferentiel(this.listClasseReferentiel).subscribe(
            (data) => {
              // console.log(data);
            }, (error) => {
              console.log(error);
              this.notif.error();
            },
            () => {
              affectForm.resetForm();
              this.referentielModel = new ReferentielModel();
              this.listClasseReferentiel = [];
              this.notif.success();
            }
          )
        );
      } else {
        this.notif.error('Choisir au moins une classe');
      }
    } else {
      this.notif.error('Referentiel obligatoire');
    }
  }

}
