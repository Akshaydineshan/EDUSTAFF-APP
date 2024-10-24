import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Teacher, TeacherDocument, TransferRequest } from 'src/app/core/models/teacher/teacher';
import { DataService } from 'src/app/core/service/data/data.service';
interface PagonationConfig{
  pagination:boolean,
  paginationPageSize:number,
  paginationPageSizeSelector:number[]
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
  paginationConfig:PagonationConfig={pagination:true,paginationPageSize:10,paginationPageSizeSelector:[5,10,15,20,25,30,35]}
  paginatedData: any[] = [];
  displayColumns: string[] = ['teacherId', 'name', 'schoolName', 'designation', 'employeeType', 'experienceYear', 'age', 'phoneNumber', 'documentCount'];

  selectedTeacher: any = null;
  hoveredTeacherId: number | null = null;
  hoverTimeout: any;
  mouseX: number = 0;
  mouseY: number = 0;
  showPopup: boolean = false;
  showSchoolPopup: boolean = false;
  selectedSchool: any = null;

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
 
  constructor(private fb: FormBuilder, private dataService: DataService) {
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
    this.mouseX = event.clientX + 15;
    this.mouseY = event.clientY + 15;
  }

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
        this.teacherList = data.map((teacher: Teacher) => ({
          ...teacher,
          documentStatus: this.getDocumentStatus(teacher.documentCount, teacher.error)
        }));
        this.teacherTableRows = this.teacherList
        this.teacherTableColumns = [{ field: "teacherId", filter: true, floatingFilter: false },
        { field: "name", filter: true, floatingFilter: true },
        { field: "schoolName", filter: true, floatingFilter: false },
        { field: "designation", filter: true, floatingFilter: false },
        { field: "subject", filter: true, floatingFilter: false },
        { field: "employeeType", filter: true, floatingFilter: false },
        { field: "experienceYear", filter: true, floatingFilter: false },
        { field: "age", filter: true, floatingFilter: false },
        { field: "documentCount", filter: true, floatingFilter: false },
        { field: "phoneNumber", filter: true, floatingFilter: false },
      
        ];
        console.log(this.teacherList);
        // this.updatePaginatedData();
     
       


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

  onTeacherHover(teacherId: number, event: MouseEvent): void {
    this.teacherId = teacherId;
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    this.hoveredTeacherId = teacherId;
    if (teacherId) {
      this.hoverTimeout = setTimeout(() => {
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
      }, 300);
    }
  }

  onSchoolHover(schoolId: number, event: MouseEvent): void {
    this.schoolId = schoolId
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    this.hoveredTeacherId = schoolId;
    if (schoolId) {
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
      this.teacherTableRows=this.teacherList;
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

}
