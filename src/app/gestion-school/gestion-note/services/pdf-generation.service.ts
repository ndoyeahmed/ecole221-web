import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BulletinAllModel } from 'src/app/shared/models/bulletin-all.model';
import { SemestreNiveauModel } from 'src/app/shared/models/semestre-niveau.model';

@Injectable({
  providedIn: 'root'
})
export class PdfGenerationService {

  constructor(
    private http: HttpClient
  ) { }

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

  async getImageFromAssets(url) {
    const logoResponse = await this.toDataURL(url);

    return await this.toBase64(logoResponse) + '';
  }

  async generateStats(bulletinAllClasse: BulletinAllModel[], semestModel: SemestreNiveauModel) {
    const logo = await this.getImageFromAssets('/assets/images/bulletin/header.png');
    const footer = await this.getImageFromAssets('/assets/images/bulletin/footer.png');


    return {
      header: {
        columns: [
          {
            margin: [0, 0, 0, 0],
            image: 'mylogo', width: 850, height: 50
          }
        ],
      },
      // footer: {
      //   columns: [
      //     {
      //       margin: [0, 0, 0, 0],
      //       image: 'footerImg', width: 850, height: 50
      //     }
      //   ],
      // },
      content: [
        {
          text: 'FICHE DE Deliberation '.toUpperCase(),
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
                      text: bulletinAllClasse[0].inscription.sousClasse.specialite.mention.domaine.libelle,
                      fontSize: 10, width: '80%'
                    },
                  ]
                },
                {
                  columns: [
                    {text: 'Spécialité: ', style: 'labelStyle', width: '20%'},
                    {
                      text: bulletinAllClasse[0].inscription.sousClasse.specialite.libelle,
                      fontSize: 10, width: '80%'
                    },
                  ]
                },
                {
                  columns: [
                    {text: 'Classe: ', style: 'labelStyle', width: '20%'},
                    {
                      text: bulletinAllClasse[0].inscription.sousClasse.libelle,
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
                      text: bulletinAllClasse[0].inscription.sousClasse.specialite.mention.libelle,
                      fontSize: 10, width: '80%'
                    },
                  ]
                },
                {
                  columns: [
                    {text: 'Parcours: ', style: 'labelStyle', width: '20%'},
                    {
                      text: bulletinAllClasse[0].inscription.sousClasse.niveau.parcours.libelle,
                      fontSize: 10, width: '80%'
                    },
                  ]
                },
                {
                  columns: [
                    {text: 'Semestre: ', style: 'labelStyle', width: '20%'},
                    {text: semestModel?.semestre?.libelle, fontSize: 10, width: '80%'},
                  ]
                }
              ],
            }
          ]
        },
        {
          margin: [0, 5, 0, 5],
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 2,
            // widths: ['*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*'],

            body: await this.getTableRowsForBulletin(bulletinAllClasse)
          }
        },
        {
          margin: [0, 5, 0, 5],
          text: this.addLegende(bulletinAllClasse[0].recapListNoteProgrammeModuleByProgrammeUe, 'ue'),
          fontSize: 8
        },
        {
          margin: [0, 5, 0, 5],
          text: this.addLegende(bulletinAllClasse[0].recapListNoteProgrammeModuleByProgrammeUe, 'module'),
          fontSize: 8
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
      pageMargins: [10, 50, 10, 0],
      pageSize: 'A4',
      pageOrientation: 'landscape',
    };
  }

  addLegende(listRecapNoteProgrammeModule, type) {
    let legende = '';
    if(type == 'ue') {
      listRecapNoteProgrammeModule.forEach(data => {
        legende = legende + data.programmeUE.code + ' : ' + data.programmeUE.ue.libelle + ', ';
      });
    } else {
      listRecapNoteProgrammeModule.forEach(data => {
        data.noteProgrammeModules.forEach(note => {
          legende = legende + note.programmeModule.module.code + ' : ' + note.programmeModule.module.libelle + ', ';
        });
      });
    }

    return legende;
  }

  getMoyenneClasseForModule(programmeModuleId: number, bulletinAllClasse: BulletinAllModel[]) {
    let somme = 0;
    bulletinAllClasse.forEach(blModel => {
      blModel.recapListNoteProgrammeModuleByProgrammeUe.forEach(recap => {
        recap.noteProgrammeModules.forEach(note => {
          if (note.programmeModule.id == programmeModuleId) {
            somme = somme + ((note.note.mds + note.note.nef)/2);
          }
        })
      })
    });

    return somme/bulletinAllClasse.length;
  }

  getMoyenneProgrammeUe(bulletinAllClasse: BulletinAllModel[], programmeUeId: number) {
    let sommeMoyUe = 0;
    let moy = 0;
    let moyGen = 0;
    bulletinAllClasse.forEach(blModel => {
      let sommeAll = 0;
      blModel.recapListNoteProgrammeModuleByProgrammeUe.forEach(recapPUE => {
        if (programmeUeId == recapPUE.programmeUE.id) {
          let somme = 0;
        recapPUE.noteProgrammeModules.forEach(notePM => {
          somme = somme + (notePM.note.mds+notePM.note.nef)/2;
        });
        sommeAll = sommeAll + somme/recapPUE.noteProgrammeModules.length;
      }
      });
      moy = sommeAll/blModel.recapListNoteProgrammeModuleByProgrammeUe.length;
      sommeMoyUe = sommeMoyUe + sommeAll/blModel.recapListNoteProgrammeModuleByProgrammeUe.length;
    });
    moyGen = sommeMoyUe/bulletinAllClasse.length;

    return moy;
  }

  async getTableRowsForBulletin(bulletinAllClasse: BulletinAllModel[]) {
  // getTableRowsForBulletin(listRecapNoteProgrammeModule, sommeCoef, sommeMoyenneUE, sommeCredit, sommeMCR) {
    const body = [];
    const headers1 = [
      {text: '', style: 'tableHeader', colSpan: 2}, {}
    ];
    //console.log(JSON.parse(this.bulletinModel));
    for (const recapPUE of bulletinAllClasse[0].recapListNoteProgrammeModuleByProgrammeUe) {
      headers1.push({text: 'UE: ' + recapPUE.programmeUE.ue.code, style: 'tableHeader', colSpan: recapPUE.noteProgrammeModules.length+1});
        for (let index = 0; index < recapPUE.noteProgrammeModules.length; index++) {
          headers1.push({});
        }
    }

    headers1.push({text: 'Moy Ge', style: 'tableHeader', colSpan: 1});

    const headers2 = [
      {text: 'Nom', style: 'tableHeader'},
      {text: 'Prenom', style: 'tableHeader'}
    ];

    for (const recapPUE of bulletinAllClasse[0].recapListNoteProgrammeModuleByProgrammeUe) {
      recapPUE.noteProgrammeModules.forEach(notePM => {
        headers2.push({text: notePM.programmeModule.module.code, style: 'tableHeader'});
      });
      headers2.push({text: 'Moy', style: 'tableHeader'});
    }
    headers2.push({text: '', style: 'tableHeader'});
    body.push(headers1);
    body.push(headers2);


    bulletinAllClasse.forEach(blModel => {
      const col = [];
      let sommeAll = 0;
      col.push({text: blModel.inscription.etudiant.nom, style: 'tableHeader'});
      col.push({text: blModel.inscription.etudiant.prenom, style: 'tableHeader'});
      blModel.recapListNoteProgrammeModuleByProgrammeUe.forEach(recapPUE => {
        let somme = 0;
        recapPUE.noteProgrammeModules.forEach(notePM => {
          somme = somme + (notePM.note.mds+notePM.note.nef)/2;
          col.push({text: this.formatNumber((notePM.note.mds+notePM.note.nef)/2), style: 'tableHeader'});
        });
        sommeAll = sommeAll + somme/recapPUE.noteProgrammeModules.length;
        col.push({text: this.formatNumber(somme/recapPUE.noteProgrammeModules.length), style: 'tableHeader'});
      });
      col.push({text: this.formatNumber(sommeAll/blModel.recapListNoteProgrammeModuleByProgrammeUe.length), style: 'tableHeader'});
      body.push(col);
    });

    // ------------ moyenne general par matiere ----------------
    const mg = [
      {text: 'MOYENNE CLASSE', style: 'tableHeader', colSpan: 2}, {}
    ];
    let s1 = 0;
    for (const recapPUE of bulletinAllClasse[0].recapListNoteProgrammeModuleByProgrammeUe) {
      let s = 0;
      recapPUE.noteProgrammeModules.forEach(notePM => {
        let moy = this.getMoyenneClasseForModule(notePM.programmeModule.id, bulletinAllClasse);
        s = s + moy;
        mg.push({text: this.formatNumber(moy), style: 'tableHeader', colSpan: 1});
      });
      let m = s/recapPUE.noteProgrammeModules.length;
      s1 = s1 + m;
      mg.push({text: this.formatNumber(m), style: 'tableHeader', colSpan: 1});
    }
    mg.push({text: this.formatNumber(s1/bulletinAllClasse[0].recapListNoteProgrammeModuleByProgrammeUe.length), style: 'tableHeader', colSpan: 1});
    body.push(mg);

    // ----------set footer----------
    const footer = [
      {text: '', style: 'tableHeader', colSpan: 2}, {}
    ];

    for (const recapPUE of bulletinAllClasse[0].recapListNoteProgrammeModuleByProgrammeUe) {
      recapPUE.noteProgrammeModules.forEach(notePM => {
        footer.push({text: notePM.programmeModule.module.code, style: 'tableHeader', colSpan: 1});
      });
      footer.push({text: 'Moy', style: 'tableHeader', colSpan: 1});
    }
    footer.push({text: '', style: 'tableHeader', colSpan: 1});
    body.push(footer);

   // console.log(body);

    return body;
  }

  formatNumber(num, numberDigits = 1) {
    return (Math.round(num * 100) / 100).toFixed(numberDigits);
  }
}
