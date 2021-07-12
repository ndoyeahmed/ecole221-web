import {Route} from '@angular/router';
import {ProfesseurAddComponent} from './components/professeur-add/professeur-add.component';
import {ProfesseurListComponent} from './components/professeur-list/professeur-list.component';

export const PROFESSEUR_ADD_ROUTE: Route = {
  path: 'professeur/add',
  component: ProfesseurAddComponent
};

export const PROFESSEUR_LIST_ROUTE: Route = {
  path: 'professeur',
  component: ProfesseurListComponent
};

export const PROFESSEUR_EDIT_ROUTE: Route = {
  path: 'professeur/edit/:id',
  component: ProfesseurAddComponent
};

