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
import { DomaineComponent } from './domaine/domaine.component';
import { ParametragesComponent } from './parametrages/parametrages.component';
import { MentionComponent } from './mention/mention.component';
import { SpecialiteComponent } from './specialite/specialite.component';
import { ParcoursComponent } from './parcours/parcours.component';
import { HoraireComponent } from './horaire/horaire.component';
import { ModuleComponent } from './module/module.component';
import { AnneescolaireComponent } from './anneescolaire/anneescolaire.component';
import { CycleComponent } from './cycle/cycle.component';
import { PaysComponent } from './pays/pays.component';
import { SemestreComponent } from './semestre/semestre.component';
import { NiveauComponent } from './niveau/niveau.component';
import { DocumentComponent } from './document/document.component';
import { ReferentielComponent } from './referentiel/referentiel.component';
import { UeComponent } from './ue/ue.component';



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
    UeComponent
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
})
export class ParametrageModule { }
