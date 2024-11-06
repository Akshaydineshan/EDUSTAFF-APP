import { DataService } from './../../core/service/data/data.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { NonTeacherService } from './non-teacher.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}

@Component({
  selector: 'app-non-teacher-list',
  templateUrl: './non-teacher-list.component.html',
  styleUrls: ['./non-teacher-list.component.scss']
})
export class NonTeacherListComponent implements OnInit {
  isSidebarClosed = false;
  API_BASE_IMAGE = environment.imageBaseUrl;

  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] }
  displayColumns: string[] = ['name', 'schoolName', 'designation', 'employeeType', 'experienceYear', 'age', 'phoneNumber', 'documentCount'];
  nonTeacherTableRows: any[] = []
  nonTeacherTableColumns: any[] = []
  nonTeacherList: any[] = [];
  selectedTeacher: any;
  hoverTimeout: any;
  showPopup: boolean = false;
  mouseY: number = 0;
  mouseX: number = 0;
  selectedSchool: any;
  showSchoolPopup: boolean = false;

  constructor(private NonTeacherService: NonTeacherService, private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.getNonTeacherListData()

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
  getNonTeacherListData() {

    this.NonTeacherService.fetchNonTeachersData().subscribe({
      next: (data: any) => {
        this.nonTeacherList = data.map((teacher: any) => ({
          ...teacher,
          documentStatus: this.getDocumentStatus(teacher.documentCount, teacher.error)
        }));
        this.nonTeacherTableRows = data
        console.log("Non teacher data list", this.nonTeacherList)

        this.nonTeacherTableColumns = this.displayColumns.map((column: any) => {
          return {
            field: column,
            filter: true,
            floatingFilter: column === 'name',
            ... (column === 'name' || column === 'schoolName' ? {
              cellRenderer: (params: any) => `<a style="cursor: pointer; color:  #246CC1;" target="_blank">${params.value}</a>`

            } : {}),

            ... (column === 'schoolName' ? { width: 300 } : {})

          }


        })

      },
      error: (error: any) => {

      },
      complete: () => {

      }
    })

  }

  getDocumentStatus(documentCount: number, error: any): any {
    if (documentCount !== 0 && error && error.length !== 0) {
      return { icon: 'fas fa-exclamation-triangle text-warning', text: documentCount };
    } else if (documentCount !== 0 && (!error || error.length === 0)) {
      return { icon: 'fas fa-file-alt text-primary', text: documentCount };
    } else if (documentCount === 0) {
      return { icon: '', text: '0' };
    }
    return { icon: '', text: '0' };
  }




  // table event handling function

  get getTeacherImage() {
    debugger
    let result = '';

    if (this.API_BASE_IMAGE && this.selectedTeacher?.photo && this.selectedTeacher?.photo !== 'null') {
      result = this.API_BASE_IMAGE.replace(/\/+$/, '') + '/' + this.selectedTeacher.photo?.replace(/^\/+/, '');
    }
    // If the result is an empty string, it will fallback to emptyImage in the template
    return result;
  }

  onTeacherHover(teacherId: number, teacherData: any, event: MouseEvent): void {
    this.selectedTeacher = null
    // this.teacherId = teacherId;
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    // this.hoveredTeacherId = teacherId;
    if (teacherId && teacherData) {
      this.hoverTimeout = setTimeout(() => {
        this.selectedTeacher = teacherData; // Store the detailed info

        // this.showPopup = true;
        // this.updateMousePosition(event);

        this.dataService.getTeacherDetailPopUp(teacherId).subscribe(
          (data: any) => {
            this.selectedTeacher = data; // Store the detailed info
            console.log("teachres", data)
            if (this.selectedTeacher && teacherId) {
              this.showPopup = true;
              this.updateMousePosition(event);
            }
          },
          (error: any) => {
            console.error('Error fetching teacher details:', error);
          }
        );
      }, 300);
    }
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

  onTeacherMouseOut(): void {
    // this.teacherId = null;
    this.showPopup = false;
    this.selectedTeacher = null;
    // this.hoveredTeacherId = null;

    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }


  rowMouseHover(event: any) {
    debugger
    const rowNode: any = event.node;
    const rowData = rowNode.data;


    if (event.colDef.field === "name") {
      console.log("teacher", event)
      this.onTeacherHover(rowData.teacherId, rowData, event.event)
    } else if (event.colDef.field === "schoolName") {
      this.onSchoolHover(rowData.schoolId, rowData, event.event)

    }
  }
  rowMouseHoverOut(event: any) {
    // if (event.colDef.field === "name") {
    this.onTeacherMouseOut()
    // } else if (event.colDef.field === "schoolName") {
    this.onSchoolMouseOut()

    // }

  }

  get getschoolImage() {
    let result = '';
    if (this.API_BASE_IMAGE && this.selectedSchool?.photo && this.selectedSchool?.photo !== 'null') {
      result = this.API_BASE_IMAGE.replace(/\/+$/, '') + '/' + this.selectedSchool?.photo.replace(/^\/+/, '');
    }
    // If the result is an empty string, it will fallback to emptyImage in the template
    return result;
  }


  onCellClicked(event: any) {
    const rowNode: any = event.node;
    const rowData = rowNode.data;
   
    if (event.colDef.field === "name") {
      let teacherId: number = rowData.teacherId
      this.router.navigate(['/non-teachers/view', teacherId])
    } else if (event.colDef.field === "schoolName") {
      let schoolId: number = rowData.schoolId
      this.router.navigate(['/schools/view', schoolId])
    }
  }
}
