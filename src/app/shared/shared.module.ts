import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from '../layout/topbar/topbar.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { SharedRoutingModule } from './shared-routing.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TableListComponent } from './components/table-list/table-list.component';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog.component';
import { DetailDailogComponent } from './components/detail-dailog/detail-dailog.component';
import { TableComponent } from './components/table/table.component';
import { AgGridAngular } from 'ag-grid-angular';


import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MaterialSpinnerComponent } from './material-spinner/material-spinner.component';
import { AlertComponent } from './components/alerts/alert/alert.component';


@NgModule({
  declarations: [
    TopbarComponent,
    SidebarComponent,
    PageNotFoundComponent,
    TableListComponent,
    FilterDialogComponent,
    DetailDailogComponent,
    TableComponent,
    MaterialSpinnerComponent,
    AlertComponent
    
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    AgGridAngular,
    MatProgressSpinnerModule
  ],
  exports: [
    TopbarComponent,
    SidebarComponent,
    TableListComponent,
    DetailDailogComponent,
    TableComponent,
    MaterialSpinnerComponent
  ]
})
export class SharedModule { }
