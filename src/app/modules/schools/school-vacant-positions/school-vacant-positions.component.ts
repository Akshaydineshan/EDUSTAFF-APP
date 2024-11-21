import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/service/data/data.service';
import { SchoolService } from '../school.service';
  
interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}
@Component({
  selector: 'app-school-vacant-positions',
  templateUrl: './school-vacant-positions.component.html',
  styleUrls: ['./school-vacant-positions.component.scss']
})
export class SchoolVacantPositionsComponent implements OnInit {


  isSidebarClosed = false;

  displayColumns: any[] = [{ headerName: 'School Name', field: 'schoolName' }, { headerName: 'Address', field: 'address' }, { headerName: 'Subject', field: 'subjectName' }, { headerName: 'Designation', field: 'designationName' },  { headerName: 'Status', field: 'status' }];
  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] }
  vacantPositionList: any[] = [];
  vacantPositionRows: any;
  vacantPositionColumns!: any[];

  constructor(private schoolService:SchoolService){

  }
  ngOnInit(): void {
    this.loadVacantPositionList()
   
  }





  
  loadVacantPositionList() {

    this.schoolService.getVacantPositionList().subscribe(
      (data: any) => {
        debugger
        this.vacantPositionList = data;
        console.log("school vacant position list", this.vacantPositionList);
        this.vacantPositionRows = this.vacantPositionList
        this.vacantPositionColumns = this.displayColumns.map((column) => ({
          headerName: column.headerName,
         
          field: column.field,
          filter: true,
          floatingFilter: column.field === 'schoolName', // For example, only these columns have floating filters
          ... (column.field === 'schoolName' ? {
            cellRenderer: (params: any) => `<a style="cursor: pointer;  color: #246CC1;" target="_blank">${params.value}</a>`,
            width:300
          } : {}),

      

        }));



      },
      (error: any) => {
        console.error('Error fetching school data:', error);
      }
    );

  }
}
