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
import {UntypedFormControl} from "@angular/forms";
import {delay, map, startWith} from "rxjs/operators";
import {ClasseModel} from "../../../../shared/models/classe.model";
import {SemestreModel} from "../../../../shared/models/semestre.model";
import {SemestreNiveauModel} from "../../../../shared/models/semestre-niveau.model";
import {ParametrageReferentielService} from "../../../parametrage/services/parametrage-referentiel.service";
import {ProgrammeModuleModel} from "../../../../shared/models/programme-module.model";
import {NotesService} from "../../services/notes.service";
import {NoteProgrammeModuleModel} from "../../../../shared/models/note-programme-module.model";
import {NoteModel} from "../../../../shared/models/note.model";
import {DevoirsModel} from "../../../../shared/models/devoirs.model";
import {RecapNoteProgrammeModuleByProgrammeUeModel} from "../../../../shared/models/recap-note-programme-module-by-programme-ue.model";
import {BulletinRecapModel} from "../../../../shared/models/bulletin-recap.model";
import {BulletinInscriptionModel} from "../../../../shared/models/bulletin-inscription.model";
import {BulletinAllModel} from "../../../../shared/models/bulletin-all.model";
import { PdfGenerationService } from '../../services/pdf-generation.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

/// <reference path ="../../node_modules/@types/jquery/index.d.ts"/>
declare var $: any;

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  showDialog = 'note_etudiant';
  isNoteRemplacement = false;
  isNoteRemplacementok = true;
  title = 'Gestion des notes';
  subscription = [] as Subscription[];
  listInscription = [] as InscriptionModel[];
  listInscriptionFiltered = [] as InscriptionModel[];
  dataSource: MatTableDataSource<InscriptionModel>;
  noteProgrammeModuleDataSource: MatTableDataSource<NoteProgrammeModuleModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('dialogpaginator') dialogpaginator: MatPaginator;

  inscriptionColumnsToDisplay = ['nom_prenom', 'datenaissance', 'lieunaissance',  'telephone', 'actions', 'devoirs', 'exam', 'session'];

  LOADERID = 'list-inscription-loader';

  dialogRef: any;

  niveauModel: NiveauModel;
  specialiteModel: SpecialiteModel;
  horaireModel: HoraireModel;
  sousClasseModel: SousClasseModel;
  semestreModel: SemestreNiveauModel;
  classeSousClasseModel: ClasseSousClasse;
  programmeModuleModel: ProgrammeModuleModel;
  inscriptionId: number;
  inscription: InscriptionModel;
  mdsNote: NoteModel;
  listDevoirs = [] as DevoirsModel[];

  listNiveau = [] as NiveauModel[];
  listSpecialite = [] as NiveauSpecialiteModel[];
  listHoraire = [] as HoraireModel[];
  listSousClasse = [] as ClasseSousClasse[];
  listDocADonner = [] as DocumentParNiveauModel[];
  listSemestre = [] as SemestreNiveauModel[];
  listProgrammeModules = [] as ProgrammeModuleModel[];
  listNoteProgrammeModule = [] as NoteProgrammeModuleModel[];
  listNoteProgrammeModuleEtudiant = [] as NoteProgrammeModuleModel[];
  noteProgrammeModuleEtudiantDataSource: MatTableDataSource<NoteProgrammeModuleModel>;
  recapListNoteProgrammeModuleByProgrammeUe = [] as RecapNoteProgrammeModuleByProgrammeUeModel[];
  bulletinInscription: BulletinInscriptionModel;
  sommeCreditUE = 0;
  sommeMoyenneUE = 0;
  sommeMCR = 0;
  sommeCoef = 0;

  searchTerm: string;
  anneeScolaireEncours: AnneeScolaireModel;

  sessionList = [
    {id: 1, name: 'Normale'},
    {id: 2, name: 'Remplacement'}
  ];

  noteDevoir: any = [];

  sessionModel = {
    id: null,
    name: null
  };

  myControl = new UntypedFormControl();
  filteredOptions: Observable<ClasseSousClasse[]>;
  isClassOk = false;

  bulletinRecaps: BulletinRecapModel[];
  bulletinAllClasse = [] as BulletinAllModel[];
  presValidate = true;

  constructor(
    private inscriptionService: InscriptionService, private paramSpecialiteService: ParametragesSpecialiteService,
    private dialog: MatDialog, private notif: MycustomNotificationService, private http: HttpClient,
    private ngxService: NgxSpinnerService, private paramBaseService: ParametragesBaseService,
    private paramClasseService: ParametrageClasseService, private paramReferentiel: ParametrageReferentielService,
    private noteService: NotesService, private pdfService: PdfGenerationService
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
    this.setFilteredOptions();
  }

  loadNoteProgrammeModule(programmeModuleId) {
    this.subscription.push(
      this.noteService
        .getAllNoteProgrammeModuleByInscriptionAnneeScolaireAndProgrammeModule(this.anneeScolaireEncours.id, programmeModuleId)
        .subscribe(
          (data) => {
            this.listNoteProgrammeModule = data;
            localStorage.setItem('ListNote', JSON.stringify(this.listNoteProgrammeModule));
            this.noteProgrammeModuleDataSource = new MatTableDataSource<NoteProgrammeModuleModel>(this.listNoteProgrammeModule);
            this.noteProgrammeModuleDataSource.paginator = this.paginator;
          },
          (error) => console.log(error)
        )
    );
  }

  setFilteredOptions() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.listSousClasse.slice())
      );
  }

  onSelectedSession(event) {
    this.isNoteRemplacement = this.sessionModel && this.sessionModel.id === 2;
  }

  valideNote() {
    if (this.sessionModel && this.sessionModel.id === 2) {
      this.setNoteToRemplacementState(this.listNoteProgrammeModule);
     // console.log(this.listNoteProgrammeModule);
    }
    if (this.listNoteProgrammeModule && this.listNoteProgrammeModule.length > 0) {
      this.listNoteProgrammeModule.forEach(npm => {
        this.subscription.push(
          this.noteService.updateNote(npm.note, this.programmeModuleModel.id).subscribe(
            (data) => // console.log(data){},
            (error) => console.log(error),
            () => {
              this.loadNoteProgrammeModule(this.programmeModuleModel.id);
              this.presValidate = true;
            }
          )
        );
      });
    }
  }

  loadSemestreEncours(event) {
    const classe = event.option.value as ClasseSousClasse;
    this.classeSousClasseModel = classe;
    const niveauId = classe.sousClasse.niveau.id;
    this.subscription.push(
      this.paramSpecialiteService.getSemestreNiveauEncoursByNiveau(niveauId).subscribe(
        (data) => {
          this.semestreModel = data;
        }, (error) => {
          console.log(error);
          this.isClassOk = false;
        },
        () => {
          this.getModuleListByClasseAndSemestre();
          this.isClassOk = true;
        }
      )
    );
    this.subscription.push(
      this.paramSpecialiteService.getAllSemestreNiveauByNiveau(niveauId).subscribe(
        (data) => {
          this.listSemestre = data;
        }, (error) => console.log(error)
      )
    );
    this.loadListInscriptionBySousClasse(classe.sousClasse.id);
  }

  getModuleListByClasseAndSemestre() {
    if (this.classeSousClasseModel && this.classeSousClasseModel.id && this.semestreModel && this.semestreModel.id) {
      this.subscription.push(
        this.paramReferentiel
          .getAllProgrammeModuleByClasseAndSemestre(this.classeSousClasseModel.classe.id, this.semestreModel.semestre.id)
          .subscribe(
            (data) => {
              this.listProgrammeModules = data;
            },
            (error) => console.log(error)
          )
      );
    }
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
          () => {
            this.loadListInscription();
          }
        )
      );
    }
  }

  onSearchByTaping() {
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
    this.subscription.push(
      this.paramClasseService.getAllClasseSousClasseByHoraire(this.horaireModel.id)
        .subscribe(
          (data) => {
            this.listSousClasse = data;
          }, (error) => console.log(error)
        )
    );
  }

  loadListInscriptionBySpecialite(specialiteId) {
    this.listInscriptionFiltered = this.listInscription.filter(
      x => Number(x.sousClasse.specialite.id) === Number(specialiteId)
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

  }

  cancelSearch(searchForm) {
    searchForm.resetForm();
    this.listInscriptionFiltered = [];
    this.listNoteProgrammeModule = [];
    this.semestreModel = null;
    this.horaireModel = null;
    this.myControl = new UntypedFormControl();
    this.setFilteredOptions();
    this.loadListInscription();
  }

  loadListInscription() {
    this.subscription.push(
      this.inscriptionService.getAllInscription(this.anneeScolaireEncours.id).subscribe(
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
        this.loadListInscription();
      }
    });
  }

  onSelectProgrammeModule(event) {
    this.loadNoteProgrammeModule(event.value.id);
  }

  onOpenModuleSelect(event) {
    if (this.presValidate === false) {
      this.notif.warning('Veuillez d\'abord valider les notes actuelles');
    }
  }

  onChangeNoteExam(inscription, $event) {
    this.presValidate = false;
    if (this.sessionModel && this.sessionModel.id === 2) {
      const newNote = $event.target.value;
      const listnote = JSON.parse(localStorage.getItem('ListNote')) as NoteProgrammeModuleModel[];
      listnote.forEach(ln => {
        if (Number(ln.id) === Number(inscription.id)) {
          if (Number(ln.note.nef) > Number(newNote)) {
            this.isNoteRemplacementok = false;
            inscription.styleNoteOnRemplacement = {color: 'red'};
            inscription.errorMessage = 'La note de remplacement doit etre supérieur à la note normale';
          } else {
            this.isNoteRemplacementok = true;
            inscription.styleNoteOnRemplacement = {color: 'black'};
            inscription.errorMessage = '';
          }
        }
      });
    }
  }

  onSelectedNoteSession(event, inscription) {
    inscription.isSessionRemplacementNote = event.checked === true;
    inscription.note.session = event.checked === true ? 1 : 0;
  }

  setNoteToRemplacementState(listnoteUpdated: NoteProgrammeModuleModel[]) {
    const listnote = JSON.parse(localStorage.getItem('ListNote')) as NoteProgrammeModuleModel[];
    for (const npm of listnote) {
      if (Number(npm.id) === Number(listnoteUpdated[listnote.indexOf(npm)].id)) {
        if (Number(npm.note.nef) === Number(listnoteUpdated[listnote.indexOf(npm)].note.nef)) {
          listnoteUpdated[listnote.indexOf(npm)].note.session = 0;
        } else {
          listnoteUpdated[listnote.indexOf(npm)].note.session = 1;
        }
      }
    }
  }

  loadListNoteProgrammeModule() {
    if (!this.classeSousClasseModel || !this.classeSousClasseModel.classe.id || !this.semestreModel || !this.semestreModel.semestre.id) {
      this.subscription.push(
        this.noteService.getAllNoteProgrammeModuleByInscription(
          this.inscriptionId
        ).subscribe(
          (data) => {
            this.listNoteProgrammeModuleEtudiant = data;
          //  console.log(data);
            this.noteProgrammeModuleEtudiantDataSource = new MatTableDataSource<NoteProgrammeModuleModel>
            (this.listNoteProgrammeModuleEtudiant);
            localStorage.setItem('list-note-etudiant', JSON.stringify(data));
          }, (error) => console.log(error)
        )
      );
    } else {
      this.subscription.push(
        this.noteService.getAllNoteProgrammeModuleByInsClasseSemestre(
          this.inscriptionId, this.classeSousClasseModel.classe.id, this.semestreModel.semestre.id
        ).subscribe(
          (data) => {
            this.listNoteProgrammeModuleEtudiant = data;
            console.log(data);
            this.noteProgrammeModuleEtudiantDataSource = new MatTableDataSource<NoteProgrammeModuleModel>
            (this.listNoteProgrammeModuleEtudiant);
            localStorage.setItem('list-note-etudiant', JSON.stringify(data));
          }, (error) => console.log(error)
        )
      );
    }
  }

  onSetNoteForOneStudent(item) {
    this.showDialog = 'note_etudiant';
    if (this.listNoteProgrammeModule && this.listNoteProgrammeModule.length > 0) {
      this.inscriptionId = item.note.inscription.id;
      this.inscription = item.note.inscription;
    } else {
      this.inscriptionId = item.id;
      this.inscription = item;
    }
    this.loadListNoteProgrammeModule();
    $('#showNoteModal').modal('show');
  }

  loadListDevoirByNote(note) {
    this.subscription.push(
      this.noteService.getAllDevoirsByNote(note.id).subscribe(
        (data) => {
          this.listDevoirs = data;
        }, (error) => console.log(error),
        () => {
          if (this.listDevoirs.length <= 0) {
            this.addNewInput();
            this.addNewInput();
          }
        }
      )
    );
  }

  addNewInput() {
    const devoir = new DevoirsModel();
    this.listDevoirs.push(devoir);
  }

  onAddNoteDevoir(note) {
    this.mdsNote = note;
    this.loadListDevoirByNote(note);
    this.showDialog = 'devoirs-list';
    $('#showNoteModal').modal('show');
  }

  async onShowBulletinEtudiant(item) {
    this.noteService.onGenerateAllBulletin.next([]);
    this.showDialog = 'bulletin_etudiant';
    if (this.listNoteProgrammeModule && this.listNoteProgrammeModule.length > 0) {
      this.inscriptionId = item.note.inscription.id;
      this.inscription = item.note.inscription;
    } else {
      this.inscriptionId = item.id;
      this.inscription = item;
    }
    await this.getAllRecapNoteProgrammeModuleByProgrammeUE();
    // this.getAllProgrammeUeInscriptionByInscription(this.inscriptionId);
    $('#showNoteModal').modal('show');
  }

  getAllRecapNoteProgrammeModuleByProgrammeUE() {
    this.subscription.push(
      this.noteService.getRecapNoteProgrammeModuleByProgrammeUE(this.inscriptionId).subscribe(
        (data) => {
          this.bulletinInscription = data;
          this.recapListNoteProgrammeModuleByProgrammeUe = this.bulletinInscription.recapNoteProgrammeModuleByProgrammeUES;
        }, (error) => console.log(error),
        () => {
          this.sommeMoyenneUE = 0;
          this.sommeCreditUE = 0;
          this.sommeMCR = 0;
          this.sommeCoef = 0;
          this.recapListNoteProgrammeModuleByProgrammeUe.forEach(recap => {
            this.sommeCreditUE = this.sommeCreditUE + recap.programmeUE.credit;
            this.sommeMoyenneUE = this.sommeMoyenneUE + recap.moyenneUE;
            this.sommeMCR = this.sommeMCR + (recap.moyenneUE * recap.programmeUE.credit);
            recap.noteProgrammeModules.forEach(n => {
              this.sommeCoef = this.sommeCoef + n.programmeModule.coef;
            });
          });
        }
      )
    );

    this.getBulletinRecapByInscription(this.inscriptionId);
  }

  getBulletinRecapByInscription(inscriptionId) {
    this.subscription.push(
      this.noteService.getBulletinRecapByInscription(inscriptionId).subscribe(
        (data) => {
          // console.log('moyenne');
          this.bulletinRecaps = data;
          // console.log(this.bulletinRecaps);
        }, (error) => console.log(error)
      )
    );
  }

  getAllProgrammeUeInscriptionByInscription(idInscription: number) {
    this.subscription.push(
      this.noteService.getAllProgrammeUEInscriptionByInscription(idInscription)
        .subscribe(
          (data) => {
            // console.log(data);
          }, (error) => console.log(error)
        )
    );
  }

  async getStatClasse() {
    this.bulletinAllClasse = [];
    if (this.listInscriptionFiltered && this.listInscriptionFiltered.length > 0) {
      for (const inscription1 of this.listInscriptionFiltered) {
        await this.getAllRecapNoteProgrammeModuleByProgrammeUEByInscriptionForStat(inscription1);
      }
     /*  console.log('---------------------this.bulletinAllClasse');
      console.log(this.bulletinAllClasse[0]); */
      // await delay(5000);

      const docDef = await this.pdfService.generateStats(this.bulletinAllClasse, this.semestreModel);
      pdfMake.createPdf(docDef).download('statistiques');
    }

  }

  generateBulletine() {

  }



  async getAllBulletinClasse() {
    this.bulletinAllClasse = [];
    if (this.listInscriptionFiltered && this.listInscriptionFiltered.length > 0) {
      this.blockUI.start();
      for (const inscription1 of this.listInscriptionFiltered) {
        await this.getAllRecapNoteProgrammeModuleByProgrammeUEByInscriptionForStat(inscription1);
      }
      /*console.log('---------------------this.bulletinAllClasse');
      console.log(this.bulletinAllClasse);*/
      this.showDialog = 'bulletin_etudiant';
      // $('#showNoteModal').modal('show');
      this.noteService.onGenerateAllBulletin.next(this.bulletinAllClasse);
      this.noteService.onGenerateAllBulletinClasse.next(this.classeSousClasseModel);
      this.blockUI.stop();
    }
  }

  async getAllRecapNoteProgrammeModuleByProgrammeUEByInscription(inscription) {
    let bulletinAllModel = new BulletinAllModel();
    await this.noteService.getRecapNoteProgrammeModuleByProgrammeUEAndSemestre(inscription.id, this.semestreModel.semestre.id).subscribe(
      (data) => {
        bulletinAllModel.moyenneGeneral = data.moyenneGeneral;
        bulletinAllModel.recapListNoteProgrammeModuleByProgrammeUe = data.recapNoteProgrammeModuleByProgrammeUES;
      }, (error) => console.log(error),
      () => {
        bulletinAllModel.inscription = inscription;
        bulletinAllModel.sommeMoyenneUE = 0;
        bulletinAllModel.sommeCreditUE = 0;
        bulletinAllModel.sommeMCR = 0;
        bulletinAllModel.sommeCoef = 0;
        bulletinAllModel.recapListNoteProgrammeModuleByProgrammeUe.forEach(recap => {
          bulletinAllModel.sommeCreditUE = bulletinAllModel.sommeCreditUE + recap.programmeUE.credit;
          bulletinAllModel.sommeMoyenneUE = bulletinAllModel.sommeMoyenneUE + recap.moyenneUE;
          bulletinAllModel.sommeMCR = bulletinAllModel.sommeMCR + (recap.moyenneUE * recap.programmeUE.credit);
          recap.noteProgrammeModules.forEach(n => {
            bulletinAllModel.sommeCoef = bulletinAllModel.sommeCoef + n.programmeModule.coef;
          });
        });
      }
    );

    await this.noteService.getBulletinRecapByInscription(inscription.id).subscribe(
      (data) => {
        bulletinAllModel.bulletinRecaps = data;
      }, (error) => console.log(error)
    );

    this.bulletinAllClasse.push(bulletinAllModel);
  }

  async getAllRecapNoteProgrammeModuleByProgrammeUEByInscriptionForStat(inscription) {
    let bulletinAllModel = new BulletinAllModel();
    await this.noteService.getRecapNoteProgrammeModuleByProgrammeUEAndSemestre(inscription.id, this.semestreModel.semestre.id)
    .toPromise().then(
      (data) => {
        bulletinAllModel.moyenneGeneral = data.moyenneGeneral;
        bulletinAllModel.recapListNoteProgrammeModuleByProgrammeUe = data.recapNoteProgrammeModuleByProgrammeUES;
        bulletinAllModel.inscription = inscription;
        bulletinAllModel.sommeMoyenneUE = 0;
        bulletinAllModel.sommeCreditUE = 0;
        bulletinAllModel.sommeMCR = 0;
        bulletinAllModel.sommeCoef = 0;
        bulletinAllModel.recapListNoteProgrammeModuleByProgrammeUe.forEach(recap => {
          bulletinAllModel.sommeCreditUE = bulletinAllModel.sommeCreditUE + recap.programmeUE.credit;
          bulletinAllModel.sommeMoyenneUE = bulletinAllModel.sommeMoyenneUE + recap.moyenneUE;
          bulletinAllModel.sommeMCR = bulletinAllModel.sommeMCR + (recap.moyenneUE * recap.programmeUE.credit);
          recap.noteProgrammeModules.forEach(n => {
            bulletinAllModel.sommeCoef = bulletinAllModel.sommeCoef + n.programmeModule.coef;
          });
        });
      });

    await this.noteService.getBulletinRecapByInscription(inscription.id).toPromise().then(
      (data) => {
        bulletinAllModel.bulletinRecaps = data;
      }
    );

    this.bulletinAllClasse.push(bulletinAllModel);
  }
}
