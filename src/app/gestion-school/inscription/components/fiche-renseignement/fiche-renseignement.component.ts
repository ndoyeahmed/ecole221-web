import { InscriptionPojoModel } from './../../../../shared/models/inscription-pojo.model';
import { DocumentModel } from 'src/app/shared/models/document.model';
import { DocumentParNiveauModel } from 'src/app/shared/models/document-par-niveau.model';
import { InscriptionService } from './../../services/inscription.service';
import { SousClasseModel } from 'src/app/shared/models/sous-classe.model';
import { ParametrageClasseService } from './../../../parametrage/services/parametrage-classe.service';
import { UtilisateurModel } from './../../../../shared/models/utilisateur.model';
import { PaysModel } from './../../../../shared/models/pays.model';
import { EtudiantModel } from './../../../../shared/models/etudiant.model';
import { InscriptionModel } from './../../../../shared/models/inscription.model';
import { SpecialiteModel } from 'src/app/shared/models/specialite.model';
import { NiveauModel } from 'src/app/shared/models/niveau.model';
import { ParametragesSpecialiteService } from './../../../parametrage/services/parametrages-specialite.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MycustomNotificationService } from 'src/app/gestion-school/parametrage/services/mycustom-notification.service';
import { Subscription } from 'rxjs';
import { NiveauSpecialiteModel } from 'src/app/shared/models/niveau-specialite.model';
import { HoraireModel } from 'src/app/shared/models/horaire.model';
import { ParametragesBaseService } from 'src/app/gestion-school/parametrage/services/parametrages-base.service';
import * as moment from 'moment';
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'app-fiche-renseignement',
  templateUrl: './fiche-renseignement.component.html',
  styleUrls: ['./fiche-renseignement.component.css']
})
export class FicheRenseignementComponent implements OnInit, OnDestroy {
  subscription = [] as Subscription[];
  LOADERID = 'inscription-loader';

  url: string;

  listNiveau = [] as NiveauModel[];
  listSpecialite = [] as NiveauSpecialiteModel[];
  listHoraire = [] as HoraireModel[];
  listPays = [] as PaysModel[];
  listDocument = [] as DocumentParNiveauModel[];
  listSelectedDocument = [] as DocumentModel[];

  niveauModel: NiveauModel;
  specialiteModel: SpecialiteModel;
  horaireModel: HoraireModel;
  paysModel: PaysModel;
  sousClasseModel = new SousClasseModel();
  inscriptionModel = new InscriptionModel();
  etudiantModel = new EtudiantModel();
  utilisateurPereModel = new UtilisateurModel();
  utilisateurMereModel = new UtilisateurModel();
  utilisateurTuteurModel = new UtilisateurModel();
  inscriptionPOJOModel = new InscriptionPojoModel();

  constructor(
    private notif: MycustomNotificationService, private ngxService: NgxSpinnerService,
    private paramSpecialiteService: ParametragesSpecialiteService, private paramBaseService: ParametragesBaseService,
    private paramClasseService: ParametrageClasseService, private inscriptionService: InscriptionService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.loadListNiveau();
    this.loadListHoraire();
    this.loadListPays();
  }

  onCheckedDocument(event: MatCheckboxChange, doc) {
    if (event.checked === true) {
      this.listSelectedDocument.push(doc.document);
    } else {
      this.listSelectedDocument = this.listSelectedDocument.filter(sn => Number(sn.id) !== Number(doc.docuemnt.id));
    }
  }

  loadDocuments(niveauId) {
    this.subscription.push(
      this.paramSpecialiteService.getAllDocumentParNiveauByNiveauAndFournir(true, niveauId).subscribe(
        (data) => {
          this.listDocument = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
          this.ngxService.hide(this.LOADERID);
        },
        () => {
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
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
              console.log(error);
            }
          )
        );
      }
  }

  loadListHoraire() {
    this.subscription.push(
      this.paramBaseService.getAllHoraire().subscribe(
        (data) => {
          this.listHoraire = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
          this.ngxService.hide(this.LOADERID);
        },
        () => {
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }

  loadListPays() {
    this.subscription.push(
      this.paramBaseService.getAllPays().subscribe(
        (data) => {
          this.listPays = data;
        },
        (error) => {
          this.notif.error('Echec de chargement des données');
          this.ngxService.hide(this.LOADERID);
        },
        () => {
          this.ngxService.hide(this.LOADERID);
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
          this.ngxService.hide(this.LOADERID);
        },
        () => {
          this.ngxService.hide(this.LOADERID);
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
          this.ngxService.hide(this.LOADERID);
        },
        () => {
          this.ngxService.hide(this.LOADERID);
        }
      )
    );

    this.loadDocuments(niveauId);
  }

  saveInscription(addForm) {
    if (this.etudiantModel && this.etudiantModel.prenom && this.etudiantModel.nom
      && this.etudiantModel.dateNaissance && this.etudiantModel.lieuNaissance
      && this.etudiantModel.cin && this.etudiantModel.genre && this.etudiantModel.email
      && this.etudiantModel.telephone && this.paysModel && this.paysModel.id) {

        if (this.niveauModel && this.niveauModel.id && this.specialiteModel
          && this.specialiteModel.id && this.horaireModel && this.horaireModel.id
          && this.sousClasseModel && this.sousClasseModel.id) {

            if ((this.utilisateurMereModel && this.utilisateurMereModel.cin && this.utilisateurMereModel.prenom
              && this.utilisateurMereModel.nom && this.utilisateurMereModel.telephone) || (this.utilisateurPereModel
                && this.utilisateurPereModel.cin && this.utilisateurPereModel.prenom && this.utilisateurPereModel.nom
                && this.utilisateurPereModel.telephone) || (this.utilisateurTuteurModel && this.utilisateurTuteurModel.cin
                  && this.utilisateurTuteurModel.prenom && this.utilisateurTuteurModel.nom && this.utilisateurTuteurModel.telephone)) {

                    this.ngxService.show(this.LOADERID);

                    this.etudiantModel.pays = this.paysModel;
                    this.inscriptionPOJOModel.etudiant = this.etudiantModel;
                    this.inscriptionPOJOModel.inscription = this.inscriptionModel;
                    this.inscriptionPOJOModel.sousClasse = this.sousClasseModel;
                    this.inscriptionPOJOModel.pere = this.utilisateurPereModel;
                    this.inscriptionPOJOModel.mere = this.utilisateurMereModel;
                    this.inscriptionPOJOModel.tuteur = this.utilisateurTuteurModel;
                    this.inscriptionPOJOModel.documents = this.listSelectedDocument;

                    this.subscription.push(
                      this.inscriptionService.inscription(this.inscriptionPOJOModel).subscribe(
                        (data) => {
                          console.log(data);
                        }, (error) => {
                          this.notif.error();
                          this.ngxService.hide(this.LOADERID);
                        }, () => {
                          addForm.resetForm();
                          this.clear();
                          this.notif.success();
                          this.ngxService.hide(this.LOADERID);
                        }
                      )
                    );

                  } else {
                    this.notif.error('Veuillez au moins remplir les informations d\'un des tuteurs');
                  }
          } else {
            this.notif.error('Veuillez remplir tous les champs obligatoires');
          }
      } else {
        this.notif.error('Veuillez remplir tous les champs obligatoires');
      }
    // addForm.resetForm();
  }

  clear() {
    this.etudiantModel = new EtudiantModel();
    this.inscriptionModel = new InscriptionModel();
    this.niveauModel = new NiveauModel();
    this.specialiteModel = new SpecialiteModel();
    this.horaireModel = new HoraireModel();
    this.sousClasseModel = new SousClasseModel();
    this.paysModel = new PaysModel();
    this.inscriptionPOJOModel = new InscriptionPojoModel();
    this.listSelectedDocument = [];
    this.listDocument = [];
  }
}
