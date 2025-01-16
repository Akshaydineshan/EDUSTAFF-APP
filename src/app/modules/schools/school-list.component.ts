import { HttpHeaders } from '@angular/common/http';
import { ColDef } from 'ag-grid-community';
import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/service/data/data.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements OnInit {
  isSidebarClosed = false;
  displayColumns: any[] = [{ headerName: 'SchoolName', field: 'name' }, { headerName: 'SchoolType', field: 'schoolType' }, { headerName: 'Contact No', field: 'contact' }, { headerName: 'Principal (HM)', field: 'principal' }, { headerName: 'No of Teachers', field: 'noOfTeachers' }, { headerName: 'No of Students', field: 'noOfStudents' }];
  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] }
  schoolList: any[] = [];
  schoolTableRows: any;
  schoolTableColumns!: { field: string; filter: boolean; floatingFilter: boolean }[];

  apiUrl = environment.imageBaseUrl;
  showSchoolPopup: boolean = false;
  selectedSchool: any;
  hoverTimeout!: any;
  mouseX!: number
  mouseY!: number
  selectedTeacher: any;
  showPopup!: boolean;
  API_BASE_IMAGE: any = environment.imageBaseUrl


  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.loadSchoolList();
  }

  @HostListener('mousemove', ['$event'])
  updateMousePosition(event: MouseEvent): void {
    const offset = 15; // Offset for positioning
    this.mouseX = event.clientX + offset;
    this.mouseY = event.clientY + offset;
    const popupWidth = 420;
    const popupHeight = 220;

    // Check right edge
    if (this.mouseX + popupWidth > window.innerWidth) {

      this.mouseX = window.innerWidth - popupWidth - offset; // Position left
    }

    // Check bottom edge
    if (this.mouseY + popupHeight > window.innerHeight) {
      this.mouseY = event.clientY - popupHeight + 20; // Position above the mouse
    }


  }


  loadSchoolList(): void {
    debugger
    this.dataService.getSchoolData().subscribe(
      (data) => {
        debugger
        this.schoolList = data;

        this.schoolTableRows = this.schoolList
        this.schoolTableColumns = this.displayColumns.map((column) => ({
          headerName: column.headerName,
          field: column.field,
          filter: true,
          floatingFilter: column.field === 'name', // Floating filter for 'name' field only
          ...(column.field === 'name'
            ? {
              // Custom rendering for the 'name' column
              cellRenderer: (params: any) => {
                if (params.data) {
                  const name = params.data.name || '';
                  const city = params.data.city || '';
                  return `<a style="cursor: pointer; color: #246CC1;" target="_blank">${name} (${city})</a>`;
                }
                return '';
              },
              width: 300,
            }
            : {}),

            ...(column.field === 'schoolType'
              ? {
                // Custom rendering for the 'name' column
                cellRenderer: (params: any) => {
                  console.log("parmsData",params)
                  if (params.data.getSchoolTypes.length) {
                    let schoolTypes:any=params.data.getSchoolTypes.map((item:any)=>(item.schoolTypeName))
                    return  schoolTypes.join( ',')
                  }
                  return 'N/A';
                },
                width: 300,
              }
              : {}),

        }));




      },
      (error) => {
        console.error('Error fetching school data:', error);
      }
    );
  }


  // table row hover popup related functions

  get getTeacherImage() {
    let result = '';
    if (this.API_BASE_IMAGE && this.selectedTeacher?.photo) {
      result = this.API_BASE_IMAGE.replace(/\/+$/, '') + '/' + this.selectedTeacher.photo?.replace(/^\/+/, '');
    }
    // If the result is an empty string, it will fallback to emptyImage in the template
    return result;
  }

  onSchoolHover(schoolId: number, schoolData: any, event: MouseEvent): void {

    // this.schoolId = schoolId
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    // this.hoveredTeacherId = schoolId;
    if (schoolId && schoolData) {
      this.hoverTimeout = setTimeout(() => {

        this.dataService.getSchoolDetailPopUp(schoolId).subscribe(
          (data) => {
            this.selectedSchool = data;
            this.showSchoolPopup = true;
            this.updateMousePosition(event);
          },
          (error) => {
            console.error('Error fetching school details:', error);
          }
        );
      }, 200);
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
    debugger
    // this.teacherId = teacherId;
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    // this.hoveredTeacherId = teacherId;
    if (teacherId && teacherData) {
      this.hoverTimeout = setTimeout(() => {


        // this.showPopup = true;
        // this.updateMousePosition(event);

        this.dataService.getTeacherDetailPopUp(teacherId).subscribe(
          (data) => {
            this.selectedTeacher = data; // Store the detailed info
            if (this.selectedTeacher && teacherId) {
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
    this.selectedTeacher = null;
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }



  rowMouseHover(event: any) {

    const rowNode: any = event.node;
    const rowData = rowNode.data;
    if (event.colDef.field === "principal") {
      this.onTeacherHover(rowData.teacherId, rowData, event.event)
    } else if (event.colDef.field === "name") {
      this.onSchoolHover(rowData.schoolId, rowData, event.event)
    }
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
      let schoolId: number = rowData.schoolId
      this.router.navigate(['/schools/view', schoolId])
    }

  }


  get getschoolImage() {
    let result = '';
    if (this.apiUrl && this.selectedSchool?.photo && this.selectedSchool?.photo !== 'null') {
      result = this.apiUrl.replace(/\/+$/, '') + '/' + this.selectedSchool?.photo.replace(/^\/+/, '');
    }
    // If the result is an empty string, it will fallback to emptyImage in the template
    return result;
  }


}
