import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {ProfesseurService} from '../../services/professeur.service';
import {MycustomNotificationService} from '../../../parametrage/services/mycustom-notification.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormControl} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import {MatChipInputEvent} from '@angular/material/chips';
import {ParametrageModuleUeService} from "../../../parametrage/services/parametrage-module-ue.service";
import {ModuleModel} from "../../../../shared/models/module.model";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {ProfesseurModel} from "../../../../shared/models/professeur.model";
import {TypeContratModel} from "../../../../shared/models/type-contrat.model";
import {ContratModel} from "../../../../shared/models/contrat.model";
import * as moment from 'moment';
import {ProfesseurModuleModel} from "../../../../shared/models/professeur-module.model";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-professeur-add',
  templateUrl: './professeur-add.component.html',
  styleUrls: ['./professeur-add.component.css']
})
export class ProfesseurAddComponent implements OnInit, OnDestroy {

  // input chips specialite config
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  specialiteCtrl = new FormControl();
  filteredSpecialite: Observable<string[]>;
  specialites: string[] = [];
  allSpecialites: string[] = ['JAVA', 'PHP', 'JavaScript', 'Angular', 'Marketing'];
  @ViewChild('specialiteInput') specialiteInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('autoDiplome') matAutocompleteDiplome: MatAutocomplete;
  // end input chips config

  // input chips diplome config
  selectableDiplome = true;
  removableDiplome = true;
  diplomeCtrl = new FormControl();
  filteredDiplome: Observable<string[]>;
  diplomes: string[] = [];
  allDiplome: string[] = [];
  @ViewChild('diplomeInput') diplomeInput: ElementRef<HTMLInputElement>;
  // end input chips config

  title = 'Professeurs';
  subscription = [] as Subscription[];
  LOADERID = 'prof-loader';

  moduleList: ModuleModel[];
  moduleListCustome = [];
  selectedModuleList = [] as ModuleModel[];

  professeurModel = new ProfesseurModel();
  @ViewChild('cvfile') cvfile: ElementRef;

  cvFileType = '';
  cvFileName = '';
  contratFileType = '';
  contratFileName = '';

  listTypeContrat = [] as TypeContratModel[];
  typeContrat: TypeContratModel;
  contrat = new ContratModel();

  listProfesseurModule: ProfesseurModuleModel[];

  professeurEditId: number;

  constructor(
    private profService: ProfesseurService, private paramModuleService: ParametrageModuleUeService,
    private notif: MycustomNotificationService, private ngxService: NgxSpinnerService,
    private route: ActivatedRoute
  ) {
    this.filteredSpecialite = this.specialiteCtrl.valueChanges.pipe(
      startWith(null),
      map((specialite: string | null) => specialite ? this._filter(specialite) : this.allSpecialites.slice()));

    this.filteredDiplome = this.diplomeCtrl.valueChanges.pipe(
      startWith(null),
      map((diplome: string | null) => diplome ? this._filterDiplome(diplome) : this.allDiplome.slice()));
  }

  ngOnInit(): void {
    this.getAllModules();
    this.getAllTypeContrat();
    this.professeurEditId =  Number(this.route.snapshot.paramMap.get('id'));
    if (this.professeurEditId) {
      this.getProfesseurById(this.professeurEditId);
      this.getContratByProfesseurId(this.professeurEditId);
      this.getProfesseurModuleByProfesseurId(this.professeurEditId);
    }
  }

  ngOnDestroy() {
    this.subscription.forEach(s => s.unsubscribe());
  }

  getProfesseurById(professeurId) {
    this.subscription.push(
      this.profService.getProfesseurById(professeurId).subscribe(
        (data) => {
          this.professeurModel = data;
          this.diplomes = JSON.parse(this.professeurModel.diplome);
          this.specialites = JSON.parse(this.professeurModel.specialite);
        }, (error) => {
          console.log(error);
          this.notif.error('Echec chargement des données du professeur');
        }
      )
    );
  }

  getContratByProfesseurId(professeurId) {
    this.subscription.push(
      this.profService.getContratByProfesseurId(professeurId).subscribe(
        (data) => {
          if (data) {
            this.contrat = data;
          } else {
            this.notif.info('Aucun contrat en cours associé à ce professeur');
          }
        }, (error) => {
          console.log(error);
          this.notif.error('Echec chargement des données du contrat');
        }
      )
    );
  }

  getProfesseurModuleByProfesseurId(professeurId) {
    this.subscription.push(
      this.profService.professeurModuleListByProfesseur(professeurId).subscribe(
        (data) => {
          console.log(data);
          this.listProfesseurModule = data;
        }, (error) => console.log(error),
        () => {
          if (!this.listProfesseurModule || this.listProfesseurModule.length <= 0) {
            this.notif.info('Il n\'y a pas de modules associés à ce professeur');
          } else {
            this.selectedModuleList = [];
            this.listProfesseurModule.forEach(pm => {
              this.selectedModuleList.push(pm.module);
              this.moduleListCustome.forEach(mc => {
                if (Number(mc.module.id) === Number(pm.module.id)) {
                  mc.checked = true;
                }
              });
            });
          }
        }
      )
    );
  }

  checkModuleExist(module) {
    if (this.selectedModuleList && this.selectedModuleList.length > 0) {
      this.selectedModuleList.forEach(m => {
        if (Number(m.id) === Number(module.id)) {
          return true;
        }
      });
    }
    return false;
  }

  addProfesseurModuleList(professeur) {
    this.listProfesseurModule = [];
    if (this.selectedModuleList && this.selectedModuleList.length > 0) {
      this.selectedModuleList.forEach(m => {
        const profModule = new ProfesseurModuleModel();
        profModule.module = m;
        profModule.professeur = professeur;

        this.listProfesseurModule.push(profModule);
      });

      this.subscription.push(
        this.profService.addProfesseurModuleList(this.listProfesseurModule)
          .subscribe(
            (data) => {
            }, (error) => {
              this.notif.error('Echec de l\'ajout des modules du professeurs');
            }, () => {
              this.notif.success('Modules du professeur ajoutés avec succès');
            }
          )
      );
    }
  }

  addProf() {
    if (this.diplomes.length > 0) {
      this.professeurModel.diplome = JSON.stringify(this.diplomes);
    }
    if (this.specialites.length > 0) {
      this.professeurModel.specialite = JSON.stringify(this.specialites);
    }

    this.professeurModel.dateNaissance = moment(this.professeurModel.dateNaissance, 'MM-DD-YYYY Z').valueOf();

    this.subscription.push(
      this.profService.addProfesseur(this.professeurModel,
        this.cvFileName, this.cvFileType)
        .subscribe(
        (data) => {
          this.addProfesseurModuleList(data);
          this.addContrat(data);
        }, (error) => {
          this.notif.error('Echec de l\'ajout du professeur');
          }, () => {
          this.notif.success('Professeur ajouté avec succès');
          }
      )
    );
  }

  addContrat(professeur) {
    if (this.typeContrat && this.typeContrat.id && professeur && professeur.id) {
      this.contrat.typeContrat = this.typeContrat;
      this.contrat.professeur = professeur;
      this.contrat.dateDebut = moment(this.contrat.dateDebut, 'MM-DD-YYYY Z').valueOf();
      this.contrat.dateFin = moment(this.contrat.dateFin, 'MM-DD-YYYY Z').valueOf();
      this.subscription.push(
        this.profService.addContrat(this.contrat, this.contratFileName).subscribe(
          (data) => {
          }, (error) => {
            this.notif.error('Echec de l\'ajout de contrat');
          }, () => {
            this.notif.success('Contrat ajouter avec succès');
          }
        )
      );
    }
  }

  getAllModules() {
    this.subscription.push(
      this.paramModuleService.getAllModule().subscribe(
        (data) => {
          console.log(data);
          this.moduleList = data;
        }, (error) => console.log(error),
        () => {
          this.moduleList.forEach(m => {
            this.moduleListCustome.push({checked: false, module: m});
          });
        }
      )
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.specialites.push(value);
    }

    // Clear the input value
    // event.chipInput!.clear();

    this.specialiteCtrl.setValue(null);
  }

  remove(specialite: string): void {
    const index = this.specialites.indexOf(specialite);

    if (index >= 0) {
      this.specialites.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.specialites.push(event.option.viewValue);
    this.specialiteInput.nativeElement.value = '';
    this.specialiteCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allSpecialites.filter(specialite => specialite.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterDiplome(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allDiplome.filter(diplome => diplome.toLowerCase().indexOf(filterValue) === 0);
  }

  addDiplome(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.diplomes.push(value);
    }

    // Clear the input value
    // event.chipInput!.clear();

    this.diplomeCtrl.setValue(null);
  }

  removeDiplome(diplome: string): void {
    const index = this.diplomes.indexOf(diplome);

    if (index >= 0) {
      this.diplomes.splice(index, 1);
    }
  }

  selectedDiplome(event: MatAutocompleteSelectedEvent): void {
    this.diplomes.push(event.option.viewValue);
    this.diplomeInput.nativeElement.value = '';
    this.diplomeCtrl.setValue(null);
  }

  onSelectedModule($event: MatCheckboxChange) {
    const checked = $event.checked;
    const module = $event.source.value as unknown as ModuleModel;
    const arrayTemp = [];
    if (checked) {
      this.selectedModuleList.push(module);
    } else {
      this.selectedModuleList.forEach(m => {
        if (Number(m.id) !== Number(module.id)) {
          arrayTemp.push(m);
        }
      });
      this.selectedModuleList = arrayTemp;
    }
  }

  onSelectCVFile(event) {
    console.log(event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'image/jpg' || event.target.files[0].type === 'image/jpeg'
        || event.target.files[0].type === 'image/png' || event.target.files[0].type === 'application/pdf') {
        this.cvFileType = event.target.files[0].type;
        this.cvFileName = event.target.files[0].name;
        const reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event1: any) => { // called once readAsDataURL is completed
          this.professeurModel.cv = event1.target.result;
        };
      } else {
        this.notif.error('Veuillez choisir une image ou fichier pdf SVP');
      }
    }
  }

  onSelectContratFile(event) {
    console.log(event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'image/jpg' || event.target.files[0].type === 'image/jpeg'
        || event.target.files[0].type === 'image/png' || event.target.files[0].type === 'application/pdf') {
        this.contratFileType = event.target.files[0].type;
        this.contratFileName = event.target.files[0].name;
        const reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event1: any) => { // called once readAsDataURL is completed
          this.contrat.document = event1.target.result;
        };
      } else {
        this.notif.error('Veuillez choisir une image ou fichier pdf SVP');
      }
    }
  }

  getAllTypeContrat() {
    this.subscription.push(
      this.profService.getAllTypeContrat().subscribe(
        (data) => {
          this.listTypeContrat = data;
        }, (error) => console.log(error)
      )
    );
  }
}
