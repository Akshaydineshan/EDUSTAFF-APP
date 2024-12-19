import { ColDef } from 'ag-grid-community';
import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Teacher, TeacherDocument, TransferRequest } from 'src/app/core/models/teacher/teacher';
import { DataService } from 'src/app/core/service/data/data.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TeacherTableNameSectionComponent } from 'src/app/shared/components/teacher-table-name-section/teacher-table-name-section.component';
import { forkJoin } from 'rxjs';
import { minAndMaxDateValidator } from 'src/app/utils/validators/date-range-validator';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { getFileName, getTruncatedFileName } from 'src/app/utils/utilsHelper/utilsHelperFunctions';

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
export class TeacherListComponent implements OnInit, AfterViewInit {
  @ViewChild('transferModal') transferModal!: ElementRef;
  isSidebarClosed = false;

  //  Table related variables
  teacherList: any[] = [];
  teacherTableRows: any[] = []
  teacherTableColumns: any[] = []
  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] }
  paginatedData: any[] = [];
  displayColumns: string[] = ['name', 'schoolName', 'designation', 'experienceYear', 'age', 'phoneNumber', 'documentCount'];

  // Table Column Hover Related
  selectedTeacher: any = null;
  hoveredTeacherId: number | null = null;
  hoverTimeout: any;
  mouseX: number = 0;
  mouseY: number = 0;
  showPopup: boolean = false;
  showSchoolPopup: boolean = false;
  selectedSchool: any = null;

  // Table Column MoreBtn Click Related(transfer and leave)
  transferRequestForm!: FormGroup
  leaveRequestForm!: FormGroup
  mouseMenuX: number = 0;
  mouseMenuY: number = 0;
  menuListItems: any[] = [
    { name: 'Transfer Request', icon: "assets/icons/transfer-request.jpg", value: 'transferRequest', icons: 'fa-solid fa-arrow-right-arrow-left' },
    { name: 'Leave request', icon: "assets/icons/leave.png", value: 'leaveRequest', icons: 'bi bi-hourglass-split' }
  ]
  isTransferPopup: boolean = false;
  isLeavePopup: boolean = false;
  isMenuVisible: boolean = false;
  selectMenuRowData: any;
  tableColorChange: boolean = false;
  submitted: boolean = false;



  getTruncatedFileName = getTruncatedFileName
  getFileName=getFileName

  // Filter Range Picker 
  minValue: any = 0;
  maxValue: any = 100;
  minSelected: any = 0;
  maxSelected: any = 100;
  filterForm: FormGroup;
  showFilterModal = false;


  // Popup Multi Select dropdown 
  schoolDropDownList: any;
  selectedSchoolPriority1!: any
  schoolDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'schoolId',
    textField: 'schoolName',
    selectAllText: 'Select All',
    closeDropDownOnSelection: true,
    unSelectAllText: 'UnSelect All',

    itemsShowLimit: 3,
    allowSearchFilter: true,

  };

  file: any;

  apiUrl = environment.imageBaseUrl;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  sortedColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
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
  minDate: any;
  priorityOneSelectDropdown!: any[];
  priorityTwoSelectDropdown!: any[];
  priorityThreeSelectDropdown!: any[];
  fileSize: any;
  fileName: any;


  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router, private toastr: ToastrService, private ngZone: NgZone) {
    this.filterForm = this.fb.group({
      subjectFilter: [''],
      retiringInMonths: [],
      schoolNameFilter: [''],
      uniqueIdFilter: [''],
      documents: [false],
      minExperienceYear: [0],
      maxExperienceYear: [100],
      // ExperienceYear: [],
      newRecruit: [false]
    });
  }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.loadTeachersList();
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.transferRequestForm = this.fb.group({
      fromSchool: [{ value: '', }],
      toSchoolPriority1: ['', Validators.required],
      toSchoolPriority2: ['', Validators.required],
      toSchoolPriority3: ['', Validators.required],
      documentUrl: ['', Validators.required],
      date: ['', [minAndMaxDateValidator(this.minDate, true, false), Validators.required]],
      comment: ['']
    })

    this.leaveRequestForm = this.fb.group({
      fromDate: ['', [minAndMaxDateValidator(this.minDate, true, false), Validators.required]],
      toDate: ['', [minAndMaxDateValidator(this.minDate, true, false), Validators.required]],
      comment: [''],
      documentUrl: ['',],
      document: ['',]
    })

    // this.loadDropdownData()
    // this.updateSliderTrack();
    // this.filterForm.valueChanges.subscribe(() => {
    //   this.updateSliderTrack();
    // });


    // Update dropdowns dynamically
    this.transferRequestForm.get('toSchoolPriority1')?.valueChanges.subscribe(() => {

      this.updateDropdowns();
    });

    this.transferRequestForm.get('toSchoolPriority2')?.valueChanges.subscribe(() => {
      this.updateDropdowns();
    });

    this.transferRequestForm.get('toSchoolPriority3')?.valueChanges.subscribe(() => {
      this.updateDropdowns();
    });



  }

  // For Hide Menu Popup click Outside the popup
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    debugger
    if (!target.closest('.dropdown') && this.showFilterModal) {
      this.showFilterModal = false; // Close dropdown when clicking outside
    }

    const menuButtons = document.getElementsByClassName('menuButton');
    //  const menuButtonIs = document.getElementsByClassName('menuI');
    const menuPops = document.getElementsByClassName('menuPop');

    let clickedInsidePopup = false;
    let clickedOnButton = false;
    //  let clickedOnButtonI = false;

    for (let i = 0; i < menuPops.length; i++) {
      if (menuPops[i].contains(target)) {
        clickedInsidePopup = true;
        break;
      }
    }

    for (let i = 0; i < menuButtons.length; i++) {
      if (menuButtons[i].contains(target)) {
        clickedOnButton = true;
        break;
      }
    }

    // for (let i = 0; i < menuButtonIs.length; i++) {
    //   if (menuButtonIs[i].contains(target)) {
    //     clickedOnButtonI = true;
    //     break;
    //   }
    // }
    // console.log(clickedOnButtonI)

    if (!clickedOnButton && !clickedInsidePopup) {
      this.isMenuVisible = false; // Hide the popup if clicked outside
    }




  }

  onMenuAction(action: string, teacher: any) {
  }

  // Filter Range Related Fun
  validateRange(event: any, changed: 'min' | 'max'): void {
    if (changed === 'min' && this.minSelected >= this.maxSelected) {
      event.preventDefault()
      this.minSelected = this.maxSelected - 1;
    } else if (changed === 'max' && this.maxSelected <= this.minSelected) {
      event.preventDefault()
      this.maxSelected = this.minSelected + 1;
    }
  }

  // Update Menu position hover column
  @HostListener('mousemove', ['$event'])
  updateMousePosition(event: MouseEvent): void {

    this.ngZone.run(() => {
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
      if (this.mouseY + popupHeight > window.innerHeight - 20) {
        this.mouseY = event.clientY - popupHeight - 30; // Position above the mouse
      }
    })




  }


  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent) {
  //   const filterButton = document.getElementById('filterButton');
  //   const filterDropdown = document.getElementById('filterDropdown');

  //   if (filterButton && filterDropdown) {
  //     if (!filterButton.contains(event.target as Node) && !filterDropdown.contains(event.target as Node)) {
  //       this.showFilterModal = false;
  //     }
  //   }
  // }

  submitTransfer(): void {
    if (this.transferRequest.school && this.transferRequest.position && this.transferRequest.date) {
      console.log(this.transferRequest);
      this.resetForm(this.transferRequest);
    } else {
      console.log('Form is invalid');
    }
  }


  // Transfer Request Submit
  transferRequestFormSubmit() {
    this.submitted = true
    console.log("transferForm", this.transferRequestForm)

    if (this.transferRequestForm.valid) {
      console.log("transfer form", this.transferRequestForm.value)
      let formValue: any = this.transferRequestForm.value;
      let employee: any = this.selectMenuRowData
      let payload: any = {
        "employeeID": employee.teacherId,
        "toSchoolIDOne": formValue.toSchoolPriority1[0].schoolId,
        "toSchoolIDTwo": formValue.toSchoolPriority2[0].schoolId,
        "toSchoolIDThree": formValue.toSchoolPriority3[0].schoolId,
        "transferDate": this.dataService.formatDateToISO(formValue.date),
        // "approvalDate": this.dataService.formatDateToISO(formValue.date),
        // "requestedByID": null,
        // "approvedByID": null,
        "RequestorComment": formValue.comment,
        "filePath": formValue.documentUrl
      }


      this.dataService.createTransferRequest(payload).subscribe({
        next: (response: any) => {
          console.log(response, response)
          if (response.status == 200) {
            this.submitted = false
            this.isTransferPopup = false;
            this.tableColorChange = false;
            this.toastr.success('Transfer Requested !', 'Success', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-left',
              timeOut: 4500,
            });
            this.transferRequestForm.reset()

          }

        },
        error: (error: any) => {
          if (error.status === 409) {
            this.toastr.warning('Failed ! This employee has an existing incomplete request', 'Warning', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-left',
              timeOut: 4500,
            });
            // this.isTransferPopup = false;
          }


        },
        complete: () => {
          this.transferRequestForm.reset()
          this.isTransferPopup = false;
          this.tableColorChange = false;

        }
      })
    } else {

      console.log("invalid form")
    }




  }
  resetTransferRequest() {
    this.transferRequestForm.reset({
      fromSchool: this.selectMenuRowData.schoolName,
      toSchoolPriority1: "",
      toSchoolPriority2: "",
      toSchoolPriority3: "",
      documentUrl: "",
      date: "",
      comment: ""
    });
  }
  resetLeaveRequestFormSubmit() {
    this.leaveRequestForm.reset({
      fromDate: "",
      toDate: "",
      comment: "",
      documentUrl: "",
      document: ""
      // })
    });
  }

  leaveRequestFormSubmit() {

    this.submitted = true
    console.log("leaveForm", this.leaveRequestForm)

    if (this.leaveRequestForm.valid) {

      let formValue: any = this.leaveRequestForm.value;
      let employee: any = this.selectMenuRowData
      let payload: any = {
        "employeeID": employee.teacherId,
        "fromDate": this.dataService.formatDateToISO(formValue.fromDate),
        "toDate": this.dataService.formatDateToISO(formValue.toDate),
        "RequestorComment": formValue.comment,
        "DocumentID": formValue.document?.documentID
      }



      this.dataService.createLeaveRequest(payload).subscribe({
        next: (response: any) => {
          console.log(response, response)
          if (response.status == 200) {
            this.submitted = false
            this.isLeavePopup = false;
            this.tableColorChange = false;
            this.toastr.success('Leave Requested !', 'Success', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-left',
              timeOut: 4500,
            });
            this.leaveRequestForm.reset()

          }

        },
        error: (error: any) => {
          if (error.status === 409) {
            this.toastr.warning('Failed ! This employee has an existing incomplete request', 'Warning', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-left',
              timeOut: 4500,
            });
            // this.isTransferPopup = false;
          }


        },
        complete: () => {
          this.leaveRequestForm.reset()
          this.isLeavePopup = false;
          this.tableColorChange = false;

        }
      })
    } else {

      console.log("invalid form")
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


  // Getting Teacher Table Data
  loadTeachersList(): void {
    debugger

    this.dataService.getTeachersData().subscribe(
      (data) => {
        debugger
        this.teacherList = data.map((teacher: Teacher) => ({
          ...teacher,
          documentStatus: this.getDocumentStatus(teacher.documentCount, teacher.error)
        }));


        this.teacherTableRows = this.teacherList
        this.teacherTableColumns = [
          {
            field: "name", filter: true, floatingFilter: true, width: 180,
            cellRenderer: (params: any) => {
              console.log("params-", params)
              const div = document.createElement('div');
              div.style.display = "flex"
              div.style.justifyContent = "space-between"


              // Create anchor element for the name
              const divSub = document.createElement('div');
              divSub.style.height = "100%"
              divSub.style.width = "75%";
              divSub.style.overflow = "hidden";
              divSub.style.textOverflow = "ellipsis";




              const nameLink = document.createElement('a');
              nameLink.style.cursor = 'pointer';
              nameLink.style.color = '#246CC1';

              nameLink.textContent = params.value;


              this.ngZone.run(() => {
                divSub.addEventListener('mouseover', (event) => {
                  debugger

                  if (params.onNameHover) {
                    params.onNameHover(event, params);

                  }
                });
              })

              this.ngZone.run(() => {
                divSub.addEventListener('mouseout', (event) => {
                  debugger

                  if (params.onNameHover) {
                    params.onNameHoverOut(event, params);

                  }
                });

              })

              this.ngZone.run(() => {
                divSub.addEventListener('mouseleave', (event) => {
                  debugger

                  if (params.onNameHover) {
                    params.onNameHoverOut(event, params);

                  }
                });

              })

              this.ngZone.run(() => {
                nameLink.addEventListener('click', (event) => {
                  debugger
                  if (params.onNameClick) {
                    params.onNameClick(event, params);

                  }
                });

              })




              // Create another anchor element for the plus button
              const plusButton = document.createElement('a');
              plusButton.classList.add("menuButton")


              // plusButton.style.float = 'right';
              plusButton.innerHTML = '<i  style="color:black" class="bi bi-three-dots-vertical"></i>';
              this.ngZone.run(() => {
                plusButton.addEventListener('click', (event) => {
                  if (params.onPlusButtonClick) {
                    params.onPlusButtonClick(event, params);
                  }
                });
              })
              this.ngZone.run(() => {
                plusButton.addEventListener('mouseleave', (event) => {
                  if (params.onPlusButtonHoverout) {
                    params.onPlusButtonHoverout(event, params);
                  }
                });
              })

              // Append the elements to the div
              divSub.appendChild(nameLink)
              div.appendChild(divSub);
              div.appendChild(plusButton);

              return div;
            },
            cellRendererParams: {
              onNameClick: (event: MouseEvent, params: any) => {
                this.onCellClicked(params)
              },
              onNameHover: (event: MouseEvent, params: any) => {
                this.nameColumnHover(params, event)
              },
              onNameHoverOut: (event: MouseEvent, params: any) => {
                this.rowMouseHoverOut(params)
              },

              onPlusButtonClick: (event: MouseEvent, params: any) => {
                this.menuBtnEventFunction(event, params)

              },
              onPlusButtonHoverout: (event: MouseEvent, params: any) => {
                this.menuBtnhoverOut(event, params)
              },
            }


          },
          {
            field: "schoolName", filter: true, floatingFilter: false, width: 300,
            cellRenderer: (params: any) => `<a style="cursor: pointer; color: #246CC1;" target="_blank">${params.value}</a>`
          },
          { field: "designation", filter: true, floatingFilter: false },
          { field: "subject", filter: true, floatingFilter: false },

          { field: "experienceYear", filter: true, floatingFilter: false, valueFormatter: (params: any) => params.value <= 0 ? 'New Joiner' : `${params.value}`, },
          { field: "age", filter: true, floatingFilter: false, valueFormatter: (params: any) => params.value <= 0 ? 'N/A' : `${params.value}` },
          {
            field: "phoneNumber", filter: true, floatingFilter: false,
            valueFormatter: (params: any) => `+91 ${params.value}`,
          },
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
        console.log(this.teacherList, this.teacherTableColumns);
        this.updatePaginatedData();




      },
      (error) => {
        console.error('Error fetching teachers data:', error);
      }

    );


  }

  loadDropdownData() {

    forkJoin({
      schools: this.dataService.getSchoolList()

    }).subscribe({
      next: (results: any) => {
        console.log("result", results)

        this.schoolDropDownList = results.schools.filter((item: any) => this.selectMenuRowData.schoolId !== item.schoolId);

        this.priorityOneSelectDropdown = [...this.schoolDropDownList];
        this.priorityTwoSelectDropdown = [...this.schoolDropDownList];
        this.priorityThreeSelectDropdown = [...this.schoolDropDownList];
      },
      error: (error) => {
        console.error('Error loading dropdown data', error);

      },
    });
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
    console.log("filter click")
    this.ngZone.run(() => {
      // this.minSelected=0;
      // this.maxSelected=100;
      // this.filterForm.reset()
      this.showFilterModal = !this.showFilterModal;
    })

  }

  onFirstDropdownChange(selectedItem: any): void {

  }

  // Filter Related
  applyFilters() {
    debugger

    this.ngZone.run(() => {
      debugger
      const filters = this.filterForm.value;
      filters.minExperienceYear = this.minSelected;
      filters.maxExperienceYear = this.maxSelected

      this.dataService.filterTeacherList(filters).subscribe((data: any) => {
        this.teacherList = data.map((teacher: TeacherDocument) => ({
          ...teacher,
          documentStatus: this.getDocumentStatus(teacher.documentCount, teacher.error)
        }));
        this.teacherTableRows = this.teacherList;
        this.updatePaginatedData();
        this.showFilterModal = false;
      });
    })

  }
  resetFilter() {
    this.minSelected = 0;
    this.maxSelected = 100
    this.ngZone.run(() => {
      this.filterForm.reset({
        subjectFilter: "",
        retiringInMonths: "",
        schoolNameFilter: "",
        uniqueIdFilter: "",
        documents: false,
        minExperienceYear: 0,
        maxExperienceYear: 100,
        // ExperienceYear: [],
        newRecruit: false
      });
      this.loadTeachersList();
      this.showFilterModal = false
    })
  }


  navigateToAddPage() {
    this.ngZone.run(() => {
      this.router.navigate(['/teachers/add-teacher']);
    })
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

  // Table Column Hover Retaed Funs

  onTeacherHover(teacherId: number, teacherData: any, event: MouseEvent): void {

    this.selectedTeacher = null
    this.teacherId = teacherId;
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    this.hoveredTeacherId = teacherId;
    if (teacherId && teacherData) {

      this.hoverTimeout = setTimeout(() => {
        this.selectedTeacher = teacherData.teacherPopUpDTO;
        this.showPopup = true;
        this.updateMousePosition(event);

        // this.dataService.getTeacherDetailPopUp(teacherId).subscribe(
        //   (data) => {
        //    // Store the detailed info
        //     console.log("teachres", data)
        //     if (this.selectedTeacher && teacherId) {
        //       this.showPopup = true;
        //       this.updateMousePosition(event);

        //     }
        //   },
        //   (error) => {
        //     console.error('Error fetching teacher details:', error);
        //   }
        // );
      }, 450);
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
      }, 450);
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


  nameColumnHover(event: any, ev: any) {
    this.isMenuVisible = false;
    const rowNode: any = event.node;
    const rowData = rowNode.data;
    if (event.colDef.field === "name") {
      this.showSchoolPopup = false
      this.onTeacherHover(rowData.teacherId, rowData, ev)
    }
  }

  rowMouseHover(event: any) {
    this.isMenuVisible = false;
    const rowNode: any = event.node;
    const rowData = rowNode.data;
    if (event.colDef.field === "schoolName") {
      this.showPopup = false
      this.onSchoolHover(rowData.schoolId, rowData, event.event)

    }
  }
  rowMouseHoverOut(event: any) {

    this.showPopup = false
    // this.isMenuVisible = false
    debugger;
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

  // Table Cell Clicked Related Fun
  onCellClicked(event: any) {

    const rowNode: any = event.node;
    const rowData = rowNode.data;

    if (event.colDef.field === "name") {
      let teacherId: number = rowData.teacherId
      this.ngZone.run(() => {
        this.router.navigate(['/teachers/view-teacher', teacherId])
      })

    } else if (event.colDef.field === "schoolName") {
      let schoolId: number = rowData.schoolId
      this.router.navigate(['/schools/view', schoolId])
    }

  }

  onCellClick(event: any) {
    const rowNode: any = event.node;
    const rowData = rowNode.data;
    if (event.colDef.field === "schoolName") {
      let schoolId: number = rowData.schoolId
      this.ngZone.run(() => {
        this.router.navigate(['/schools/view', schoolId])
      })
    }

  }



  // CEll Menu Btn Related Funs
  updateMenuMousePosition(event: MouseEvent): void {
    debugger;
    console.log("eventRR", event.clientX, event.clientY)
    const offset = 13; // Offset for positioning
    this.mouseMenuX = event.clientX + offset;
    this.mouseMenuY = event.clientY;
    const popupWidth = 200; // Assume a fixed width for the popup
    const popupHeight = 100; // Assume a fixed height for the popup

    // Check right edge
    if (this.mouseMenuX + popupWidth > window.innerWidth) {

      this.mouseMenuX = window.innerWidth - popupWidth - offset; // Position left
    }

    // Check bottom edge
    if (this.mouseMenuY + popupHeight > window.innerHeight) {
      this.mouseMenuY = event.clientY - popupHeight; // Position above the mouse
    }


  }

  menuBtnEventFunction(event: any, params: any) {
    debugger
    this.showPopup = false;
    this.showSchoolPopup = false
    this.isTransferPopup = false
    this.isMenuVisible = true
    this.selectMenuRowData = params.node.data


    this.updateMenuMousePosition(event)
  }

  menuBtnhoverOut(event: any, params: any) {

  }
  listClickFromMenuList(event: any) {

    this.showPopup = false;
    this.showSchoolPopup = false;

    this.tableColorChange = true
    if (event.value === 'transferRequest') {
      debugger
      this.loadDropdownData()
      this.isTransferPopup = event.clicked
      this.transferRequestForm.get("fromSchool")?.patchValue(this.selectMenuRowData.schoolName)
      this.isMenuVisible = false
    } else if (event.value === 'leaveRequest') {
      this.isMenuVisible = false
      this.isLeavePopup = event.clicked

    }

  }
  closeTransferPopup() {
    this.transferRequestForm.reset()
    this.submitted = false
    this.isTransferPopup = false
    this.isMenuVisible = false
    this.tableColorChange = false
  }
  closeLeavePopup() {
    this.leaveRequestForm.reset()
    this.submitted = false
    this.isLeavePopup = false
    this.isMenuVisible = false
    this.tableColorChange = false
  }




  overlayClick() {
    this.showPopup = false;
    this.showSchoolPopup = false;

  }



  updateDropdowns(): void {
    debugger
    const selectedPriority1 = this.transferRequestForm.get('toSchoolPriority1')?.value?.[0];
    const selectedPriority2 = this.transferRequestForm.get('toSchoolPriority2')?.value?.[0];
    const selectedPriority3 = this.transferRequestForm.get('toSchoolPriority3')?.value?.[0];

    const selectedIds = [
      selectedPriority1?.schoolId,
      selectedPriority2?.schoolId,
      selectedPriority3?.schoolId
    ].filter((id) => id !== undefined); // Remove undefined values

    console.log("array", selectedIds)

    // Update filtered lists dynamically
    this.priorityOneSelectDropdown = this.schoolDropDownList.filter(
      (school: any) => !selectedIds.includes(school.schoolId) || school.schoolId === selectedPriority1?.schoolId
    );

    this.priorityTwoSelectDropdown = this.schoolDropDownList.filter(
      (school: any) => !selectedIds.includes(school.schoolId) || school.schoolId === selectedPriority2?.schoolId
    );

    this.priorityThreeSelectDropdown = this.schoolDropDownList.filter(
      (school: any) => !selectedIds.includes(school.schoolId) || school.schoolId === selectedPriority3?.schoolId
    );
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  
  // UploadFile Related funs
  onCertificateUpload(event: any): void {

    this.fileName = event.target.files[0]?.name;
    let totalBytes = event.target.files[0]?.size;
    if (totalBytes < 1000000) {
      this.fileSize = Math.floor(totalBytes / 1000) + 'KB';
    } else {
      this.fileSize = Math.floor(totalBytes / 1000000) + 'MB';
    }

    const file = event.target.files[0];
    if (file) {
      this.file = file;
    }
    this.uploadFile()
  }
  onCertificateUploadDragAndDrop(event: any): void {
    this.fileName = event.dataTransfer.files[0]?.name;
    let totalBytes =event.dataTransfer.files[0]?.size;
    if (totalBytes < 1000000) {
      this.fileSize = Math.floor(totalBytes / 1000) + 'KB';
    } else {
      this.fileSize = Math.floor(totalBytes / 1000000) + 'MB';
    }
  
    const file = event.dataTransfer.files[0];
    if (file) {
      this.file = file;
    }
    this.uploadFile()
  }

  uploadFile(): void {
    debugger
    if (this.file) {

      let file = this.file
      this.dataService.uploadDocument(file).subscribe(
        (response) => {
          console.log('File uploaded successfully', response);
          const document = this.leaveRequestForm.get('document') as FormControl;
          document.patchValue(response)
        },
        (error) => {
          console.error('Error uploading file', error);
        }
      );


    } else {
      console.error('No file selected');
    }
  }

  // From drag and drop
  onDropSuccess(event: any) {
    event.preventDefault();
    console.log("file", event)

    this.onCertificateUploadDragAndDrop(event);

  }


  get getDocument() {
    let result = '';

    let image = this.leaveRequestForm.get('document')?.value?.documentName;
    console.log("image", image)
    if (this.leaveRequestForm.get('documentUrl')?.value == 'No Photo assigned' || null || '') image = ""

    if (this.apiUrl && image) {
      result = this.apiUrl.replace(/\/+$/, '') + '/' + image.replace(/^\/+/, '');
    }
    console.log("result", result)

    return result;
  }

  transform(url: string): string {
    const fileTypeIcons: { [key: string]: string } = {
      pdf: "../../../../assets/icons/pdf-ic.png",
      jpg: "../../../../assets/icons/img-ic.png",
      jpeg: "../../../../assets/icons/img-ic.png",
      png: "../../../../assets/icons/docs-ic.png",
      doc: "../../../../assets/icons/docs-ic.png",
      docx: "../../../../assets/icons/docs-ic.png",
      default: "../../../../assets/icons/docs-ic.png",
    };
    const extension = url.split('.').pop()?.toLowerCase() || '';
    let result: any = fileTypeIcons[extension] || fileTypeIcons['default'];

    return result;
  }
  removeLeaveApplicationDocument() {
    this.leaveRequestForm.get("document")?.setValue("")
  }



}
