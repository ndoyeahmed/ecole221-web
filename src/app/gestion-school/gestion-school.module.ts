import { InscriptionModule } from './inscription/inscription.module';
import { GestionSchoolRoutingModule } from './gestion-school-routing.module';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [
    GestionSchoolRoutingModule,
    InscriptionModule
  ],
})
export class GestionSchoolModule { }
