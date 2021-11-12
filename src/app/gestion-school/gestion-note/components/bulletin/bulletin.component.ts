import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {RecapNoteProgrammeModuleByProgrammeUeModel} from '../../../../shared/models/recap-note-programme-module-by-programme-ue.model';
import {InscriptionModel} from '../../../../shared/models/inscription.model';
import {BulletinRecapModel} from '../../../../shared/models/bulletin-recap.model';
import {DomSanitizer} from '@angular/platform-browser';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {HttpClient} from '@angular/common/http';
import {log} from 'util';
import * as moment from 'moment/moment';
import {SemestreNiveauModel} from '../../../../shared/models/semestre-niveau.model';
import {NotesService} from "../../services/notes.service";
import {Subscription} from "rxjs";
import {BulletinAllModel} from "../../../../shared/models/bulletin-all.model";
import {ClasseSousClasse} from "../../../../shared/models/classe-sous-classe.model";
import {ParametragesSpecialiteService} from "../../../parametrage/services/parametrages-specialite.service";

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


/// <reference path ="../../node_modules/@types/jquery/index.d.ts"/>
declare var $: any;

@Component({
  selector: 'app-bulletin',
  templateUrl: './bulletin.component.html',
  styleUrls: ['./bulletin.component.css']
})
export class BulletinComponent implements OnInit, OnDestroy {
  @Input() listRecapNoteProgrammeModule: RecapNoteProgrammeModuleByProgrammeUeModel[];
  @Input() bulletinRecapModels: BulletinRecapModel[];
  @Input() inscription: InscriptionModel;
  @Input() moyenneGenerale: number;
  // @Input() classe: ClasseModel;
  @Input() sommeCredit: number;
  @Input() sommeMoyenneUE: number;
  @Input() sommeMCR: number;
  @Input() sommeCoef: number;
  @Input() semestre: SemestreNiveauModel;

  subscription = [] as Subscription[];
  bulletinAllClasse = [] as BulletinAllModel[];
  semestreNiveauArray = [] as SemestreNiveauModel[];
  recapSemestreInscription = [];
  classeSousClasse: ClasseSousClasse;
  url = '';

  constructor(private sanitizer: DomSanitizer,
              private noteService: NotesService,
              private paramSpecialiteService: ParametragesSpecialiteService,
              private http: HttpClient) {
  }

  ngOnDestroy(): void {
    this.subscription.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.onGenerateAllBulletin();
  }

  getRecapSemestreInscriptionByInscriptionEtudiant(etudiantId) {
    this.subscription.push(
      this.noteService.getRecapSemestreInscriptionValideByInscriptionEtudiant(etudiantId)
        .subscribe(
          (data) => {
            this.recapSemestreInscription = data;
          }, (error) => console.log(error)
        )
    );
  }

  getSemestreNiveauByNiveau(niveauId) {
    this.subscription.push(
      this.paramSpecialiteService.getAllSemestreNiveauByNiveau(niveauId).subscribe(
        (data) => {
          this.semestreNiveauArray = data;
        }, (error) => console.log(error),
        () => {
        }
      )
    );
  }

  async generateBulletin() {
    const logo = await this.getImageFromAssets('/assets/images/bulletin/header.png');
    const footer = await this.getImageFromAssets('/assets/images/bulletin/footer.png');
    console.log(logo);
    return {
      header: {
        columns: [
          {
            margin: [0, 0, 0, 0],
            image: 'mylogo', width: 600, height: 80
          }
        ],
      },
      footer: {
        columns: [
          {
            margin: [0, 0, 0, 0],
            image: 'footerImg', width: 600, height: 60
          }
        ],
      },
      content: [
        {
          text: 'RELEVé DES NOTES '.toUpperCase() + this.inscription?.anneeScolaire?.libelle,
          style: 'bulletinNote', alignment: 'center', margin: [0, 5, 0, 15]
        },
        {
          columns: [
            {
              width: '50%',
              stack: [
                {
                  columns: [
                    {text: 'Domaine: ', style: 'labelStyle', width: '20%'},
                    {
                      text: this.inscription ? this.inscription.sousClasse.specialite.mention.domaine.libelle ?
                        this.inscription.sousClasse.specialite.mention.domaine.libelle : '' : '',
                      fontSize: 10, width: '80%'
                    },
                  ]
                },
                {
                  columns: [
                    {text: 'Spécialité: ', style: 'labelStyle', width: '20%'},
                    {
                      text: this.inscription ? this.inscription.sousClasse.specialite.libelle ?
                        this.inscription.sousClasse.specialite.libelle : '' : '',
                      fontSize: 10, width: '80%'
                    },
                  ]
                },
                {
                  columns: [
                    {text: 'Classe: ', style: 'labelStyle', width: '20%'},
                    {
                      text: this.inscription ? this.inscription.sousClasse.libelle ? this.inscription.sousClasse.libelle : '' : '',
                      fontSize: 10, width: '80%'
                    },
                  ]
                }
              ],
            },
            {
              width: '50%',
              stack: [
                {
                  columns: [
                    {text: 'Mention: ', style: 'labelStyle', width: '20%'},
                    {
                      text: this.inscription ? this.inscription.sousClasse.specialite.mention.libelle ?
                        this.inscription.sousClasse.specialite.mention.libelle : '' : '',
                      fontSize: 10, width: '80%'
                    },
                  ]
                },
                {
                  columns: [
                    {text: 'Parcours: ', style: 'labelStyle', width: '20%'},
                    {
                      text: this.inscription ? this.inscription.sousClasse.niveau.parcours.libelle ?
                        this.inscription.sousClasse.niveau.parcours.libelle : '' : '',
                      fontSize: 10, width: '80%'
                    },
                  ]
                },
                {
                  columns: [
                    {text: 'Semestre: ', style: 'labelStyle', width: '20%'},
                    {text: this.semestre?.semestre?.libelle, fontSize: 10, width: '80%'},
                  ]
                }
              ],
            }
          ]
        },
        {
          margin: [0, 15, 0, 15],
          table: {
            body: [
              [
                {
                  fillColor: '#afaeae',
                  columns: [
                    {
                      width: 220,
                      stack: [
                        {
                          columns: [
                            {text: 'Matricule: ', style: 'labelStyle', width: 60},
                            {text: this.inscription?.etudiant?.matricule, fontSize: 10, width: 140},
                          ]
                        },
                        {
                          columns: [
                            {text: 'Nom: ', style: 'labelStyle', width: 60},
                            {text: this.inscription?.etudiant?.nom.toUpperCase(), fontSize: 10, width: 140},
                          ]
                        },
                        {
                          columns: [
                            {text: 'Prénom: ', style: 'labelStyle', width: 60},
                            {text: this.inscription?.etudiant?.prenom.toUpperCase(), fontSize: 10, width: 160},
                          ]
                        }
                      ],
                    },
                    {
                      width: 345,
                      stack: [
                        {
                          columns: [
                            {text: 'Date et lieu de naissance: ', style: 'labelStyle', width: 150},
                            {
                              text: moment(this.inscription?.etudiant?.dateNaissance).format('DD/MM/YYYY') + ' ' +
                                this.inscription?.etudiant?.lieuNaissance,
                              fontSize: 10, width: 195
                            },
                          ]
                        },
                        {
                          columns: [
                            {text: 'Pays: ', style: 'labelStyle', width: 50},
                            {text: this.inscription?.etudiant?.pays?.libelle.toUpperCase(), fontSize: 10, width: 200},
                          ]
                        },
                        {
                          columns: [
                            {text: 'Sexe: ', style: 'labelStyle', width: 50},
                            {text: this.inscription?.etudiant?.genre.toUpperCase(), fontSize: 10, width: 200},
                          ]
                        }
                      ],
                    }
                  ]
                }
              ]
            ]
          }
        },
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 2,
            widths: [100, 144, 30, 30, 30, 30, 30, 30, 30, 30],

            body: this.getTableRowsForBulletin(this.listRecapNoteProgrammeModule,
              this.sommeCoef, this.sommeMoyenneUE, this.sommeCredit, this.sommeMCR)
          }
        },
        {
          margin: [0, 5, 0, 0],
          table: {
            body: [
              [
                {
                  text: ' MDS:Moyenne Devoirs Surveillés, NEF:Note de l\'Examen Final, MUE:Moyenne Unite d\'Enseignement, NCR:Nombre de Credit, MCR:Moyenne Credité, VAL:Validation, V:Validé, NV:Non Validé, VSR:ValidéSession de Remplacement',
                  fontSize: 7
                }
              ],
              [
                {
                  text: this.addLegende(this.listRecapNoteProgrammeModule),
                  fontSize: 7
                }
              ]
            ]
          }
        },
        {
          columns: [
            {
              width: '50%',
              margin: [0, 15, 0, 0],
              style: 'moyenneG',
              text: 'Moyenne General : ' + this.formatNumber(this.moyenneGenerale)
            },
            {
              width: '50%',
              margin: [0, 15, 0, 0],
              style: 'moyenneG',
              text: 'Appréciation : Passable'
            }
          ]
        },
        {
          margin: [0, 20, 0, 0],
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [100, 100, 100],

            body: this.getBulletinRecapTablePdf(this.bulletinRecapModels, this.inscription)
          }
        },
        {
          columns: [
            {
              width: '50%',
              margin: [0, 15, 0, 0],
              fontSize: 11,
              bold: true,
              text: 'Decision du Conseil: Admis'
            },
            {
              width: '50%',
              margin: [0, 15, 0, 0],
              stack: [
                {
                  fontSize: 11,
                  bold: true,
                  decoration: 'underline',
                  color: '#000000',
                  alignment: 'center',
                  text: 'Le Directeur des Etudes'
                },
                {
                  text: 'Nom du Directeur',
                  fontSize: 11,
                  alignment: 'center',
                }
              ]
            }
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#b80d0d'
        },
        subtitle: {
          fontSize: 11,
          bold: true,
          color: '#b80d0d'
        },
        bulletinNote: {
          fontSize: 14,
          color: '#000000',
          decoration: 'underline',
          background: '#afaeae'
        },
        labelStyle: {
          fontSize: 12,
          color: '#000000',
          bold: true
        },
        tableHeader: {
          fontSize: 10,
          color: '#000000',
          bold: true,
          alignment: 'center'
        },
        tableData: {
          fontSize: 9,
          color: '#000000',
          alignment: 'center'
        },
        tableUE: {
          fontSize: 10,
          color: '#000000'
        },
        tableModule: {
          fontSize: 10,
          color: '#000000'
        },
        moyenneG: {
          fontSize: 12,
          bold: true,
          color: '#000000'
        }
      },
      images: {
        mylogo: logo,
        footerImg: footer,
      },
      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [10, 80, 10, 60]
    };
  }

  getBulletinRecapTablePdf(bulletinRecapModels: BulletinRecapModel[], inscription: InscriptionModel) {
    const body = [];
    const headers = [
      {text: 'Semestre', style: 'tableHeader'},
      {text: 'Nombre Crédit', style: 'tableHeader'},
      {text: 'Statut', style: 'tableHeader'},
    ];
    body.push(headers);
    // let cpt = 0;


    for (let i = 0; i < 2; i++){
      const bulletinRecap = bulletinRecapModels[i];
      let col;
      if (this.semestre.semestre.numero === 1 && bulletinRecap.semestre.id === this.semestre.semestre.id) {
        col = [
          {text: bulletinRecap ? bulletinRecap.semestre ? bulletinRecap.semestre.libelle : '' : '', style: 'tableData'},
          {
            text: bulletinRecap ?
              bulletinRecap.totalCreditSemestre ? (bulletinRecap.totalCredit ? bulletinRecap.totalCredit : '0') : '--' : '--',
            style: 'tableData'
          },

          {
            text: bulletinRecap ?
              bulletinRecap.valide ? (bulletinRecap.totalCreditSemestre ? 'Validé' : '--') :
                (bulletinRecap.totalCreditSemestre ? 'Non Validé' : '--') : '--', style: 'tableData'
          },
        ];
      } else if (this.semestre.semestre.numero === 2) {
        col = [
          {text: bulletinRecap ? bulletinRecap.semestre ? bulletinRecap.semestre.libelle : '' : '', style: 'tableData'},
          {
            text: bulletinRecap ?
              bulletinRecap.totalCreditSemestre ? (bulletinRecap.totalCredit ? bulletinRecap.totalCredit : '0') : '--' : '--',
            style: 'tableData'
          },

          {
            text: bulletinRecap ?
              bulletinRecap.valide ? (bulletinRecap.totalCreditSemestre ? 'Validé' : '--') :
                (bulletinRecap.totalCreditSemestre ? 'Non Validé' : '--') : '--', style: 'tableData'
          },
        ];
      } else {
        col = [
          {text: bulletinRecap ? bulletinRecap.semestre ? bulletinRecap.semestre.libelle : '' : '', style: 'tableData'},
          {text:  '--', style: 'tableData'},

          {text: '--', style: 'tableData'},
        ];
      }
      body.push(col);

    }

    return body;
  }

  getTableRowsForBulletin(listRecapNoteProgrammeModule, sommeCoef, sommeMoyenneUE, sommeCredit, sommeMCR) {
    const body = [];
    const headers1 = [{text: 'Unités d\'enseignement', style: 'tableHeader', rowSpan: 2},
      {text: 'Elements Constitutifs', style: 'tableHeader', colSpan: 5}, {}, {}, {}, {},
      {text: 'MU.E', style: 'tableHeader', rowSpan: 2},
      {text: 'Crédits', style: 'tableHeader', colSpan: 3}, {}, {}
    ];
    const headers2 = [{},
      {text: 'Intitulé', style: 'tableHeader'},
      {text: 'MDS', style: 'tableHeader'},
      {text: 'NEF', style: 'tableHeader'},
      {text: 'Moy', style: 'tableHeader'},
      {text: 'Coef', style: 'tableHeader'},
      {text: 'tds', style: 'tableHeader'},
      {text: 'CR', style: 'tableHeader'},
      {text: 'MCR', style: 'tableHeader'},
      {text: 'VAL', style: 'tableHeader'},
    ];
    body.push(headers1);
    body.push(headers2);
    listRecapNoteProgrammeModule.forEach(data => {
      const col = [
        {
          text: data.programmeUE.code, style: 'tableUE',
          rowSpan: data.noteProgrammeModules.length
        },
        // libelle length max 31 caraters
        {text: data.noteProgrammeModules[0].programmeModule.module.libelle, style: 'tableModule'},
        {text: this.formatNumber(data.noteProgrammeModules[0].note.mds), style: 'tableData'},
        {text: data.noteProgrammeModules[0].note.nef, style: 'tableData'},
        {
          text: this.formatNumber((Number(data.noteProgrammeModules[0].note.nef) + Number(data.noteProgrammeModules[0].note.mds)) / 2),
          style: 'tableData'
        },
        {text: data.noteProgrammeModules[0].programmeModule.coef, style: 'tableData'},
        {text: this.formatNumber(data.moyenneUE), style: 'tableData', rowSpan: data.noteProgrammeModules.length},
        {text: data.programmeUE.credit, style: 'tableData', rowSpan: data.noteProgrammeModules.length},
        {
          text: this.formatNumber((data.moyenneUE * data.programmeUE.credit)),
          style: 'tableData', rowSpan: data.noteProgrammeModules.length
        },
        {text: data.moyenneUE >= 10 ? 'V' : 'NV', style: 'tableData', rowSpan: data.noteProgrammeModules.length},
      ];
      body.push(col);
      data.noteProgrammeModules.forEach(noteProgrammeModule => {
        if (data.noteProgrammeModules.indexOf(noteProgrammeModule) !== 0) {
          const col2 = [
            {},
            {text: noteProgrammeModule.programmeModule.module.libelle, style: 'tableModule'},
            {text: this.formatNumber(noteProgrammeModule.note.mds), style: 'tableData'},
            {text: this.formatNumber(noteProgrammeModule.note.nef), style: 'tableData'},
            {
              text: this.formatNumber((Number(noteProgrammeModule.note.mds) + Number(noteProgrammeModule.note.nef)) / 2),
              style: 'tableData'
            },
            {text: noteProgrammeModule.programmeModule.coef, style: 'tableData'},
            {},
            {},
            {},
            {},
          ];
          body.push(col2);
        }
      });
    });

    const col3 = [
      {text: 'Total', style: 'tableModule'},
      {},
      {},
      {},
      {},
      {text: sommeCoef, style: 'tableData'},
      {text: this.formatNumber(sommeMoyenneUE), style: 'tableData'},
      {text: sommeCredit, style: 'tableData'},
      {text: this.formatNumber(sommeMCR), style: 'tableData'},
      {},
    ];

    body.push(col3);

    return body;
  }

  formatNumber(num, numberDigits = 2) {
    return (Math.round(num * 100) / 100).toFixed(numberDigits);
  }

  addLegende(listRecapNoteProgrammeModule) {
    let legende = '';
    listRecapNoteProgrammeModule.forEach(data => {
      legende = legende + data.programmeUE.code + ' : ' + data.programmeUE.ue.libelle + ', ';
    });

    return legende;
  }

  async printBulletin() {
    const docDef = await this.generateBulletin();
    pdfMake.createPdf(docDef).print();
  }

  async downloadBulletin() {
    const filename = '' +
      this.inscription.etudiant.nom +
      this.inscription.etudiant.prenom + moment();
    const docDef = await this.generateBulletin();
    pdfMake.createPdf(docDef).download(filename);
  }

  async downloadAllBulletin() {
    const filename = this.classeSousClasse.classe.libelle + '-' +
      this.semestre.semestre.libelle + '-' +
      moment().format('DD-MM-YYYY HH-mm-ss');
    const docDef = await this.generateAllBulletin();
    pdfMake.createPdf(docDef).download(filename);
  }

  getAllBulletinContent() {
    const content = [];
    let cpt = 0;
    if (this.bulletinAllClasse && this.bulletinAllClasse.length > 0) {
      this.bulletinAllClasse.forEach(bulletinAll => {
        cpt++;
        content.push(...[
          {
            text: 'RELEVé DES NOTES '.toUpperCase() + bulletinAll.inscription?.anneeScolaire?.libelle,
            style: 'bulletinNote', alignment: 'center', margin: [0, 5, 0, 15]
          },
          {
            columns: [
              {
                width: '50%',
                stack: [
                  {
                    columns: [
                      {text: 'Domaine: ', style: 'labelStyle', width: '20%'},
                      {
                        text: bulletinAll.inscription ? bulletinAll.inscription.sousClasse.specialite.mention.domaine.libelle ?
                          bulletinAll.inscription.sousClasse.specialite.mention.domaine.libelle : '' : '',
                        fontSize: 10, width: '80%'
                      },
                    ]
                  },
                  {
                    columns: [
                      {text: 'Spécialité: ', style: 'labelStyle', width: '20%'},
                      {
                        text: bulletinAll.inscription ? bulletinAll.inscription.sousClasse.specialite.libelle ?
                          bulletinAll.inscription.sousClasse.specialite.libelle : '' : '',
                        fontSize: 10, width: '80%'
                      },
                    ]
                  },
                  {
                    columns: [
                      {text: 'Classe: ', style: 'labelStyle', width: '20%'},
                      {
                        text: bulletinAll.inscription ? bulletinAll.inscription.sousClasse.libelle ?
                          bulletinAll.inscription.sousClasse.libelle : '' : '',
                        fontSize: 10, width: '80%'
                      },
                    ]
                  }
                ],
              },
              {
                width: '50%',
                stack: [
                  {
                    columns: [
                      {text: 'Mention: ', style: 'labelStyle', width: '20%'},
                      {
                        text: bulletinAll.inscription ? bulletinAll.inscription.sousClasse.specialite.mention.libelle ?
                          bulletinAll.inscription.sousClasse.specialite.mention.libelle : '' : '',
                        fontSize: 10, width: '80%'
                      },
                    ]
                  },
                  {
                    columns: [
                      {text: 'Parcours: ', style: 'labelStyle', width: '20%'},
                      {
                        text: bulletinAll.inscription ? bulletinAll.inscription.sousClasse.niveau.parcours.libelle ?
                          bulletinAll.inscription.sousClasse.niveau.parcours.libelle : '' : '',
                        fontSize: 10, width: '80%'
                      },
                    ]
                  },
                  {
                    columns: [
                      {text: 'Semestre: ', style: 'labelStyle', width: '20%'},
                      {text: this.semestre?.semestre?.libelle, fontSize: 10, width: '80%'},
                    ]
                  }
                ],
              }
            ]
          },
          {
            margin: [0, 15, 0, 15],
            table: {
              body: [
                [
                  {
                    fillColor: '#afaeae',
                    columns: [
                      {
                        width: 220,
                        stack: [
                          {
                            columns: [
                              {text: 'Matricule: ', style: 'labelStyle', width: 60},
                              {text: bulletinAll.inscription?.etudiant?.matricule, fontSize: 10, width: 140},
                            ]
                          },
                          {
                            columns: [
                              {text: 'Nom: ', style: 'labelStyle', width: 60},
                              {text: bulletinAll.inscription?.etudiant?.nom.toUpperCase(), fontSize: 10, width: 140},
                            ]
                          },
                          {
                            columns: [
                              {text: 'Prénom: ', style: 'labelStyle', width: 60},
                              {text: bulletinAll.inscription?.etudiant?.prenom.toUpperCase(), fontSize: 10, width: 160},
                            ]
                          }
                        ],
                      },
                      {
                        width: 345,
                        stack: [
                          {
                            columns: [
                              {text: 'Date et lieu de naissance: ', style: 'labelStyle', width: 150},
                              {
                                text: moment(bulletinAll.inscription?.etudiant?.dateNaissance).format('DD/MM/YYYY') + ' ' +
                                  bulletinAll.inscription?.etudiant?.lieuNaissance,
                                fontSize: 10, width: 195
                              },
                            ]
                          },
                          {
                            columns: [
                              {text: 'Pays: ', style: 'labelStyle', width: 50},
                              {
                                text: bulletinAll.inscription?.etudiant?.pays?.libelle.toUpperCase(),
                                fontSize: 10,
                                width: 200
                              },
                            ]
                          },
                          {
                            columns: [
                              {text: 'Sexe: ', style: 'labelStyle', width: 50},
                              {text: bulletinAll.inscription?.etudiant?.genre.toUpperCase(), fontSize: 10, width: 200},
                            ]
                          }
                        ],
                      }
                    ]
                  }
                ]
              ]
            }
          },
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 2,
              widths: [100, 144, 30, 30, 30, 30, 30, 30, 30, 30],

              body: this.getTableRowsForBulletin(bulletinAll.recapListNoteProgrammeModuleByProgrammeUe,
                bulletinAll.sommeCoef, bulletinAll.sommeMoyenneUE, bulletinAll.sommeCreditUE, bulletinAll.sommeMCR)
            }
          },
          {
            margin: [0, 5, 0, 0],
            table: {
              body: [
                [
                  {
                    text: ' MDS:Moyenne Devoirs Surveillés, NEF:Note de l\'Examen Final, MUE:Moyenne Unite d\'Enseignement, NCR:Nombre de Credit, MCR:Moyenne Credité, VAL:Validation, V:Validé, NV:Non Validé, VSR:ValidéSession de Remplacement',
                    fontSize: 7
                  }
                ],
                [
                  {
                    text: this.addLegende(bulletinAll.recapListNoteProgrammeModuleByProgrammeUe),
                    fontSize: 7
                  }
                ]
              ]
            }
          },
          {
            columns: [
              {
                width: '50%',
                margin: [0, 15, 0, 0],
                style: 'moyenneG',
                text: 'Moyenne General : ' + this.formatNumber(bulletinAll.moyenneGeneral)
              },
              {
                width: '50%',
                margin: [0, 15, 0, 0],
                style: 'moyenneG',
                text: 'Appréciation : Passable'
              }
            ]
          },
          {
            margin: [0, 20, 0, 0],
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [100, 100, 100],

              body: this.getBulletinRecapTablePdf(bulletinAll.bulletinRecaps, bulletinAll.inscription)
            }
          },
          {
            columns: [
              {
                width: '50%',
                margin: [0, 15, 0, 0],
                fontSize: 11,
                bold: true,
                text: 'Decision du Conseil: Admis'
              },
              {
                width: '50%',
                margin: [0, 15, 0, 0],
                stack: [
                  {
                    fontSize: 11,
                    bold: true,
                    decoration: 'underline',
                    color: '#000000',
                    alignment: 'center',
                    text: 'Le Directeur des Etudes'
                  },
                  {
                    text: 'Nom du Directeur',
                    fontSize: 11,
                    alignment: 'center',
                  }
                ]
              }
            ],
            pageBreak: cpt < this.bulletinAllClasse.length ? 'after' : ''
          }
        ]);
      });
    }
    return content;
  }

  async generateAllBulletin() {
    const logo = await this.getImageFromAssets('/assets/images/bulletin/header.png');
    const footer = await this.getImageFromAssets('/assets/images/bulletin/footer.png');
    console.log(logo);
    return {
      header: {
        columns: [
          {
            margin: [0, 0, 0, 0],
            image: 'mylogo', width: 600, height: 80
          }
        ],
      },
      footer: {
        columns: [
          {
            margin: [0, 0, 0, 0],
            image: 'footerImg', width: 600, height: 60
          }
        ],
      },
      content: this.getAllBulletinContent(),
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#b80d0d'
        },
        subtitle: {
          fontSize: 11,
          bold: true,
          color: '#b80d0d'
        },
        bulletinNote: {
          fontSize: 14,
          color: '#000000',
          decoration: 'underline',
          background: '#afaeae'
        },
        labelStyle: {
          fontSize: 12,
          color: '#000000',
          bold: true
        },
        tableHeader: {
          fontSize: 10,
          color: '#000000',
          bold: true,
          alignment: 'center'
        },
        tableData: {
          fontSize: 9,
          color: '#000000',
          alignment: 'center'
        },
        tableUE: {
          fontSize: 10,
          color: '#000000'
        },
        tableModule: {
          fontSize: 10,
          color: '#000000'
        },
        moyenneG: {
          fontSize: 12,
          bold: true,
          color: '#000000'
        }
      },
      images: {
        mylogo: logo,
        footerImg: footer,
      },
      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [10, 80, 10, 60]
    };
  }

  async displayBulletin() {
    const docDef = await this.generateBulletin();
    pdfMake.createPdf(docDef).open();
  }

  secureUlr(url) {
    return this.url ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
      : this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  async getImageFromAssets(url) {
    const logoResponse = await this.toDataURL(url);

    return await this.toBase64(logoResponse) + '';
  }

  async toDataURL(url) {
    return await this.http.get(url, {responseType: 'blob'}).toPromise();
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

  buildTableBody(data, columns) {
    const body = [];

    body.push(columns);

    data.forEach((row) => {
      const dataRow = [];

      columns.forEach((column) => {
        dataRow.push(row[column].toString());
      });

      body.push(dataRow);
    });

    return body;
  }

  table(data, columns) {
    return {
      table: {
        headerRows: 1,
        body: this.buildTableBody(data, columns)
      }
    };
  }

  onGenerateAllBulletin() {
    this.subscription.push(
      this.noteService.onGenerateAllBulletin.subscribe(
        (data) => {
          if (data && data.bulletinAllClasse && data.bulletinAllClasse.length) {
            console.log(data);
            this.bulletinAllClasse = data.bulletinAllClasse;
            this.classeSousClasse = data.classe;
            if (this.bulletinAllClasse && this.bulletinAllClasse.length > 0) {
              this.downloadAllBulletin().then(result => {
                console.log('generation ok');
              }).catch(error => console.log(error));
            }
          }
        }, (error) => console.log(error),
        () => {

        }
      )
    );
  }

}
