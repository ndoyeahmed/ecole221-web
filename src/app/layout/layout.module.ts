import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MainContentComponent } from './main-content/main-content.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import {MatCardModule} from '@angular/material/card';



@NgModule({
  declarations: [FooterComponent, HeaderComponent, MainContentComponent, SidebarComponent, BreadcrumbComponent],
    imports: [
        SharedModule,
        MatCardModule
    ],
  exports: [
    MainContentComponent,
    BreadcrumbComponent
  ]
})
export class LayoutModule { }
