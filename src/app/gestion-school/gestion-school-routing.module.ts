import { EtudiantListComponent } from './inscription/components/etudiant-list/etudiant-list.component';
import { InscriptionComponent } from './inscription/components/inscription/inscription.component';
import { ParametragesComponent } from './parametrage/components/parametrages/parametrages.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'parametrages',
        component: ParametragesComponent,
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
        /* children: [
          {
            path: 'inscription',
            loadChildren: () => import('./inscription/inscription.module').then(m => m.InscriptionModule)
          }
        ] */
      },
      {
        path: 'list-etudiant',
        component: EtudiantListComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class GestionSchoolRoutingModule {
}
