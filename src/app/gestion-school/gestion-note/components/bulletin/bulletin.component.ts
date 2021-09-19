import {Component, Input, OnInit} from '@angular/core';
import {RecapNoteProgrammeModuleByProgrammeUeModel} from '../../../../shared/models/recap-note-programme-module-by-programme-ue.model';
import {InscriptionModel} from '../../../../shared/models/inscription.model';
import {BulletinRecapModel} from '../../../../shared/models/bulletin-recap.model';
import {DomSanitizer} from '@angular/platform-browser';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

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

  url = '';

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  async getContent() {}
  generateBulletin() {
    return {
      header: {
        margin: [100, 15, 20, 20],
        table:
          {
            widths: ['100%'],
            body: [
              [
                {
                  text: 'ECOLE 221'
                }
              ]
            ]
          },
        layout: 'noBorders'
      }
    };
  }

  printBulletin() {
    pdfMake.createPdf(this.generateBulletin()).print();
  }

  downloadBulletin() {
    pdfMake.createPdf(this.generateBulletin()).download();
  }

  displayBulletin() {
    pdfMake.createPdf(this.generateBulletin()).open();
  }

  secureUlr(url) {
    return this.url ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
      : this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

}
