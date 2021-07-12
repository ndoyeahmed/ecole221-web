import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfesseurAddComponent } from './components/professeur-add/professeur-add.component';
import { ProfesseurListComponent } from './components/professeur-list/professeur-list.component';
import {SharedModule} from '../../shared/shared.module';
import {ProfesseurService} from './services/professeur.service';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {LayoutModule} from "../../layout/layout.module";
import {MatIconModule} from "@angular/material/icon";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatExpansionModule} from "@angular/material/expansion";



@NgModule({
  declarations: [ProfesseurAddComponent, ProfesseurListComponent],
  imports: [
    SharedModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    LayoutModule,
    MatIconModule,
    MatAutocompleteModule,
    MatExpansionModule,
  ],
  providers: [
    ProfesseurService
  ]
})
export class ProfesseursModule { }
