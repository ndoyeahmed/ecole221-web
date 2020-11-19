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



@NgModule({
  declarations: [InscriptionComponent, FicheRenseignementComponent],
  imports: [
    SharedModule,
    MatCardModule,
    MatTabsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class InscriptionModule { }
