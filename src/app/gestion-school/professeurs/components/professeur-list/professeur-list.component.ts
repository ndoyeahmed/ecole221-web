import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from "@angular/material/dialog";
import {MycustomNotificationService} from "../../../parametrage/services/mycustom-notification.service";
import {ProfesseurService} from "../../services/professeur.service";
import {ProfesseurModel} from "../../../../shared/models/professeur.model";
import {ProfesseurModuleModel} from "../../../../shared/models/professeur-module.model";
import * as moment from 'moment';
import {DeleteDialogComponent} from "../../../parametrage/components/delete-dialog/delete-dialog.component";
import {Router} from "@angular/router";

/// <reference path ="../../node_modules/@types/jquery/index.d.ts"/>
declare var $: any;

@Component({
  selector: 'app-professeur-list',
  templateUrl: './professeur-list.component.html',
  styleUrls: ['./professeur-list.component.css']
})
export class ProfesseurListComponent implements OnInit, OnDestroy {

  title = 'Professeur';

  subscription = [] as Subscription[];
  LOADERID = 'prof-loader';
  dialogRef: any;
  dataSource: MatTableDataSource<ProfesseurModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  profColumnsToDisplay = ['nom', 'email', 'telephone', 'autres', 'modules', 'actions'];
  professeurs: ProfesseurModel[];
  prof = new ProfesseurModel();

  professeurModules = [] as ProfesseurModuleModel[];
  diplomes = [];
  specialites = [];
  modalContent = 'modules';

  constructor(
    private dialog: MatDialog, private profService: ProfesseurService,
    private notif: MycustomNotificationService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.subscription.forEach(x => x.unsubscribe());
  }

  ngOnInit(): void {
    this.professeurList();
  }

  professeurList() {
    this.subscription.push(
      this.profService.professeurList().subscribe(
        (data) => {
          this.professeurs = data;
          this.dataSource = new MatTableDataSource<ProfesseurModel>(this.professeurs);
          this.dataSource.paginator = this.paginator;
        }, (error) => console.log(error)
      )
    );
  }

  onShowOtherDetails(prof, modalContent) {
    this.prof = prof;
    this.modalContent = modalContent;
    if (this.modalContent === 'details') {
      this.diplomes = JSON.parse(prof.diplome);
      this.specialites = JSON.parse(prof.specialite);
      $('#showModal').modal('show');
    } else {
      this.getProfesseurModuleByProfesseurId(prof.id);
    }
  }

  onEdit(prof) {
    this.router.navigate(['/gestion-school/professeur/edit/' + prof.id]);
  }

  openDialog(prof) {
    this.dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '20%',
      data: prof
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result.rep === true) {
        this.archiveProf(result.item.id);
      }
    });
  }

  archiveProf(professeurId) {
    this.subscription.push(
      this.profService.archiveProfesseur(professeurId).subscribe(
        (data) => {
        }, (error) => {
          console.log(error);
          this.notif.error();
        }, () => {
          this.notif.success();
          this.professeurList();
        }
      )
    );
  }

  getFormatedDate(date): string {
    return moment(date).format('DD/MM/YYYY');
  }

  getProfesseurModuleByProfesseurId(professeurId) {
    this.subscription.push(
      this.profService.professeurModuleListByProfesseur(professeurId).subscribe(
        (data) => {
          console.log(data);
          this.professeurModules = data;
        }, (error) => console.log(error),
        () => {
          if (this.professeurModules && this.professeurModules.length > 0) {
            $('#showModal').modal('show');
          } else {
            this.notif.info('Il n\'y a pas de modules associés à ce professeur');
          }
        }
      )
    );
  }
}
