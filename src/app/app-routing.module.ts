import { MainContentComponent } from './layout/main-content/main-content.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'gestion-school/parametrages',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainContentComponent,
    children: [
      {
        path: 'gestion-school',
        loadChildren: () => import('./gestion-school/gestion-school.module').then(m => m.GestionSchoolModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
