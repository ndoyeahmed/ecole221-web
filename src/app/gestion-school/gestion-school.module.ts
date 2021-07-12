import { InscriptionModule } from './inscription/inscription.module';
import { GestionSchoolRoutingModule } from './gestion-school-routing.module';
import { NgModule } from '@angular/core';
import {ProfesseursModule} from './professeurs/professeurs.module';

@NgModule({
  declarations: [],
  imports: [
    GestionSchoolRoutingModule,
    InscriptionModule,
    ProfesseursModule
  ],
})
export class GestionSchoolModule { }
