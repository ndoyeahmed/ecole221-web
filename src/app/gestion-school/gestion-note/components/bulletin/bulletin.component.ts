import {Component, Input, OnInit} from '@angular/core';
import {RecapNoteProgrammeModuleByProgrammeUeModel} from '../../../../shared/models/recap-note-programme-module-by-programme-ue.model';
import {InscriptionModel} from '../../../../shared/models/inscription.model';
import {BulletinRecapModel} from '../../../../shared/models/bulletin-recap.model';
import {DomSanitizer} from '@angular/platform-browser';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {HttpClient} from '@angular/common/http';
import {log} from 'util';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


/// <reference path ="../../node_modules/@types/jquery/index.d.ts"/>
declare var $: any;

@Component({
  selector: 'app-bulletin',
  templateUrl: './bulletin.component.html',
  styleUrls: ['./bulletin.component.css']
})
export class BulletinComponent implements OnInit {
  @Input() listRecapNoteProgrammeModule: RecapNoteProgrammeModuleByProgrammeUeModel[];
  @Input() bulletinRecapModels: BulletinRecapModel[];
  @Input() inscription: InscriptionModel;
  @Input() moyenneGenerale: number;
  // @Input() classe: ClasseModel;
  @Input() sommeCredit: number;
  @Input() sommeMoyenneUE: number;
  @Input() sommeMCR: number;
  @Input() sommeCoef: number;

  url = '';

  constructor(private sanitizer: DomSanitizer,
              private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  async getContent() {
  }

  async generateBulletin() {
    const logo = await this.getImageFromAssets('/assets/images/forslide.png');
    console.log(logo);
    return {
      header: {
        columns: [
          {
            margin: [150, 5, 0, 0],
            image: 'mylogo', width: 50
          },
          {
            layout: 'noBorders', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ['*'],

              body: [
                [
                  {text: 'ECOLE SUPERIEUR 221', style: 'header', alignment: 'center', margin: [0, 15, 0, 0]}
                ],
                [
                  {text: 'Future is now!', style: 'subtitle', alignment: 'center'}
                ]
              ]
            }
          }
        ],
      },
      content: [
        {text: 'BULLETIN DES NOTE 2020-2021', style: 'bulletinNote', alignment: 'center', margin: [0, 10, 0, 15]},
        {
          columns: [
            {
              width: '50%',
              stack: [
                {
                  columns: [
                    {text: 'Domaine: ', style: 'labelStyle', width: '20%'},
                    {text: ' SCIENCES ET TECHNOLOGIES', fontSize: 10, width: '80%'},
                  ]
                },
                {
                  columns: [
                    {text: 'Spécialité: ', style: 'labelStyle', width: '20%'},
                    {text: 'GENIE LOGICIEL', fontSize: 10, width: '80%'},
                  ]
                },
                {
                  columns: [
                    {text: 'Classe: ', style: 'labelStyle', width: '20%'},
                    {text: 'L1 GL', fontSize: 10, width: '80%'},
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
                    {text: 'INFORMATIQUE', fontSize: 10, width: '80%'},
                  ]
                },
                {
                  columns: [
                    {text: 'Grade: ', style: 'labelStyle', width: '20%'},
                    {text: 'LICENCE', fontSize: 10, width: '80%'},
                  ]
                },
                {
                  columns: [
                    {text: 'Semestre: ', style: 'labelStyle', width: '20%'},
                    {text: '2', fontSize: 10, width: '80%'},
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
                      width: 200,
                      stack: [
                        {
                          columns: [
                            {text: 'Matricule: ', style: 'labelStyle', width: 50},
                            {text: '01 16 002615', fontSize: 10, width: 100},
                          ]
                        },
                        {
                          columns: [
                            {text: 'Nom: ', style: 'labelStyle', width: 50},
                            {text: 'AKHYAR', fontSize: 10, width: 100},
                          ]
                        },
                        {
                          columns: [
                            {text: 'Prénom: ', style: 'labelStyle', width: 50},
                            {text: 'MOUSSA OUMRAN', fontSize: 10, width: 150},
                          ]
                        }
                      ],
                    },
                    {
                      width: 300,
                      stack: [
                        {
                          columns: [
                            {text: 'Date et lieu de naissance: ', style: 'labelStyle', width: 120},
                            {text: '10/10/1996 à NOUAKCHOTT', fontSize: 10, width: 150},
                          ]
                        },
                        {
                          columns: [
                            {text: 'Pays: ', style: 'labelStyle', width: 50},
                            {text: 'MAURITANIE', fontSize: 10, width: 200},
                          ]
                        },
                        {
                          columns: [
                            {text: 'Sexe: ', style: 'labelStyle', width: 50},
                            {text: 'M', fontSize: 10, width: 200},
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
            widths: [ 100, 120, 25, 25, 25, 25, 25, 25, 25, 25 ],

            body: this.getTableRowsForBulletin()
          }
        },
        {
          margin: [0, 5, 0, 0],
          table: {
            body: [
              [
                {
                  text: ' MDS:Moyenne Devoirs Surveillés, NEF:Note de l\'Examen Final, MUE:Moyenne Unite d\'Enseignement, NCR:Nombre de Credit, MCR:Moyenne Credité, VAL:Validation, V:Validé, NV:Non Validé, VSR:ValidéSession de Remplacement',
                  fontSize: 5
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
              text: 'Moyenne General : ' + this.moyenneGenerale
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
            widths: [ 100, 100, 100 ],

            body: this.getBulletinRecapTablePdf()
          }
        },
        {
          columns: [
            {
              width: '50%',
              margin: [0, 15, 0, 0],
              fontSize: 9,
              bold: true,
              text: 'Decision du Conseil: Admis'
            },
            {
              width: '50%',
              margin: [0, 15, 0, 0],
              stack: [
                {
                  fontSize: 10,
                  bold: true,
                  decoration: 'underline',
                  color: '#000000',
                  alignment: 'center',
                  text: 'Le Directeur des Etudes'
                },
                {
                  text: 'Nom du Directeur',
                  fontSize: 10,
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
          fontSize: 10,
          color: '#000000',
          bold: true
        },
        tableHeader: {
          fontSize: 8,
          color: '#000000',
          bold: true,
          alignment: 'center'
        },
        tableData: {
          fontSize: 8,
          color: '#000000',
          alignment: 'center'
        },
        tableUE: {
          fontSize: 9,
          color: '#000000'
        },
        tableModule: {
          fontSize: 8,
          color: '#000000'
        },
        moyenneG: {
          fontSize: 10,
          bold: true,
          color: '#000000'
        }
      },
      images: {
        mylogo: logo
      },
      pageMargins: [40, 80, 40, 60]
    };
  }

  getBulletinRecapTablePdf() {
    const body = [];
    const headers = [
      {text: 'Semestre', style: 'tableHeader'},
      {text: 'Nombre Crédit', style: 'tableHeader'},
      {text: 'Statut', style: 'tableHeader'},
    ];
    body.push(headers);
    this.bulletinRecapModels.forEach(bulletinRecap => {
      const col = [
        {text: bulletinRecap ? bulletinRecap.semestre ? bulletinRecap.semestre.libelle : '' : '', style: 'tableData'},
        {text: bulletinRecap ? bulletinRecap.totalCredit ? (bulletinRecap.totalCredit === 0 ? '--' : bulletinRecap.totalCredit) : '--' : '--', style: 'tableData'},
        {text: bulletinRecap ? bulletinRecap.valide ?
            (bulletinRecap.totalCredit === 0 ? '--' : 'Validé') :
            (bulletinRecap.totalCredit === 0 ? '--' : 'Non Validé') : '--', style: 'tableData'},
      ];
      body.push(col);
    });

    return body;
  }

  getTableRowsForBulletin() {
    const body = [];
    const headers1 = [ {text: 'Unités d\'enseignement', style: 'tableHeader', rowSpan: 2},
      {text: 'Elements Constitutifs', style: 'tableHeader', colSpan: 5}, {}, {}, {}, {},
      {text: 'MU.E', style: 'tableHeader', rowSpan: 2},
      {text: 'Crédits', style: 'tableHeader', colSpan: 3}, {}, {}
    ];
    const headers2 = [ {},
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
    this.listRecapNoteProgrammeModule.forEach(data => {
      const col = [
        {text: data.programmeUE.ue.libelle, style: 'tableUE',
          rowSpan: data.noteProgrammeModules.length},
        {text: data.noteProgrammeModules[0].programmeModule.module.libelle, style: 'tableModule'},
        {text: data.noteProgrammeModules[0].note.mds, style: 'tableData'},
        {text: data.noteProgrammeModules[0].note.nef, style: 'tableData'},
        {text: (data.noteProgrammeModules[0].note.nef), style: 'tableData'},
        {text: data.noteProgrammeModules[0].programmeModule.coef, style: 'tableData'},
        {text: data.moyenneUE, style: 'tableData', rowSpan: data.noteProgrammeModules.length},
        {text: data.programmeUE.credit, style: 'tableData', rowSpan: data.noteProgrammeModules.length},
        {text: (data.moyenneUE * data.programmeUE.credit), style: 'tableData', rowSpan: data.noteProgrammeModules.length},
        {text: data.moyenneUE >= 10 ? 'V' : 'NV', style: 'tableData', rowSpan: data.noteProgrammeModules.length},
      ];
      body.push(col);
      data.noteProgrammeModules.forEach(noteProgrammeModule => {
        if (data.noteProgrammeModules.indexOf(noteProgrammeModule) !== 0) {
          const col2 = [
            {},
            {text: noteProgrammeModule.programmeModule.module.libelle, style: 'tableModule'},
            {text: noteProgrammeModule.note.mds, style: 'tableData'},
            {text: noteProgrammeModule.note.nef, style: 'tableData'},
            {text: '12.67', style: 'tableData'},
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
      {text: this.sommeCoef, style: 'tableData'},
      {text: this.sommeMoyenneUE, style: 'tableData'},
      {text: this.sommeCredit, style: 'tableData'},
      {text: this.sommeMCR, style: 'tableData'},
      {},
    ];

    body.push(col3);

    return body;
  }

  getMoyDevoir(mds, nef) {

  }

  async printBulletin() {
    const docDef = await this.generateBulletin();
    pdfMake.createPdf(docDef).print();
  }

  async downloadBulletin() {
    const docDef = await this.generateBulletin();
    pdfMake.createPdf(docDef).download();
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

}
