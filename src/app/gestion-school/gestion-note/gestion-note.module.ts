import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesComponent } from './components/notes/notes.component';
import {SharedModule} from '../../shared/shared.module';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {LayoutModule} from '../../layout/layout.module';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatExpansionModule} from '@angular/material/expansion';
import {NotesService} from "./services/notes.service";
import { NotesEtudiantComponent } from './components/notes-etudiant/notes-etudiant.component';
import { DevoirsListComponent } from './components/devoirs-list/devoirs-list.component';
import { BulletinComponent } from './components/bulletin/bulletin.component';



@NgModule({
  declarations: [NotesComponent, NotesEtudiantComponent, DevoirsListComponent, BulletinComponent],
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
    NotesService
  ]
})
export class GestionNoteModule { }
