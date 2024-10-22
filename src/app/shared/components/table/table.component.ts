import { Component, Input } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
interface PagonationConfig{
  pagination:boolean,
  paginationPageSize:number,
  paginationPageSizeSelector:number[]
}
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
   // Row Data: The data to be displayed.
   @Input() rowData!:any[]
   @Input() colDefs!:any[]
   @Input() paginationConfig!:PagonationConfig
  //  @Input() paginationPageSize!:number;
  //  @Input() paginationPageSizeSelector!:number[];
//  rowData = [
//   { teacherId: 1, name: "Model Y", schoolName: 64950, designation: "fuh",employeeType:"a" },
//   { teacherId: 2, name: "F-Series", schoolName: 33850, designation: "fjg",employeeType:"b" },
//   { teacherId: 3, name: "Corolla", schoolName: 29600, designation: "dfhg",employeeType:"ab" },
//   { teacherId: 4, name: "Model Y", schoolName: 64950, designation: "fuh" ,employeeType:"ac"},
//   { teacherId: 5, name: "F-Series", schoolName: 33850, designation: "fjg",employeeType:"ad" },
//   { teacherId: 6, name: "Corolla", schoolName: 29600, designation: "dfhg",employeeType:"e" },
//   { teacherId: 8, name: "Model Y", schoolName: 64950, designation: "fuh",employeeType:"f" },
//   { teacherId: 7, name: "F-Series", schoolName: 33850, designation: "fjg",employeeType:"g" },
//   { teacherId: 9, name: "Corolla", schoolName: 29600, designation: "dfhg" ,employeeType:"hiop"},
//   { teacherId: 10, name: "Model Y", schoolName: 64950, designation: "fuh" ,employeeType:"j"},
//   { teacherId: 11, name: "F-Series", schoolName: 33850, designation: "fjg" ,employeeType:"k"},
//   { teacherId: 12, name: "Corolla", schoolName: 29600, designation: "dfhg",employeeType:"m" },
// ];

// Column Definitions: Defines the columns to be displayed.
// colDefs: ColDef[] = [
  
//   { field: "teacherId", },
//   { field: "name" ,filter: true, floatingFilter: true },
//   { field: "schoolName" },
//   { field: "designation" },
//   { field: "employeeType" },
//   { field: "experienceYear" },
//   { field: "age" },
//   { field: "phoneNumber" },
//   { field: "documentCount" },
// ];

}
