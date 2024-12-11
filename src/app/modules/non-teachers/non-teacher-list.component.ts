import { DataService } from './../../core/service/data/data.service';
import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { NonTeacherService } from './non-teacher.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { minAndMaxDateValidator } from 'src/app/utils/validators/date-range-validator';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

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
  displayColumns: string[] = ['name', 'schoolName', 'designation', 'experienceYear', 'age', 'phoneNumber', 'documentCount'];
  nonTeacherTableRows: any[] = [] 
  nonTeacherTableColumns: any[] = []
  nonTeacherList: any[] = [];
  selectedTeacher: any;
  hoverTimeout: any;
  showPopup: boolean = false;
  mouseY: number = 0;
  mouseX: number = 0;
  mouseMenuX: number = 0;
  mouseMenuY: number = 0;
  selectedSchool: any;
  showSchoolPopup: boolean = false;
  transferRequestForm!: FormGroup;
  leaveRequestForm!:FormGroup;


  isMenuVisible: boolean = false;
  selectMenuRowData: any;

  submitted: boolean = false;
  menuListItems: any[] = [
    { name: 'Transfer Request', icon: "assets/icons/transfer-request.jpg", value: 'transferRequest',icons:'fa-solid fa-arrow-right-arrow-left' },
    { name: 'Leave request', icon: "assets/icons/leave.png", value: 'leaveRequest',icons:'bi bi-hourglass-split' }
  ]
  isTransferPopup: boolean = false;
  minDate: any;


  
  // Popup Multi Select dropdown 
  schoolDropDownList!: any;
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
  tableColorChange: boolean=false;
  isLeavePopup: boolean = false;
  file: any;

  constructor(private NonTeacherService: NonTeacherService, private router: Router, private dataService: DataService, private fb: FormBuilder, private toastr: ToastrService, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.getNonTeacherListData()
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    // this.loadDropdownData()


   
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


  }
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    debugger

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



    // if (!target.closest('.dropdown') && this.showFilterModal) {
    //   this.showFilterModal = false; 
    // }
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

  onFirstDropdownChange(selectedItem: any): void {

  }
  getNonTeacherListData() {

    this.NonTeacherService.fetchNonTeachersData().subscribe({
      next: (data: any) => {
        this.nonTeacherList = data.map((teacher: any) => ({
          ...teacher,
          documentStatus: this.getDocumentStatus(teacher.documentCount, teacher.error)
        }));
        this.nonTeacherTableRows = this.nonTeacherList
        console.log("Non teacher data list", this.nonTeacherList)

        this.nonTeacherTableColumns = this.displayColumns.map((column: any) => {
          return {
            field: column,
            filter: true,
            floatingFilter: column === 'name',
            ...(column == 'name' ? {
              cellRenderer: (params: any) => {
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

                this.ngZone.run(()=>{
                  nameLink.addEventListener('click', (event) => {
                    debugger
                    if (params.onNameClick) {
                      params.onNameClick(event, params);
  
                    }
                  });
                })
                
                this.ngZone.run(()=>{
                  divSub.addEventListener('mouseover', (event) => {
                    debugger
  
                    if (params.onNameHover) {
                      params.onNameHover(event, params);
  
                    }
                  });
                })
                
                this.ngZone.run(()=>{
                  divSub.addEventListener('mouseout', (event) => {
                    debugger
  
                    if (params.onNameHover) {
                      params.onNameHoverOut(event, params);
  
                    }
                  });
                })
                
                this.ngZone.run(()=>{
                  divSub.addEventListener('mouseleave', (event) => {
                    debugger
  
                    if (params.onNameHover) {
                      params.onNameHoverOut(event, params);
  
                    }
                  });
                })
               

              

                // Create another anchor element for the plus button
                const plusButton = document.createElement('a');
                plusButton.classList.add("menuButton")


                // plusButton.style.float = 'right';
                plusButton.innerHTML = '<i  style="color:black" class="bi bi-three-dots-vertical"></i>';
                plusButton.addEventListener('click', (event) => {
                  if (params.onPlusButtonClick) {
                    params.onPlusButtonClick(event, params);
                  }
                });

                plusButton.addEventListener('mouseleave', (event) => {
                  if (params.onPlusButtonHoverout) {
                    params.onPlusButtonHoverout(event, params);
                  }
                });

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
                  this.nameColumnHover(params)
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
            } : {}),
            ... (column === 'schoolName' ? {
              cellRenderer: (params: any) => `<a style="cursor: pointer; color:  #246CC1;" target="_blank">${params.value}</a>`

            } : {}),
            ... (column === 'experienceYear' ? { valueFormatter: (params: any) => params.value <= 0 ? 'New Joiner': `${params.value}` } : {}),
            ... (column === 'age' ? { valueFormatter: (params: any) => params.value <= 0 ? 'N/A': `${params.value}` } : {}),

            ... (column === 'schoolName' ? { width: 300 } : {}),
            ...(column === "phoneNumber" ? { valueFormatter: (params: any) => `+91 ${params.value}`, } : {})

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


  loadDropdownData() {

    forkJoin({
      schools: this.dataService.getSchoolList()

    }).subscribe({
      next: (results: any) => {
        console.log("result", results)

        this.schoolDropDownList = results.schools.filter((item: any) => this.selectMenuRowData.schoolId !== item.schoolId);
      },
      error: (error) => {
        console.error('Error loading dropdown data', error);

      },
    });
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
      }, 450);
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
      }, 450);
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
      this.ngZone.run(()=>{
        this.router.navigate(['/non-teachers/view', teacherId])
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
      this.ngZone.run(()=>{
        this.router.navigate(['/schools/view', schoolId])
      })
     
    }

  }
  nameColumnHover(event: any) {

    const rowNode: any = event.node;
    const rowData = rowNode.data;
    if (event.colDef.field === "name") {
      this.showSchoolPopup = false
      this.onTeacherHover(rowData.teacherId, rowData, event.event)
    }
  }
  updateMenuMousePosition(event: MouseEvent): void {

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
    this.showPopup = false;
    this.showSchoolPopup = false
    this.isTransferPopup = false
    this.isMenuVisible = true
    this.selectMenuRowData = params.node.data
    this.updateMenuMousePosition(event)
  }
  menuBtnhoverOut(event: any, params: any) {


  }
  // listClickFromMenuList(event: any) {
  //   this.showPopup = false;
  //   this.showSchoolPopup = false;


  //   if (event.value === 'transferRequest') {
  //     this.loadDropdownData()
  //     this.transferRequestForm.get("fromSchool")?.patchValue(this.selectMenuRowData.schoolName)
  //     this.isTransferPopup = event.clicked
  //     this.isMenuVisible = false;
  //     console.log("afert")
  //   }

  // }
  listClickFromMenuList(event: any) {
    debugger
    console.log("EVENT->", event)
    this.showPopup = false;
    this.showSchoolPopup = false;

    this.tableColorChange = true
    if (event.value === 'transferRequest') {
      this.loadDropdownData()
      this.isTransferPopup = event.clicked
      this.transferRequestForm.get("fromSchool")?.patchValue(this.selectMenuRowData.schoolName)
      this.isMenuVisible = false
    } else if (event.value === 'leaveRequest') {
      this.isLeavePopup = event.clicked
      this.isMenuVisible = false
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

        console.log("payload",payload)
  
  
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
    resetTransferRequest(){
      this.transferRequestForm.reset({
        fromSchool:this.selectMenuRowData.schoolName,
        toSchoolPriority1: "",
        toSchoolPriority2: "",
        toSchoolPriority3: "",
        documentUrl: "",
        date: "",
        comment: ""
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
          "DocumentID": formValue.document.documentID
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

  closeTransferPopup() {
    this.transferRequestForm.reset()
    this.submitted = false
    this.isTransferPopup = false
    this.isMenuVisible = false
    this.tableColorChange = false
  }
  closeLeavePopup() {
    // this.leaveRequestForm.reset()
    this.submitted = false
    this.isLeavePopup = false
    this.isMenuVisible = false
    this.tableColorChange = false
  }
  overlayClick() {
    this.showPopup = false;
    this.showSchoolPopup = false;

  }

  navigateToAddPage() {
    this.ngZone.run(() => {
      this.router.navigate(['/non-teachers/add']);
    })
  }


    // UploadFile Related funs
    onCertificateUpload(event: any): void {
      debugger
      const file = event.target.files[0];
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
            const educations = this.leaveRequestForm.get('document') as FormControl;
            educations.patchValue(response)
          },
          (error) => {
            console.error('Error uploading file', error);
          }
        );
  
  
      } else {
        console.error('No file selected');
      }
    }
}
