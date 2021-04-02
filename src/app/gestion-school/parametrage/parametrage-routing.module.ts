import { NiveauAddComponent } from './components/niveau-add/niveau-add.component';
import { DomaineComponent } from './components/domaine/domaine.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ParametragesComponent } from './components/parametrages/parametrages.component';
import {RecapReferentielComponent} from './components/referentiel/recap-referentiel/recap-referentiel.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'domaine',
        component: DomaineComponent
      },
      {
        path: 'niveau-add',
        component: NiveauAddComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class ParametrageRoutingModule {}
