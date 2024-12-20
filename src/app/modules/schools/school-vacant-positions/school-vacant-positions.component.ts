import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/service/data/data.service';
import { SchoolService } from '../school.service';
import { Router } from '@angular/router';

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

  displayColumns: any[] = [{ headerName: 'School Name', field: 'schoolName' }, { headerName: 'Address', field: 'address' }, { headerName: 'Subject', field: 'subjectName' }, { headerName: 'Designation', field: 'designationName' }, { headerName: 'Status', field: 'status' }];
  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] }
  vacantPositionList: any[] = [];
  vacantPositionRows: any;
  vacantPositionColumns!: any[];

  mouseX!: number
  mouseY!: number

  hoverTimeout!: any;
  showSchoolPopup: boolean = false;
  selectedSchool: any;
  schoolId: any;

  constructor(private schoolService: SchoolService, private ngZone: NgZone, private dataService: DataService, private router: Router) {

  }
  ngOnInit(): void {
    this.loadVacantPositionList()

  }






  loadVacantPositionList() {

    this.schoolService.getVacantPositionList().subscribe(
      (data: any) => {
        debugger
        this.vacantPositionList = data;

        this.vacantPositionRows = this.vacantPositionList
        this.vacantPositionColumns = this.displayColumns.map((column) => ({
          headerName: column.headerName,

          field: column.field,
          filter: true,
          floatingFilter: column.field === 'schoolName', // For example, only these columns have floating filters
          ... (column.field === 'schoolName' ? {
            cellRenderer: (params: any) => `<a style="cursor: pointer;  color: #246CC1;" target="_blank">${params.value}</a>`,
            width: 300
          } : {}),



        }));



      },
      (error: any) => {
        console.error('Error fetching school data:', error);
      }
    );

  }


  @HostListener('mousemove', ['$event'])
  updateMousePosition(event: MouseEvent): void {
    const offset = 15; // Offset for positioning
    this.mouseX = event.clientX + offset;
    this.mouseY = event.clientY + offset;
    const popupWidth = 420; // Assume a fixed width for the popup
    const popupHeight = 220; // Assume a fixed height for the popup

    // Check right edge
    if (this.mouseX + popupWidth > window.innerWidth) {

      this.mouseX = window.innerWidth - popupWidth - offset; // Position left
    }

    // Check bottom edge
    if (this.mouseY + popupHeight > window.innerHeight) {
      this.mouseY = event.clientY - popupHeight + 20; // Position above the mouse
    }


  }

  onSchoolMouseOut(): void {
    this.schoolId = null;
    this.showSchoolPopup = false;
    this.selectedSchool = null;
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }

  onCellClick(event: any) {
    const rowNode: any = event.node;
    const rowData = rowNode.data;
    if (event.colDef.field === "schoolName") {
      let schoolId: number = rowData.schoolID
      this.ngZone.run(() => {
        this.router.navigate(['/schools/view', schoolId])
      })
    }

  }

  onSchoolHover(schoolId: number, schoolData: any, event: MouseEvent): void {
    this.schoolId = schoolId
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    
    if (schoolId && schoolData) {
      this.hoverTimeout = setTimeout(() => {
       
        this.dataService.getSchoolDetailPopUp(schoolId).subscribe(
          (data: any) => {
            this.selectedSchool = data;

            this.showSchoolPopup = true;
            this.updateMousePosition(event);
          },
          (error: any) => {
            console.error('Error fetching school details:', error);
          }
        );
      }, 300);
    }
  }



  rowMouseHover(event: any) {

    const rowNode: any = event.node;
    const rowData = rowNode.data;
    if (event.colDef.field === "schoolName") {
       this.onSchoolHover(rowData.schoolID, rowData, event.event)

    }
  }
  rowMouseHoverOut(event: any) {
    this.onSchoolMouseOut()

  }
}
