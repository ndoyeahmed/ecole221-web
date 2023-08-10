import { HttpClient } from '@angular/common/http';
import { style } from '@angular/animations';
import { AnneeScolaireModel } from './../../../../shared/models/annee-scolaire.model';
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
import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MycustomNotificationService } from 'src/app/gestion-school/parametrage/services/mycustom-notification.service';
import * as moment from 'moment';
import { DocumentParNiveauModel } from 'src/app/shared/models/document-par-niveau.model';
import { DomSanitizer } from '@angular/platform-browser';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


/// <reference path ="../../node_modules/@types/jquery/index.d.ts"/>
declare var $: any;
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

  inscriptionColumnsToDisplay = ['nom_prenom', 'datenaissance', 'lieunaissance', 'telephone', 'email', 'classe', 'documentadonner', 'actions'];

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

  urlCarteEtudiant: string;
  docTypeView = 1;

  listPresenceActivated = false;

  constructor(private inscriptionService: InscriptionService, private paramSpecialiteService: ParametragesSpecialiteService,
              private dialog: MatDialog, private notif: MycustomNotificationService, private http: HttpClient,
              private ngxService: NgxSpinnerService, private paramBaseService: ParametragesBaseService,
              private paramClasseService: ParametrageClasseService, private sanitizer: DomSanitizer) { }

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
  }

  secureUlr(url) {
    return this.urlCarteEtudiant ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
      : this.sanitizer.bypassSecurityTrustResourceUrl('');
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

  async getContent() {
    const content = [];
    const image = [];
    this.listInscription.forEach(x => {
      this.inscriptionService.getFilesByName(x.etudiant.photo).subscribe((result) => {
        image.push('data:image/png;base64, ' + result.response);
        content.push(
          {
            table:
            {
              widths: [60, '*', 40],
              body: [
                [
                  {
                    image: 'data:image/png;base64, ' + result.response,
                    width: 60, height: 65
                  },
                  {
                    stack: [
                      { text: 'Nom:', style: 'labelStyle' },
                      { text: x.etudiant.nom, style: 'infosEtudiantStyle' },
                      { text: 'Prénom:', style: 'labelStyle'},
                      { text: x.etudiant.prenom, style: 'infosEtudiantStyle' },
                      { text: 'Téléphone:', style: 'labelStyle' },
                      { text: x.etudiant.telephone, style: 'infosEtudiantStyle'},
                      { text: 'Adresse mail:', style: 'labelStyle' },
                      { text: x.etudiant.email, style: 'infosEtudiantStyle' }
                    ],
                  },
                  {
                    stack: [
                      {
                        image: 'mylogo', fits: [25, 25], width: 25, margin: [0, 0, 0, 2], style: {alignment: 'center'}
                      },
                      { qr: 'med', fit: '25', width: 25, style: {alignment: 'center'} },
                      { text: '#C9900-2020', style: 'promocodeStyle', width: 40, margin: [0, 2, 0, 0]}
                    ]
                  }
                ],
              ]
            },
            layout: 'noBorders'
          },
          {
            table:
            {
              widths: ['100%'],
              body: [
                [
                  {
                    text: x.sousClasse.specialite.libelle,
                    style: 'sectionTitle',
                    fillColor: '#ca151b'
                  }
                ]
              ]
            },
            margin: [0, 2, 0, 8],
            layout: 'noBorders'
          }
        );
      });
    });
    return { image, content };
  }

  async generateCarteEtudiant() {
    let logo = '';
    let photoProfil = '';

    const content = await this.getContent();

    logo = await this.getImageFromAssets('/assets/images/forslide.png');
    photoProfil = await this.getImageFromAssets('/assets/images/login2.png');

    const documentDefinition = {
      header: {
        margin: [20, 15, 20, 20],
        table:
        {
          widths: ['100%'],
          body: [
            [
              {
                text: 'CARTE ETUDIANT',
                style: 'sectionTitle',
                fillColor: '#ca151b'
              }
            ]
          ]
        },
        layout: 'noBorders'
      },
      content: content.content,
      // background: {
      //   image: 'mylogo',
      //   width: 110,
      //   height: 120,
      //   opacity: 0.3,
      //   style: { alignment: 'center' },
      //   margin: [0, 20, 0, 0]
      // },
      footer:
      {
        table:
        {
          headerRows: 1,
          widths: ['*', '*'],
          body: [
            [
              {
                text: 'Dieupeul 1 en face biscuiterie Médina',
                style: 'footerStyle',
                fillColor: '#ca151b',
                margin: [0, 5, 0, 0],
              },
              {
                text: 'E-mail: contact@ecole221.com',
                style: { color: 'white', fontSize: 6, alignment: 'left', bold: true },
                fillColor: '#ca151b',
                margin: [0, 5, 0, 0],
              }
            ],
            [
              {
                text: '+221 33 834 84 41',
                style: 'footerStyle',
                fillColor: '#ca151b',
                margin: [0, 0, 0, 10],
              },
              {
                text: 'web: www.ecole221.com',
                style: { color: 'white', fontSize: 6, alignment: 'left', bold: true },
                fillColor: '#ca151b',
                margin: [0, 0, 0, 10],
              }
            ]
          ]
        },
        layout: 'noBorders'
      },
      pageSize: {
        width: 300, // 2381,1 pt = 84 cm
        height: 170 // 55 cm = ?
      },
      pageMargins: [20, 40, 20, 40],
      styles: {
        sectionTitle: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          color: '#FFFFFF'
        },
        footerStyle: {
          bold: true,
          fontSize: 6,
          alignment: 'right',
          color: '#FFFFFF'
        },
        labelStyle: {
          fontSize: 6,
          alignment: 'left'
        },
        infosEtudiantStyle: {
          bold: true,
          fontSize: 8,
          alignment: 'left'
        },
        promocodeStyle: {
          bold: true,
          fontSize: 5,
          color: '#ca151b',
          alignment: 'center'
        }
      },
      images: {
        mylogo: logo,
        myProfil: photoProfil
      }
    };

    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    pdfDocGenerator.getDataUrl((data) => {
      this.urlCarteEtudiant = data;
      $('#showPDFModal').modal('show');
    });
  }

  getDocumentToPrint(event, inscription) {
    // console.log(event);
    // console.log(inscription);
    $('#showPDFModal').modal('show');
  }

  /* async toDataURL(url, imgDataUrl) {
    return this.http.get(url, { responseType: 'blob' })
      .subscribe(res => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result;
          imgDataUrl = base64data + '';
          console.log(base64data);
        };

        reader.readAsDataURL(res);
        console.log(res);
      });
  }
   */

  async getImageFromAssets(url) {
    const logoResponse = await this.toDataURL(url);

    return await this.toBase64(logoResponse) + '';
  }

  async toDataURL(url) {
    return await this.http.get(url, { responseType: 'blob' }).toPromise();
  }

  async toBase64(response) {

    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onloadend = (file) => {
        resolve(file.target.result);
      };  // CHANGE to whatever function you want which would eventually call resolve
      fr.readAsDataURL(response);
    });
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
          // console.log(data);
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

  async getNewContent() {
    const content = [];
    const image = [];
    this.listInscription.forEach(x => {
      if(x.etudiant && x.etudiant.photo && x.etudiant.photo != null) {
        let resultat = null;
        this.inscriptionService.getFileByName(x.etudiant.photo).subscribe((result) => {
          resultat = result;
        }, (error) => console.log(error),
        async () => {
          console.log(resultat);
          resultat = await this.toBase64(resultat) + '';
          content.push(
            {
              columns: [

                {
                  // star-sized columns fill the remaining space
                  // if there's more than one star-column, available width is divided equally
                  width: '50%',
                  stack: [
                    {
                      columns: [
                        {
                          width: '100%',
                          stack: [
                            {
                              image: resultat ? resultat : 'myProfil',
                              fit: [50, 50]
                            }
                          ],
                          margin: [ 0, 20, 0, 5 ],
                          style: { alignment: 'center' }
                        }
                      ]
                    },
                    {
                      columns: [
                        {
                          width: '10%',
                          stack: [
                            {
                              image: 'contactIcon',
                              width: 20,
                              height: 35
                            }
                          ],
                          margin: [ 0, 3, 0, 0 ]
                        },
                        {
                          width: '90%',
                          stack: [
                            {
                              text: x.etudiant.prenom + ' ' + x.etudiant.nom, style: {fontSize: 9, color: 'black'},
                              margin: [ 3, 6, 0, 0 ],
                            },
                            {
                              margin: [ 3, 3, 0, 15 ],
                              text: x.sousClasse.specialite.libelle, style: {fontSize: 7, color: 'red'}
                            },
                            {
                              columns: [
                                {
                                  width: '10%',
                                  stack: [
                                    {
                                      image: 'tel1Icon',
                                      width: 10,
                                      height: 10
                                    }
                                  ]
                                },
                                {
                                  width: '90%',
                                  text: x.etudiant.telephone, style: {fontSize: 8, color: 'black'}
                                }
                              ],
                              margin: [ 0, 0, 0, 3 ],
                            },
                            {
                              columns: [
                                {
                                  width: '10%',
                                  stack: [
                                    {
                                      image: 'mailIcon',
                                      width: 10,
                                      height: 10
                                    }
                                  ]
                                },
                                {
                                  width: '90%',
                                  text: x.etudiant.email, style: {fontSize: 8, color: 'black'}
                                }
                              ]
                            }
                          ],
                          margin: [ 5, 3, 0, 0 ]
                        }
                      ]
                    }
                  ],
                  margin: [ 0, 20, 0, 0 ],
                },
                {
                  // % width
                  width: '50%',
                  stack: [
                    {
                      columns: [
                        {
                          width: '100%',
                          stack: [
                            {
                              image: 'mylogo',
                              fit: [40, 40]
                            }
                          ],
                          margin: [ 80, 15, 0, 0 ]
                        }
                      ]
                    },
                    {
                      columns: [
                        {
                          width: '100%',
                          stack: [
                            {
                              image: 'mylogo',
                              fit: [40, 40]
                            }
                          ],
                          margin: [ 80, 10, 0, 15 ]
                        }
                      ]
                    },
                    {
                      columns: [
                        {
                          width: '10%',
                          stack: [
                            {
                              image: 'localisationIcon',
                              width: 10,
                              height: 10
                            }
                          ]
                        },
                        {
                          width: '90%',
                          text: 'ndoyeahmed2602@gmail.com', style: {fontSize: 7, color: 'white'}
                        }
                      ],
                      margin: [ 5, 0, 0, 0 ]
                    },
                    {
                      columns: [
                        {
                          width: '10%',
                          stack: [
                            {
                              image: 'mailBlancIcon',
                              width: 10,
                              height: 10
                            }
                          ]
                        },
                        {
                          width: '90%',
                          text: 'Email: contact@ecole221.com', style: {fontSize: 7, color: 'white'}
                        }
                      ],
                      margin: [ 5, 0, 0, 0 ]
                    },
                    {
                      columns: [
                        {
                          width: '10%',
                          stack: [
                            {
                              image: 'phoneIcon',
                              width: 10,
                              height: 10
                            }
                          ]
                        },
                        {
                          width: '90%',
                          text: 'Tel: 33 834 84 41 / 77 117 33 33', style: {fontSize: 7, color: 'white'}
                        }
                      ],
                      margin: [ 5, 0, 0, 0 ]
                    },
                    {
                      columns: [
                        {
                          width: '10%',
                          stack: [
                            {
                              image: 'siteIcon',
                              width: 10,
                              height: 10
                            }
                          ]
                        },
                        {
                          width: '90%',
                          text: 'www.ecole221.com', style: {fontSize: 7, color: 'white'}
                        }
                      ],
                      margin: [ 5, 0, 0, 0 ]
                    }
                  ]
                }
              ],
              // optional space between columns
              columnGap: 0
            }
          );
        }
        );
      } else {

          content.push(
            {
              columns: [

                {
                  // star-sized columns fill the remaining space
                  // if there's more than one star-column, available width is divided equally
                  width: '50%',
                  stack: [
                    {
                      columns: [
                        {
                          width: '100%',
                          stack: [
                            {
                              image: 'myProfil',
                              fit: [50, 50]
                            }
                          ],
                          margin: [ 0, 20, 0, 5 ],
                          style: { alignment: 'center' }
                        }
                      ]
                    },
                    {
                      columns: [
                        {
                          width: '10%',
                          stack: [
                            {
                              image: 'contactIcon',
                              width: 20,
                              height: 35
                            }
                          ],
                          margin: [ 0, 3, 0, 0 ]
                        },
                        {
                          width: '90%',
                          stack: [
                            {
                              text: x.etudiant.prenom + ' ' + x.etudiant.nom, style: {fontSize: 9, color: 'black'},
                              margin: [ 3, 6, 0, 0 ],
                            },
                            {
                              margin: [ 3, 3, 0, 15 ],
                              text: x.sousClasse.specialite.libelle, style: {fontSize: 7, color: 'red'}
                            },
                            {
                              columns: [
                                {
                                  width: '10%',
                                  stack: [
                                    {
                                      image: 'tel1Icon',
                                      width: 10,
                                      height: 10
                                    }
                                  ]
                                },
                                {
                                  width: '90%',
                                  text: x.etudiant.telephone, style: {fontSize: 8, color: 'black'}
                                }
                              ],
                              margin: [ 0, 0, 0, 3 ],
                            },
                            {
                              columns: [
                                {
                                  width: '10%',
                                  stack: [
                                    {
                                      image: 'mailIcon',
                                      width: 10,
                                      height: 10
                                    }
                                  ]
                                },
                                {
                                  width: '90%',
                                  text: x.etudiant.email, style: {fontSize: 8, color: 'black'}
                                }
                              ]
                            }
                          ],
                          margin: [ 5, 3, 0, 0 ]
                        }
                      ]
                    }
                  ],
                  margin: [ 0, 20, 0, 0 ],
                },
                {
                  // % width
                  width: '50%',
                  stack: [
                    {
                      columns: [
                        {
                          width: '100%',
                          stack: [
                            {
                              image: 'mylogo',
                              fit: [40, 40]
                            }
                          ],
                          margin: [ 80, 15, 0, 0 ]
                        }
                      ]
                    },
                    {
                      columns: [
                        {
                          width: '100%',
                          stack: [
                            {
                              image: 'mylogo',
                              fit: [40, 40]
                            }
                          ],
                          margin: [ 80, 10, 0, 15 ]
                        }
                      ]
                    },
                    {
                      columns: [
                        {
                          width: '10%',
                          stack: [
                            {
                              image: 'localisationIcon',
                              width: 10,
                              height: 10
                            }
                          ]
                        },
                        {
                          width: '90%',
                          text: 'ndoyeahmed2602@gmail.com', style: {fontSize: 7, color: 'white'}
                        }
                      ],
                      margin: [ 5, 0, 0, 0 ]
                    },
                    {
                      columns: [
                        {
                          width: '10%',
                          stack: [
                            {
                              image: 'mailBlancIcon',
                              width: 10,
                              height: 10
                            }
                          ]
                        },
                        {
                          width: '90%',
                          text: 'Email: contact@ecole221.com', style: {fontSize: 7, color: 'white'}
                        }
                      ],
                      margin: [ 5, 0, 0, 0 ]
                    },
                    {
                      columns: [
                        {
                          width: '10%',
                          stack: [
                            {
                              image: 'phoneIcon',
                              width: 10,
                              height: 10
                            }
                          ]
                        },
                        {
                          width: '90%',
                          text: 'Tel: 33 834 84 41 / 77 117 33 33', style: {fontSize: 7, color: 'white'}
                        }
                      ],
                      margin: [ 5, 0, 0, 0 ]
                    },
                    {
                      columns: [
                        {
                          width: '10%',
                          stack: [
                            {
                              image: 'siteIcon',
                              width: 10,
                              height: 10
                            }
                          ]
                        },
                        {
                          width: '90%',
                          text: 'www.ecole221.com', style: {fontSize: 7, color: 'white'}
                        }
                      ],
                      margin: [ 5, 0, 0, 0 ]
                    }
                  ]
                }
              ],
              // optional space between columns
              columnGap: 0
            }
          );

      }

    });

    return { image, content };
  }

  async getCardNewVersion() {
    let logo = '';
    let bgCardID = '';
    let photoProfil = '';

    const content = await this.getNewContent();

    logo = await this.getImageFromAssets('/assets/images/forslide.png');
    bgCardID = await this.getImageFromAssets('/assets/images/cardID/bg_cardID.jpg');
    const contactImg = await this.getImageFromAssets('/assets/images/cardID/contact.png');
    const telImg = await this.getImageFromAssets('/assets/images/cardID/logo-phone-rouge.png');
    const mailImg = await this.getImageFromAssets('/assets/images/cardID/logo-mail.png');
    const mailBlancImg = await this.getImageFromAssets('/assets/images/cardID/logo-mail-blanc.png');
    const localisationImg = await this.getImageFromAssets('/assets/images/cardID/logo-localisation.png');
    const phoneImg = await this.getImageFromAssets('/assets/images/cardID/logo-phone.png');
    const siteImg = await this.getImageFromAssets('/assets/images/cardID/logo-site.png');
    photoProfil = await this.getImageFromAssets('/assets/images/login2.png');

    const documentDefinition = {

      content: content.content,
      background: {
        image: 'myBG',
        width: 300,
        height: 170,
        style: { alignment: 'center' }
      },

      pageSize: {
        width: 300, // 2381,1 pt = 84 cm
        height: 170 // 55 cm = ?
      },
      pageMargins: [0, 0, 0, 0],
      styles: {
        sectionTitle: {
          bold: true,
          fontSize: 8,
          alignment: 'center',
          color: '#FFFFFF'
        },
        footerStyle: {
          bold: true,
          fontSize: 6,
          alignment: 'right',
          color: '#FFFFFF'
        },
        labelStyle: {
          fontSize: 6,
          alignment: 'left'
        },
        infosEtudiantStyle: {
          bold: true,
          fontSize: 8,
          alignment: 'left'
        },
        promocodeStyle: {
          bold: true,
          fontSize: 5,
          color: '#ca151b',
          alignment: 'center'
        }
      },
      images: {
        mylogo: logo,
        myProfil: photoProfil,
        myBG: bgCardID,
        contactIcon: contactImg,
        tel1Icon: telImg,
        mailIcon: mailImg,
        mailBlancIcon: mailBlancImg,
        localisationIcon: localisationImg,
        phoneIcon: phoneImg,
        siteIcon: siteImg,
      }
    };

    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    pdfDocGenerator.getDataUrl((data) => {
      this.urlCarteEtudiant = data;
      $('#showPDFModal').modal('show');
    });
  }

}
