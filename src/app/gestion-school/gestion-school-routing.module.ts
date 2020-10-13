import { ParametragesComponent } from './parametrage/parametrages/parametrages.component';
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
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class GestionSchoolRoutingModule {
}
