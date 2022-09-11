import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {ChangePasswordComponent} from './components/change-password/change-password.component';
import { AuthGuard } from '../shared/services/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'reset-password',
        component: ChangePasswordComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class AuthenticationRoutingModule {}
