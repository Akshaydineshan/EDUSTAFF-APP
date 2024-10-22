import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DataService } from 'src/app/core/service/data/data.service';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from 'src/app/layout/layout.module';
import { TopbarComponent } from 'src/app/layout/topbar/topbar.component';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
  
    DashboardComponent,
    // TopbarComponent,
    // SidebarComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
    SharedModule
    // LayoutModule
    
  ],
  providers: [DataService]
})
export class DashboardModule { }
