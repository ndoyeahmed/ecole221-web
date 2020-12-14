import { InscriptionService } from './services/inscription.service';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { FicheRenseignementComponent } from './components/fiche-renseignement/fiche-renseignement.component';
import { EtudiantListComponent } from './components/etudiant-list/etudiant-list.component';
import { ChangementClasseComponent } from './components/changement-classe/changement-classe.component';
import { ParcoursEtudiantComponent } from './components/parcours-etudiant/parcours-etudiant.component';
import { DossierEtudiantComponent } from './components/dossier-etudiant/dossier-etudiant.component';



@NgModule({
  declarations: [InscriptionComponent, FicheRenseignementComponent, EtudiantListComponent, ChangementClasseComponent, ParcoursEtudiantComponent, DossierEtudiantComponent],
  imports: [
    SharedModule,
    MatCardModule,
    MatTabsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    InscriptionService
  ]
})
export class InscriptionModule { }
