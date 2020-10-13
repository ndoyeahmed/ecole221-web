import { ParametrageRoutingModule } from './parametrage-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomaineComponent } from './domaine/domaine.component';
import { ParametragesComponent } from './parametrages/parametrages.component';



@NgModule({
  declarations: [DomaineComponent, ParametragesComponent],
  imports: [
    ParametrageRoutingModule
  ],
})
export class ParametrageModule { }
