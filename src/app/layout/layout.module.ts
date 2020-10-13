import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MainContentComponent } from './main-content/main-content.component';
import { SidebarComponent } from './sidebar/sidebar.component';



@NgModule({
  declarations: [FooterComponent, HeaderComponent, MainContentComponent, SidebarComponent],
  imports: [
    SharedModule
  ],
  exports: [
    MainContentComponent
  ]
})
export class LayoutModule { }
