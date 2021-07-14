import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {InscriptionModel} from '../../../../shared/models/inscription.model';
import {NiveauModel} from '../../../../shared/models/niveau.model';
import {SpecialiteModel} from '../../../../shared/models/specialite.model';
import {HoraireModel} from '../../../../shared/models/horaire.model';
import {SousClasseModel} from '../../../../shared/models/sous-classe.model';
import * as moment from 'moment';
import {ChangementClasseComponent} from '../../../inscription/components/changement-classe/changement-classe.component';
import {InscriptionService} from '../../../inscription/services/inscription.service';
import {ParametragesSpecialiteService} from '../../../parametrage/services/parametrages-specialite.service';
import {MatDialog} from '@angular/material/dialog';
import {MycustomNotificationService} from '../../../parametrage/services/mycustom-notification.service';
import {HttpClient} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {ParametragesBaseService} from '../../../parametrage/services/parametrages-base.service';
import {ParametrageClasseService} from '../../../parametrage/services/parametrage-classe.service';
import {MatPaginator} from '@angular/material/paginator';
import {NiveauSpecialiteModel} from '../../../../shared/models/niveau-specialite.model';
import {ClasseSousClasse} from '../../../../shared/models/classe-sous-classe.model';
import {DocumentParNiveauModel} from '../../../../shared/models/document-par-niveau.model';
import {AnneeScolaireModel} from '../../../../shared/models/annee-scolaire.model';
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import {ClasseModel} from "../../../../shared/models/classe.model";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit, OnDestroy {

  title = 'Gestion des notes';
  subscription = [] as Subscription[];
  listInscription = [] as InscriptionModel[];
  listInscriptionFiltered = [] as InscriptionModel[];
  dataSource: MatTableDataSource<InscriptionModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  inscriptionColumnsToDisplay = ['nom_prenom', 'datenaissance', 'lieunaissance',  'telephone', 'actions', 'devoirs', 'exam', 'session'];

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
  listDocADonner = [] as DocumentParNiveauModel[];

  searchTerm: string;
  anneeScolaireEncours: AnneeScolaireModel;

  sessionList = [
    {id: 1, name: 'Normale'},
    {id: 2, name: 'Remplacement'}
  ];

  sessionModel = {};

  myControl = new FormControl();
  filteredOptions: Observable<ClasseSousClasse[]>;
  constructor(
    private inscriptionService: InscriptionService, private paramSpecialiteService: ParametragesSpecialiteService,
    private dialog: MatDialog, private notif: MycustomNotificationService, private http: HttpClient,
    private ngxService: NgxSpinnerService, private paramBaseService: ParametragesBaseService,
    private paramClasseService: ParametrageClasseService
  ) { }

  displayFn(classeSousClasse: ClasseSousClasse): string {
    return classeSousClasse && classeSousClasse.sousClasse ? classeSousClasse.sousClasse.libelle : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.listSousClasse.filter(option => option.sousClasse.libelle.toLowerCase().includes(filterValue));
  }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.paramBaseService.onChangeAnneeScolaireEncoursSession.subscribe(
      (data) => {
        if (data) {
          this.getAnneeScolaireEnCours();
        }
      }
    );
    this.getAnneeScolaireEnCours();
    this.loadListHoraire();
    this.loadListNiveau();

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.listSousClasse.slice())
      );
  }

  onSelectedSession(event) {
    console.log(event);
  }

  getAnneeScolaireEnCours() {
    this.anneeScolaireEncours = JSON.parse(localStorage.getItem('annee-scolaire-encours'));
    if (this.anneeScolaireEncours) {
      this.loadListInscription();
    } else {
      this.subscription.push(
        this.paramBaseService.getAnneeScolaireEnCours().subscribe(
          (annee) => {
            this.anneeScolaireEncours = annee;
            localStorage.setItem('annee-scolaire-encours',
              JSON.stringify(this.anneeScolaireEncours));
          }, (error) => console.log(error),
          () => this.loadListInscription()
        )
      );
    }
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
          (x.etudiant.dateNaissance == null ? '' : this.getFormatedDate(x.etudiant.dateNaissance).toLowerCase())
            .includes(this.searchTerm.trim().toLowerCase())
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

  loadDocuments(niveauId) {
    this.subscription.push(
      this.paramSpecialiteService.getAllDocumentParNiveauByNiveauAndFournir(false, niveauId).subscribe(
        (data) => {
          this.listDocADonner = data;
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
      this.loadDocuments(this.niveauModel.id);
      this.loadListInscriptionBySousClasse(this.sousClasseModel.id);
    } else if (this.niveauModel && this.niveauModel.id && this.specialiteModel && this.specialiteModel.id
      && this.horaireModel && this.horaireModel.id) {
      this.loadDocuments(this.niveauModel.id);
      this.loadListInscriptionByNiveauAndSpecialiteAndHoraire(this.niveauModel.id, this.specialiteModel.id, this.horaireModel.id);
    } else if (this.niveauModel && this.niveauModel.id && this.specialiteModel && this.specialiteModel.id) {
      this.loadDocuments(this.niveauModel.id);
      this.loadListInscriptionByNiveauAndSpecialite(this.niveauModel.id, this.specialiteModel.id);
    } else if (this.niveauModel && this.niveauModel.id && this.horaireModel && this.horaireModel.id) {
      this.loadDocuments(this.niveauModel.id);
      this.loadListInscriptionByNiveauAndHoraire(this.niveauModel.id, this.horaireModel.id);
    } else if (this.niveauModel && this.niveauModel.id) {
      this.loadDocuments(this.niveauModel.id);
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
      this.inscriptionService.getAllInscription(this.anneeScolaireEncours.id).subscribe(
        (data) => {
          console.log(data);
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
        this.loadListInscription();
      }
    });
  }
}
