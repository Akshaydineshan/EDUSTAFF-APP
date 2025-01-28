import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/service/data/data.service';
interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}
@Component({
  selector: 'app-approved-non-approved-teacher',
  templateUrl: './approved-non-approved-teacher.component.html',
  styleUrls: ['./approved-non-approved-teacher.component.scss'],
  providers: [DatePipe]
})
export class ApprovedNonApprovedTeacherComponent implements OnInit {
  isSidebarClosed = false;



  // table related vaiables
  displayColumns: any[] = [{ headerName: 'Name', field: 'name' }, { headerName: 'School Name', field: 'schoolName' }, { headerName: 'Subject', field: 'subject' },{ headerName: 'Phone Number', field: 'phoneNumber' }, { headerName: 'Age', field: 'age' }, { headerName: 'Experience', field: 'experienceYear' }, { headerName: 'Designation', field: 'designation' },];
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


  constructor(private dataService: DataService, private datePipe: DatePipe) {

  }
  ngOnInit(): void {
    this.loadTeacherData()

  }


  // Toggle between Approved and Non-Approved teachers
  changeTab(tab: string) {
    this.isApprovedTab = tab === 'approved';
    this.loadTeacherData();  // Reload data when the tab changes
  }

  loadTeacherData() {
    // Determine the endpoint based on the selected tab
    const tableDataListApiEndPoint = this.isApprovedTab
      ? "Teacher/GetAllApprovedTeacher"
      : "Teacher/GetAllNonApprovedTeacher";

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
          ...(column.field === 'requestDate' ||
            column.field === 'approvalDate' ||
            column.field === 'transferDate'
            ? {
              valueFormatter: (params: any) =>
                this.datePipe.transform(params.value, 'dd/MM/yyyy'),
            }
            : {}),

          // Conditional rendering for name or schoolName columns
          ...(column.field === 'name' || column.field === 'schoolName'
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
                params.value <= 0 ? 0 : `${params.value}`,
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

  rowMouseHover(event: any) {
    // const rowNode: any = event.node;
    // const rowData = rowNode.data;
    // if (event.colDef.field === "employeeName") {
    //   this.onTeacherHover(rowData.employeeID, rowData, event.event)
    // } else if (event.colDef.field === "fromSchoolName") {
    //   this.onSchoolHover(rowData.fromSchoolID, rowData, event.event)
    // }
    // else if (event.colDef.field === "toApprovedSchoolName") {
    //   this.onSchoolHover(rowData.toApprovedSchoolID, rowData, event.event)
    // }
  }
  rowMouseHoverOut(event: any) {
    // // if (event.colDef.field === "principalName") {
    // this.onTeacherMouseOut()
    // // } else if (event.colDef.field === "name") {
    // this.onSchoolMouseOut()

    // // }

  }





  onCellClicked(event: any) {

    // const rowNode: any = event.node;
    // const rowData = rowNode.data;

    // if (event.colDef.field === "employeeName") {
    //   let teacherId: number = rowData.employeeID

    //   this.ngZone.run(() => {
    //     this.router.navigate(['/teachers/view-teacher', teacherId])
    //   })

    // } else if (event.colDef.field === "fromSchoolName") {
    //   let schoolId: number = rowData.fromSchoolID
    //   this.router.navigate(['/schools/view', schoolId])
    // } else if (event.colDef.field === "toSchoolName") {
    //   let schoolId: number = rowData.toSchoolID
    //   this.router.navigate(['/schools/view', schoolId])
    // }

  }


  overlayClick() {
    // this.showPopup = false;
    // this.showSchoolPopup = false;

  }
}
