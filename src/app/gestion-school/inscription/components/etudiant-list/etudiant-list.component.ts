import { ChangementClasseComponent } from './../changement-classe/changement-classe.component';
import { ParametrageClasseService } from './../../../parametrage/services/parametrage-classe.service';
import { ParametragesBaseService } from 'src/app/gestion-school/parametrage/services/parametrages-base.service';
import { ParametragesSpecialiteService } from './../../../parametrage/services/parametrages-specialite.service';
import { ClasseSousClasse } from './../../../../shared/models/classe-sous-classe.model';
import { SousClasseModel } from 'src/app/shared/models/sous-classe.model';
import { HoraireModel } from 'src/app/shared/models/horaire.model';
import { NiveauSpecialiteModel } from 'src/app/shared/models/niveau-specialite.model';
import { SpecialiteModel } from 'src/app/shared/models/specialite.model';
import { NiveauModel } from 'src/app/shared/models/niveau.model';
import { InscriptionService } from './../../services/inscription.service';
import { InscriptionModel } from './../../../../shared/models/inscription.model';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MycustomNotificationService } from 'src/app/gestion-school/parametrage/services/mycustom-notification.service';
import * as moment from 'moment';

@Component({
  selector: 'app-etudiant-list',
  templateUrl: './etudiant-list.component.html',
  styleUrls: ['./etudiant-list.component.css']
})
export class EtudiantListComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  listInscription = [] as InscriptionModel[];
  listInscriptionFiltered = [] as InscriptionModel[];
  dataSource: MatTableDataSource<InscriptionModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  inscriptionColumnsToDisplay = ['nom', 'prenom', 'datenaissance', 'lieunaissance', 'telephone', 'email', 'actions'];

  LOADERID = 'list-inscription-loader';

  dialogRef: any;

  niveauModel: NiveauModel;
  specialiteModel: SpecialiteModel;
  horaireModel: HoraireModel;
  sousClasseModel: SousClasseModel;

  listNiveau = [] as NiveauModel[];
  listSpecialite = [] as NiveauSpecialiteModel[];
  listHoraire = [] as HoraireModel[];
  listSousClasse = [] as ClasseSousClasse[];

  searchTerm: string;

  constructor(private inscriptionService: InscriptionService, private paramSpecialiteService: ParametragesSpecialiteService,
    private dialog: MatDialog, private notif: MycustomNotificationService,
    private ngxService: NgxSpinnerService, private paramBaseService: ParametragesBaseService,
    private paramClasseService: ParametrageClasseService) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.loadListInscription();
    this.loadListHoraire();
    this.loadListNiveau();
  }

  onSearchByTaping(term) {
    // console.log(this.searchTerm);
    if (this.searchTerm === undefined || this.searchTerm === null) {
      this.listInscriptionFiltered = null;
    } else {
      if (this.searchTerm === '') {
        this.dataSource = new MatTableDataSource<InscriptionModel>(this.listInscription);
        this.dataSource.paginator = this.paginator;
      } else {
        this.listInscriptionFiltered = this.listInscription.filter(x =>
          (x.etudiant.nom == null ? '' : x.etudiant.nom.toLowerCase()).includes(this.searchTerm.trim().toLowerCase()) ||
          (x.etudiant.prenom == null ? '' : x.etudiant.prenom.toLowerCase()).includes(this.searchTerm.trim().toLowerCase()) ||
          (x.etudiant.telephone == null ? '' : x.etudiant.telephone.toLowerCase()).includes(this.searchTerm.trim().toLowerCase()) ||
          (x.etudiant.email == null ? '' : x.etudiant.email.toLowerCase()).includes(this.searchTerm.trim().toLowerCase()) ||
          (x.etudiant.lieuNaissance == null ? '' : x.etudiant.lieuNaissance.toLowerCase()).includes(this.searchTerm.trim().toLowerCase()) ||
          (x.etudiant.dateNaissance == null ? '' : this.getFormatedDate(x.etudiant.dateNaissance).toLowerCase()).includes(this.searchTerm.trim().toLowerCase())
        );
        this.dataSource = new MatTableDataSource<InscriptionModel>(this.listInscriptionFiltered);
        this.dataSource.paginator = this.paginator;
      }

    }
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
    this.specialiteModel = null;
    this.subscription.push(
      this.paramSpecialiteService.getAllNiveauSpecialiteByNiveau(niveauId).subscribe(
        (data) => {
          this.listSpecialite = data;
        },
        (error) => {
          this.ngxService.hide(this.LOADERID);
        },
        () => {
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
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

  loadListSousClasse() {
    if (this.niveauModel && this.niveauModel.id && this.specialiteModel && this.specialiteModel.id
      && this.horaireModel && this.horaireModel.id) {
      this.subscription.push(
        this.paramClasseService.getAllClasseSousClasseByNiveauSpecialiteHoraire(this.niveauModel.id,
          this.specialiteModel.id, this.horaireModel.id).subscribe(
            (data) => {
              this.listSousClasse = data;
            },
            (error) => {
              this.ngxService.hide(this.LOADERID);
            },
            () => {
              this.ngxService.hide(this.LOADERID);
            }
          )
      );
    }
  }

  loadListInscriptionByNiveau(niveauId) {
    this.listInscriptionFiltered = this.listInscription.filter(
      x => Number(x.sousClasse.niveau.id) === Number(niveauId)
    );
    this.dataSource = new MatTableDataSource<InscriptionModel>(this.listInscriptionFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadListInscriptionBySpecialite(specialiteId) {
    this.listInscriptionFiltered = this.listInscription.filter(
      x => Number(x.sousClasse.specialite.id) === Number(specialiteId)
    );
    this.dataSource = new MatTableDataSource<InscriptionModel>(this.listInscriptionFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadListInscriptionByHoraire(horaireId) {
    this.listInscriptionFiltered = this.listInscription.filter(
      x => Number(x.sousClasse.horaire.id) === Number(horaireId)
    );
    this.dataSource = new MatTableDataSource<InscriptionModel>(this.listInscriptionFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadListInscriptionByNiveauAndSpecialite(niveauId, specialiteId) {
    this.listInscriptionFiltered = this.listInscription.filter(
      x => Number(x.sousClasse.niveau.id) === Number(niveauId) && Number(x.sousClasse.specialite.id) === Number(specialiteId)
    );
    this.dataSource = new MatTableDataSource<InscriptionModel>(this.listInscriptionFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadListInscriptionByNiveauAndSpecialiteAndHoraire(niveauId, specialiteId, horaireId) {
    this.listInscriptionFiltered = this.listInscription.filter(
      x => Number(x.sousClasse.niveau.id) === Number(niveauId) && Number(x.sousClasse.specialite.id) === Number(specialiteId)
        && Number(x.sousClasse.horaire.id) === Number(horaireId)
    );
    this.dataSource = new MatTableDataSource<InscriptionModel>(this.listInscriptionFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadListInscriptionByNiveauAndHoraire(niveauId, horaireId) {
    this.listInscriptionFiltered = this.listInscription.filter(
      x => Number(x.sousClasse.niveau.id) === Number(niveauId)
        && Number(x.sousClasse.horaire.id) === Number(horaireId)
    );
    this.dataSource = new MatTableDataSource<InscriptionModel>(this.listInscriptionFiltered);
    this.dataSource.paginator = this.paginator;
  }

  loadListInscriptionBySousClasse(sousclasseId) {
    this.listInscriptionFiltered = this.listInscription.filter(
      x => Number(x.sousClasse.id) === Number(sousclasseId)
    );
    this.dataSource = new MatTableDataSource<InscriptionModel>(this.listInscriptionFiltered);
    this.dataSource.paginator = this.paginator;
  }

  search() {
    if (this.niveauModel && this.niveauModel.id && this.specialiteModel && this.specialiteModel.id
      && this.horaireModel && this.horaireModel.id && this.sousClasseModel && this.sousClasseModel.id) {
      this.loadListInscriptionBySousClasse(this.sousClasseModel.id);
    } else if (this.niveauModel && this.niveauModel.id && this.specialiteModel && this.specialiteModel.id
      && this.horaireModel && this.horaireModel.id) {
      this.loadListInscriptionByNiveauAndSpecialiteAndHoraire(this.niveauModel.id, this.specialiteModel.id, this.horaireModel.id);
    } else if (this.niveauModel && this.niveauModel.id && this.specialiteModel && this.specialiteModel.id) {
      this.loadListInscriptionByNiveauAndSpecialite(this.niveauModel.id, this.specialiteModel.id);
    } else if (this.niveauModel && this.niveauModel.id && this.horaireModel && this.horaireModel.id) {
      this.loadListInscriptionByNiveauAndHoraire(this.niveauModel.id, this.horaireModel.id);
    } else if (this.niveauModel && this.niveauModel.id) {
      this.loadListInscriptionByNiveau(this.niveauModel.id);
    } else if (this.specialiteModel && this.specialiteModel.id) {
      this.loadListInscriptionBySpecialite(this.specialiteModel.id);
    } else if (this.horaireModel && this.horaireModel.id) {
      this.loadListInscriptionByHoraire(this.horaireModel.id);
    }
  }

  cancelSearch(searchForm) {
    searchForm.resetForm();
    this.niveauModel = new NiveauModel();
    this.specialiteModel = new SpecialiteModel();
    this.horaireModel = new HoraireModel();
    this.sousClasseModel = new SousClasseModel();
    this.listSousClasse = [];
    this.listSpecialite = [];
    this.listInscriptionFiltered = [];
    this.loadListInscription();
  }

  loadListInscription() {
    this.subscription.push(
      this.inscriptionService.getAllInscription().subscribe(
        (data) => {
          this.listInscription = data;
          this.dataSource = new MatTableDataSource<InscriptionModel>(this.listInscription);
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          this.notif.error('Echec chargement des données');
          this.ngxService.hide(this.LOADERID);
        },
        () => {
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }

  getFormatedDate(date): string {
    return moment(date).format('DD/MM/YYYY');
  }

  onChangeClasseOrNiveau(item): void {
    this.dialogRef = this.dialog.open(ChangementClasseComponent, {
      width: '50%',
      data: item
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result && result.rep === true) {
        this.loadListInscription()
      }
    });
  }

}
