import { InscriptionModule } from './inscription/inscription.module';
import { GestionSchoolRoutingModule } from './gestion-school-routing.module';
import { NgModule } from '@angular/core';
import {ProfesseursModule} from './professeurs/professeurs.module';
import {GestionNoteModule} from './gestion-note/gestion-note.module';

@NgModule({
  declarations: [],
  imports: [
    GestionSchoolRoutingModule,
    InscriptionModule,
    ProfesseursModule,
    GestionNoteModule
  ],
})
export class GestionSchoolModule { }
