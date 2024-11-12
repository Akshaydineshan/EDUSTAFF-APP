import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/service/data/data.service';
interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}
@Component({
  selector: 'app-transfer-request-list',
  templateUrl: './transfer-request-list.component.html',
  styleUrls: ['./transfer-request-list.component.scss'],
  providers: [DatePipe]
})
export class TransferRequestListComponent implements OnInit {

  isSidebarClosed = false;
  displayColumns: any[] = [{ headerName: 'name', field: 'employeeName' }, { headerName: 'From School', field: 'fromSchoolName' }, { headerName: 'To School', field: 'toSchoolName' }, { headerName: 'Requested Date', field: 'requestDate' }, { headerName: 'Approval Date', field: 'approvalDate' }, { headerName: 'Comment', field: 'comment' },{ headerName: 'Status', field: 'status' }];
  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] }
  transferList: any[] = [];
  transferTableRows: any;
  transferTableColumns!: { field: string; filter: boolean; floatingFilter: boolean }[];

  mouseX!: number
  mouseY!: number
  hoveredEmployee: any;
  showPopup!: boolean;
  hoverTimeout!: any;
  showSchoolPopup: boolean=false;
  selectedSchool: any;

 constructor(private dataService:DataService,private datePipe:DatePipe){


 }

  ngOnInit(): void {
    this.loadtransferRequestList()
   
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

  loadtransferRequestList(){

    this.dataService.getTransferRequestData().subscribe(
      (data:any) => {
        debugger
        this.transferList = data;
        console.log("school list data", this.transferList);
        this.transferTableRows = this.transferList
        this.transferTableColumns = this.displayColumns.map((column) => ({
          headerName: column.headerName,
              valueFormatter: column.field === 'requestDate'  || column.field === 'approvalDate'
          ? (params: any) => this.datePipe.transform(params.value, 'MM/dd/yyyy')
          : undefined, 
          field: column.field,
          filter: true,
          floatingFilter: column.field === 'employeeName', // For example, only these columns have floating filters
          ... (column.field === 'employeeName' ||column.field ==="toSchoolName"  || column.field ==="fromSchoolName" ? {
            cellRenderer: (params: any) => `<a style="cursor: pointer;  color: #246CC1;" target="_blank">${params.value}</a>`,
            width:220
          } : {})
        }));



      },
      (error:any) => {
        console.error('Error fetching school data:', error);
      }
    );

  }



  onSchoolHover(schoolId: number, schoolData: any, event: MouseEvent): void {
    // this.schoolId = schoolId
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    // this.hoveredTeacherId = schoolId;
    if (schoolId && schoolData) {
      this.hoverTimeout = setTimeout(() => {
        // this.selectedSchool = schoolData;
        // this.showSchoolPopup = true;
        // this.updateMousePosition(event);
        this.dataService.getSchoolDetailPopUp(schoolId).subscribe(
          (data) => {
            this.selectedSchool = data;
            console.log("school", this.selectedSchool)
            this.showSchoolPopup = true;
            this.updateMousePosition(event);
          },
          (error) => {
            console.error('Error fetching school details:', error);
          }
        );
      }, 300);
    }
  }

  onSchoolMouseOut(): void {
    // this.schoolId = null;
    this.showSchoolPopup = false;
    this.selectedSchool = null;
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }


  onTeacherHover(teacherId: number, teacherData: any, event: MouseEvent): void {
    console.log("teacherId",teacherId,teacherData)

    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    if (teacherId && teacherData) {
      this.hoverTimeout = setTimeout(() => {
        this.dataService.getTeacherDetailPopUp(teacherId).subscribe(
          (data) => {
            this.hoveredEmployee = data; // Store the detailed info
            if (this.hoveredEmployee && teacherId) {
              this.showPopup = true;
              this.updateMousePosition(event);
            }
          },
          (error) => {
            console.error('Error fetching teacher details:', error);
          }
        );
      }, 200);
    }
  }
  onTeacherMouseOut(): void {

    this.showPopup = false;
    this.hoveredEmployee = null;
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }



  rowMouseHover(event: any) {
    const rowNode: any = event.node;
    const rowData = rowNode.data;
    if (event.colDef.field === "employeeName") {
      this.onTeacherHover(rowData.employeeID, rowData, event.event)
    }else if (event.colDef.field === "fromSchoolName") {
      this.onSchoolHover(rowData.fromSchoolID, rowData, event.event)
    }
    else if (event.colDef.field === "toSchoolName") {
      this.onSchoolHover(rowData.toSchoolID, rowData, event.event)
    }
  }
  rowMouseHoverOut(event: any) {
    // if (event.colDef.field === "principalName") {
    this.onTeacherMouseOut()
    // } else if (event.colDef.field === "name") {
    this.onSchoolMouseOut()

    // }

  }
}
