import {Route} from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth.guard';
import {NotesComponent} from './components/notes/notes.component';

export const NOTE_ADD_ROUTE: Route = {
  path: 'notes',
  component: NotesComponent,
  canActivate: [AuthGuard]
};
