import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { MycustomNotificationService } from 'src/app/gestion-school/parametrage/services/mycustom-notification.service';
import { ParametragesBaseService } from 'src/app/gestion-school/parametrage/services/parametrages-base.service';
import { EtudiantModel } from 'src/app/shared/models/etudiant.model';
import { InscriptionPojoModel } from 'src/app/shared/models/inscription-pojo.model';
import { PaysModel } from 'src/app/shared/models/pays.model';
import { InscriptionService } from '../../services/inscription.service';

@Component({
  selector: 'app-etudiant-edit',
  templateUrl: './etudiant-edit.component.html',
  styleUrls: ['./etudiant-edit.component.css']
})
export class EtudiantEditComponent implements OnInit, OnDestroy {

  subscription = [] as Subscription[];
  LOADERID = 'edit-etudiant-loader';

  etudiantCin: string;
  listPays = [] as PaysModel[];
  paysModel: PaysModel;
  etudiantModel = new EtudiantModel();
  inscriptionPOJOModel = new InscriptionPojoModel();

  constructor(
    private notif: MycustomNotificationService,
    private route: ActivatedRoute,
    private ngxService: NgxSpinnerService,
     private paramBaseService: ParametragesBaseService,
     private inscriptionService: InscriptionService
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.loadListPays();
    this.etudiantModel.cin = this.route.snapshot.paramMap.get('etudiantId');
    this.etudiantCin = this.etudiantModel.cin;
    this.onCheckEtudiantExist();
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

  onCheckEtudiantExist() {
    const cin = this.etudiantModel.cin;
    this.subscription.push(
      this.inscriptionService.getInscriptionByCinEtudiant(this.etudiantModel.cin).subscribe(
        (data) => {
          if (data) {
            this.etudiantModel = data as EtudiantModel;
            // console.log(data);
          } else {
            this.etudiantModel = new EtudiantModel();
            this.etudiantModel.cin = cin;
          }
          this.inscriptionPOJOModel.etudiant = this.etudiantModel;
          this.paysModel = this.etudiantModel.pays;
        }, (error) => {
          this.notif.error('Erreur de chargement des données');
        }
      )
    );
  }

  editEtudiant(_t16: NgForm) {
    this.subscription.push(
      this.inscriptionService.editEtudiant(this.etudiantCin, this.etudiantModel).subscribe(
        (data) => {
          // console.log(data);
        }, (error) => {
          this.notif.error();
          this.ngxService.hide(this.LOADERID);
        }, () => {
          _t16.resetForm();
          this.clear();
          this.notif.success();
          this.ngxService.hide(this.LOADERID);
        }
      )
    );
  }

  clear() {
    this.etudiantModel = new EtudiantModel();
    this.paysModel = new PaysModel();
    this.inscriptionPOJOModel = new InscriptionPojoModel();
  }

}
