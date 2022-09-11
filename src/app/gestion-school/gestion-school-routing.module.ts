import { AfficherDossierAbsenceComponent } from './inscription/components/afficher-dossier-absence/afficher-dossier-absence.component';
import { DossierEtudiantComponent } from './inscription/components/dossier-etudiant/dossier-etudiant.component';
import { ParcoursEtudiantComponent } from './inscription/components/parcours-etudiant/parcours-etudiant.component';
import { EtudiantListComponent } from './inscription/components/etudiant-list/etudiant-list.component';
import { InscriptionComponent } from './inscription/components/inscription/inscription.component';
import { ParametragesComponent } from './parametrage/components/parametrages/parametrages.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {RecapReferentielComponent} from './parametrage/components/referentiel/recap-referentiel/recap-referentiel.component';
import {PROFESSEUR_ADD_ROUTE, PROFESSEUR_EDIT_ROUTE, PROFESSEUR_LIST_ROUTE} from './professeurs/professeur.route';
import {NOTE_ADD_ROUTE} from './gestion-note/notes.route';
import { AuthGuard } from '../shared/services/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'parametrages',
        component: ParametragesComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'parametrages',
            loadChildren: () => import('./parametrage/parametrage.module').then(m => m.ParametrageModule)
          }
        ]
      },
      {
        path: 'inscription',
        component: InscriptionComponent,
        canActivate: [AuthGuard]
        /* children: [
          {
            path: 'inscription',
            loadChildren: () => import('./inscription/inscription.module').then(m => m.InscriptionModule)
          }
        ] */
      },
      {
        path: 'list-etudiant',
        component: EtudiantListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'parcours-etudiant/:inscriptionid',
        component: ParcoursEtudiantComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'dossier-etudiant/:inscriptionId/:anneescolaireid',
        component: DossierEtudiantComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'dossier-absence-etudiant/:inscriptionid',
        component: AfficherDossierAbsenceComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'recap-referentiel/:referentielid',
        component: RecapReferentielComponent,
        canActivate: [AuthGuard]
      },
      PROFESSEUR_ADD_ROUTE,
      PROFESSEUR_EDIT_ROUTE,
      PROFESSEUR_LIST_ROUTE,
      NOTE_ADD_ROUTE
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class GestionSchoolRoutingModule {
}
