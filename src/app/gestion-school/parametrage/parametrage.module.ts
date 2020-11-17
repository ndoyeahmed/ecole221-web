import { ParametrageClasseService } from './services/parametrage-classe.service';
import { ParametrageReferentielService } from './services/parametrage-referentiel.service';
import { ParametrageModuleUeService } from './services/parametrage-module-ue.service';
import { ParametragesSpecialiteService } from './services/parametrages-specialite.service';
import { MycustomNotificationService } from './services/mycustom-notification.service';
import { ParametragesBaseService } from './services/parametrages-base.service';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from './../../shared/shared.module';
import { ParametrageRoutingModule } from './parametrage-routing.module';
import { NgModule } from '@angular/core';
import { DomaineComponent } from './components/domaine/domaine.component';
import { ParametragesComponent } from './components/parametrages/parametrages.component';
import { MentionComponent } from './components//mention/mention.component';
import { SpecialiteComponent } from './components/specialite/specialite.component';
import { ParcoursComponent } from './components/parcours/parcours.component';
import { HoraireComponent } from './components/horaire/horaire.component';
import { ModuleComponent } from './components/module/module.component';
import { AnneescolaireComponent } from './components/anneescolaire/anneescolaire.component';
import { CycleComponent } from './components/cycle/cycle.component';
import { PaysComponent } from './components/pays/pays.component';
import { SemestreComponent } from './components/semestre/semestre.component';
import { NiveauComponent } from './components/niveau/niveau.component';
import { DocumentComponent } from './components/document/document.component';
import { ReferentielComponent } from './components/referentiel/referentiel.component';
import { UeComponent } from './components/ue/ue.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { ClasseComponent } from './components/classe/classe.component';
import { SousClasseComponent } from './components/sous-classe/sous-classe.component';
import { AffectationClasseReferentielComponent } from './components/affectation-classe-referentiel/affectation-classe-referentiel.component';
import { NiveauAddComponent } from './components/niveau-add/niveau-add.component';
import { ReferentielAddComponent } from './components/referentiel-add/referentiel-add.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';



@NgModule({
  declarations: [
    DomaineComponent,
    ParametragesComponent,
    MentionComponent,
    SpecialiteComponent,
    ParcoursComponent,
    HoraireComponent,
    ModuleComponent,
    AnneescolaireComponent,
    CycleComponent,
    PaysComponent,
    SemestreComponent,
    NiveauComponent,
    DocumentComponent,
    ReferentielComponent,
    UeComponent,
    DeleteDialogComponent,
    ClasseComponent,
    SousClasseComponent,
    AffectationClasseReferentielComponent,
    NiveauAddComponent,
    ReferentielAddComponent,
    ConfirmDialogComponent
  ],
  imports: [
    ParametrageRoutingModule,
    SharedModule,
    MatCardModule,
    MatTabsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    ParametragesBaseService,
    MycustomNotificationService,
    ParametragesSpecialiteService,
    ParametrageModuleUeService,
    ParametrageReferentielService,
    ParametrageClasseService
  ]
})
export class ParametrageModule { }
