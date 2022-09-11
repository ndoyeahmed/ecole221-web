import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './services/auth.service';



@NgModule({
  declarations: [LoginComponent, ChangePasswordComponent],
  imports: [
    AuthenticationRoutingModule,
    SharedModule
  ],
  providers: [AuthService]
})
export class AuthenticationModule { }
