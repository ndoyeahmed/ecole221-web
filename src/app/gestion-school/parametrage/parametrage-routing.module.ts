import { NiveauAddComponent } from './components/niveau-add/niveau-add.component';
import { DomaineComponent } from './components/domaine/domaine.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ParametragesComponent } from './components/parametrages/parametrages.component';
import {RecapReferentielComponent} from './components/referentiel/recap-referentiel/recap-referentiel.component';
import { AuthGuard } from 'src/app/shared/services/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'domaine',
        component: DomaineComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'niveau-add',
        component: NiveauAddComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class ParametrageRoutingModule {}
