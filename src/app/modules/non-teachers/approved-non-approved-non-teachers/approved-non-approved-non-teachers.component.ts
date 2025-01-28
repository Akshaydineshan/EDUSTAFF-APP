import { DatePipe } from '@angular/common';
import { Component, HostListener, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/service/data/data.service';
interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}
@Component({
  selector: 'app-approved-non-approved-non-teachers',
  templateUrl: './approved-non-approved-non-teachers.component.html',
  styleUrls: ['./approved-non-approved-non-teachers.component.scss'],
  providers: [DatePipe]
})
export class ApprovedNonApprovedNonTeachersComponent {
 isSidebarClosed = false;



  // table related vaiables
  displayColumns: any[] = [{ headerName: 'Name', field: 'name' }, { headerName: 'School Name', field: 'schoolName' }, { headerName: 'Subject', field: 'subject' }, { headerName: 'Phone Number', field: 'phoneNumber' }, { headerName: 'Age', field: 'age' }, { headerName: 'Experience', field: 'experienceYear' }, { headerName: 'Designation', field: 'designation' },];
  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] }
  tableDataList: any[] = [];
  tableRows: any;
  tableColumns!: { field: string; filter: boolean; floatingFilter: boolean }[];

  // table column hover related variables
  mouseX!: number
  mouseY!: number
  hoveredEmployee: any;
  showPopup!: boolean;
  hoverTimeout!: any;
  showSchoolPopup: boolean = false;
  selectedSchool: any;

  isApprovedTab = true;  // Initially, load the approved teachers tab


  constructor(private dataService: DataService, private datePipe: DatePipe, private router: Router, private ngZone: NgZone) {

  }
  ngOnInit(): void {
    this.loadTeacherData()

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


  // Toggle between Approved and Non-Approved teachers
  changeTab(tab: string) {
    this.isApprovedTab = tab === 'approved';
    this.loadTeacherData();  // Reload data when the tab changes
  }

  loadTeacherData() {
    // Determine the endpoint based on the selected tab
    const tableDataListApiEndPoint = this.isApprovedTab
      ? "NonTeacher/GetAllApprovedNonTeacher"
      : "NonTeacher/GetAllNonApprovedNonTeacher";

    // Fetch data from the API
    this.dataService.getTableListData(tableDataListApiEndPoint).subscribe(
      (data: any) => {
        // Debugging point to inspect data
        console.log("Teacher list data:", data);

        // Assign fetched data to variables
        this.tableDataList = data;
        this.tableRows = this.tableDataList;

        // Map the columns with conditional formatting and renderers
        this.tableColumns = this.displayColumns.map((column) => ({
          headerName: column.headerName,
          field: column.field,
          filter: true,
          floatingFilter: column.field === 'name', // Floating filter for specific columns

          // Conditional formatting for date fields


          // Conditional rendering for name or schoolName columns
          ...(column.field === 'name'
            ? {
              cellRenderer: (params: any) =>
                params.value
                  ? `<a style="cursor: pointer; color: #246CC1;" target="_blank">${params.value}</a>`
                  : `<a style="cursor: pointer;" target="_blank">N/A</a>`,
              width: 220,
            }
            : {}),
          ...(column.field === "phoneNumber" ? { valueFormatter: (params: any) => `+91 ${params.value}`, } : {}),

          // Conditional value formatting for experienceYear
          ...(column.field === 'experienceYear'
            ? {
              valueFormatter: (params: any) =>
                params.value <= 0 ? "New Joiner" : `${params.value}`,
            }
            : {}),
            ...(column.field === 'age'
              ? {
                valueFormatter: (params: any) =>
                  params.value <= 0 ? "--" : `${params.value}`,
              }
              : {}),
        }));
      },
      (error: any) => {
        // Log errors for debugging
        console.error('Error fetching teacher data:', error);
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
          (data: any) => {
            this.selectedSchool = data;
            console.log("school", this.selectedSchool)
            this.showSchoolPopup = true;
            this.updateMousePosition(event);
          },
          (error: any) => {
            console.error('Error fetching school details:', error);
          }
        );
      }, this.dataService.hoverTime);
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
    console.log("teacherId", teacherId, teacherData)

    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    if (teacherId && teacherData) {
      this.hoverTimeout = setTimeout(() => {
        this.dataService.getTeacherDetailPopUp(teacherId).subscribe(
          (data: any) => {
            this.hoveredEmployee = data; // Store the detailed info
            if (this.hoveredEmployee && teacherId) {
              this.showPopup = true;
              this.updateMousePosition(event);
            }
          },
          (error: any) => {
            console.error('Error fetching teacher details:', error);
          }
        );
      }, this.dataService.hoverTime);
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
    if (event.colDef.field === "name") {
      this.onTeacherHover(rowData.teacherId, rowData, event.event)
    }
    // } else if (event.colDef.field === "fromSchoolName") {
    //   this.onSchoolHover(rowData.fromSchoolID, rowData, event.event)
    // }

  }
  rowMouseHoverOut(event: any) {
    // if (event.colDef.field === "principalName") {
    this.onTeacherMouseOut()
    // } else if (event.colDef.field === "name") {
    this.onSchoolMouseOut()

    // }

  }





  onCellClicked(event: any) {

    const rowNode: any = event.node;
    const rowData = rowNode.data;

    if (event.colDef.field === "name") {
      let teacherId: number = rowData.teacherId

      this.ngZone.run(() => {
        this.router.navigate(['/teachers/view-teacher', teacherId])
      })

    }
    // else if (event.colDef.field === "fromSchoolName") {
    //   let schoolId: number = rowData.fromSchoolID
    //   this.router.navigate(['/schools/view', schoolId])
    // }

  }


  overlayClick() {
    // this.showPopup = false;
    // this.showSchoolPopup = false;

  }
}
