import { DomaineComponent } from './domaine/domaine.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'domaine',
        component: DomaineComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class ParametrageRoutingModule {}
