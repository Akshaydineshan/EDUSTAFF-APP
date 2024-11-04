import { ColDef } from 'ag-grid-community';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Teacher, TeacherDocument, TransferRequest } from 'src/app/core/models/teacher/teacher';
import { DataService } from 'src/app/core/service/data/data.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit {
  @ViewChild('transferModal') transferModal!: ElementRef;
  isSidebarClosed = false;
  teacherList: any[] = [];
  teacherTableRows: any[] = []
  teacherTableColumns: any[] = []
  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] }
  paginatedData: any[] = [];
  displayColumns: string[] = ['name', 'schoolName', 'designation', 'employeeType', 'experienceYear', 'age', 'phoneNumber', 'documentCount'];

  selectedTeacher: any = null;
  hoveredTeacherId: number | null = null;
  hoverTimeout: any;
  mouseX: number = 0;
  mouseY: number = 0;
  showPopup: boolean = false;
  showSchoolPopup: boolean = false;
  selectedSchool: any = null;
  apiUrl = environment.imageBaseUrl;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  sortedColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  filterForm: FormGroup;

  showFilterModal = false;

  transferRequest: TransferRequest = {
    school: '',
    position: '',
    date: '',
    comment: ''
  };

  schools = [
    { id: '1', name: 'School A' },
    { id: '2', name: 'School B' },
  ];

  positions = ['Teacher', 'Headmaster', 'Vice Principal'];
  teacherId!: any;
  schoolId!: any;

  API_BASE_IMAGE: any = environment.imageBaseUrl

  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router, private toastr: ToastrService) {
    this.filterForm = this.fb.group({
      subjectFilter: [''],
      retiringInMonths: [],
      schoolNameFilter: [''],
      documents: [false],
      minExperienceYear: [0],
      maxExperienceYear: [100],
      // ExperienceYear: [],
      newRecruit: [false]
    });
  }

  ngOnInit(): void {
    this.loadTeachersList();
    this.updateSliderTrack();
    this.filterForm.valueChanges.subscribe(() => {
      this.updateSliderTrack();
    });
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (!target.closest('.dropdown') && this.showFilterModal) {
      this.showFilterModal = false; // Close dropdown when clicking outside
    }
  }

  onMenuAction(action: string, teacher: any) {
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

  // updateMousePosition(event: MouseEvent): void {
  //   this.mouseX = event.clientX + 15;
  //   this.mouseY = event.clientY + 15;
  // }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const filterButton = document.getElementById('filterButton');
    const filterDropdown = document.getElementById('filterDropdown');

    if (filterButton && filterDropdown) {
      if (!filterButton.contains(event.target as Node) && !filterDropdown.contains(event.target as Node)) {
        this.showFilterModal = false;
      }
    }
  }

  submitTransfer(): void {
    if (this.transferRequest.school && this.transferRequest.position && this.transferRequest.date) {
      console.log(this.transferRequest);
      this.resetForm(this.transferRequest);
    } else {
      console.log('Form is invalid');
    }
  }

  resetForm(form: any) {
    this.transferRequest = {
      school: '',
      position: '',
      date: '',
      comment: ''
    };
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

  onSliderChange(): void {
    const minVal = this.filterForm.get('minExperienceYear')?.value;
    const maxVal = this.filterForm.get('maxExperienceYear')?.value;
    if (minVal > maxVal) {
      this.filterForm.get('minExperienceYear')?.setValue(maxVal);
    }
    if (maxVal < minVal) {
      this.filterForm.get('maxExperienceYear')?.setValue(minVal);
    }
    this.updateSliderTrack();
  }

  onInputChange(): void {
    this.onSliderChange();
  }

  updateSliderTrack(): void {
    const minVal = this.filterForm.get('minExperienceYear')?.value;
    const maxVal = this.filterForm.get('maxExperienceYear')?.value;
    const track = document.querySelector('.slider-track') as HTMLElement;
    const minPercent = (minVal / 100) * 100;
    const maxPercent = (maxVal / 100) * 100;
    track.style.background = `linear-gradient(to right, #ddd ${minPercent}%, #4CAF50 ${minPercent}%, #4CAF50 ${maxPercent}%, #ddd ${maxPercent}%)`;
  }

  loadTeachersList(): void {
    debugger

    this.dataService.getTeachersData().subscribe(
      (data) => {
        debugger
        this.teacherList = data.map((teacher: Teacher) => ({
          ...teacher,
          documentStatus: this.getDocumentStatus(teacher.documentCount, teacher.error)
        }));
        console.log("document sytatus check", this.teacherList)

        this.teacherTableRows = this.teacherList
        this.teacherTableColumns = [
          {
            field: "name", filter: true, floatingFilter: true,
            cellRenderer: (params: any) => `<a style="cursor: pointer; color: blue;" target="_blank">${params.value}</a>`
          },
          { field: "schoolName", filter: true, floatingFilter: false },
          { field: "designation", filter: true, floatingFilter: false },
          { field: "subject", filter: true, floatingFilter: false },
          { field: "employeeType", filter: true, floatingFilter: false },
          { field: "experienceYear", filter: true, floatingFilter: false },
          { field: "age", filter: true, floatingFilter: false },
          { field: "phoneNumber", filter: true, floatingFilter: false },
      //     {
      //       field: "documentCount", filter: true, floatingFilter: false,
      //       cellRenderer: (params: any) => {
      //         console.log("params",params)
      //         debugger
      //         `<span [class]="params.value?.icon ? 'doc-count' : ''">
      //   <i [class]="params.value?.icon"></i>${params.value?.text}
      // </span>`
      //       }
      //     },
      {
        field: "documentStatus", 
        filter: true, 
        floatingFilter: false,
        cellRenderer: (params: any) => {
          const iconClass = params.value?.icon || '';
          const text = params.value?.text || '0';
          const hasIconClass = iconClass ? 'doc-count' : '';
    
        
          return `
            <span class="${hasIconClass}">
              <i class="${iconClass}"></i> ${text}
            </span>`;
        }


      },
        ];
        console.log(this.teacherList,this.teacherTableColumns);
        this.updatePaginatedData();




      },
      (error) => {
        console.error('Error fetching teachers data:', error);
      }

    );


  }

  sortColumn(column: string) {
    if (this.sortedColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'asc';
    }

    this.teacherList = this.teacherList.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
      if (this.sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.teacherList.slice(start, end);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.teacherList.length) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  get totalPages() {
    return Math.ceil(this.teacherList.length / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }



  toggleFilterDropdown() {
    this.showFilterModal = !this.showFilterModal;
  }

  applyFilters() {
    const filters = this.filterForm.value;

    this.dataService.filterTeacherList(filters).subscribe((data: any) => {
      this.teacherList = data.map((teacher: TeacherDocument) => ({
        ...teacher,
        documentStatus: this.getDocumentStatus(teacher.documentCount, teacher.error)
      }));
      this.teacherTableRows = this.teacherList;
      this.updatePaginatedData();
      this.showFilterModal = false;
    });
  }

  resetFilter() {
    this.filterForm.reset({
      subjectFilter: [''],
      retiringInMonths: [],
      schoolNameFilter: [''],
      documents: [false],
      minExperienceYear: [0],
      maxExperienceYear: [100],
      // ExperienceYear: [],
      newRecruit: [false]
    });
    this.loadTeachersList();
  }



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
    this.teacherId = teacherId;
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    this.hoveredTeacherId = teacherId;
    if (teacherId && teacherData) {
      this.hoverTimeout = setTimeout(() => {
        this.selectedTeacher = teacherData; // Store the detailed info

        // this.showPopup = true;
        // this.updateMousePosition(event);

        this.dataService.getTeacherDetailPopUp(teacherId).subscribe(
          (data) => {
            this.selectedTeacher = data; // Store the detailed info
            console.log("teachres", data)
            if (this.selectedTeacher && teacherId) {
              this.showPopup = true;
              this.updateMousePosition(event);
            }
          },
          (error) => {
            console.error('Error fetching teacher details:', error);
          }
        );
      }, 300);
    }
  }

  onSchoolHover(schoolId: number, schoolData: any, event: MouseEvent): void {
    this.schoolId = schoolId
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    this.hoveredTeacherId = schoolId;
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
    this.schoolId = null;
    this.showSchoolPopup = false;
    this.selectedSchool = null;
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }

  onTeacherMouseOut(): void {
    this.teacherId = null;
    this.showPopup = false;
    this.selectedTeacher = null;
    this.hoveredTeacherId = null;

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
    if (this.apiUrl && this.selectedSchool?.photo && this.selectedSchool?.photo !== 'null') {
      result = this.apiUrl.replace(/\/+$/, '') + '/' + this.selectedSchool?.photo.replace(/^\/+/, '');
    }
    // If the result is an empty string, it will fallback to emptyImage in the template
    return result;
  }
  onCellClicked(event: any) {
    debugger

    const rowNode: any = event.node;
    const rowData = rowNode.data;
    let teacherId: number = rowData.teacherId

    if (event.colDef.field === "name") {
      this.router.navigate(['/teachers/view-teacher', teacherId])
    }

  }


}
