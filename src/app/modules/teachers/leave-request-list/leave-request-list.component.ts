import { DatePipe } from '@angular/common';
import { Component, HostListener, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/service/data/data.service';
import { minAndMaxDateValidator } from 'src/app/utils/validators/date-range-validator';
import { environment } from 'src/environments/environment';
interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}
@Component({
  selector: 'app-leave-request-list',
  templateUrl: './leave-request-list.component.html',
  styleUrls: ['./leave-request-list.component.scss'],
  providers: [DatePipe]
})
export class LeaveRequestListComponent {
  apiUrl = environment.imageBaseUrl;
  isSidebarClosed = false;
  displayColumns: any[] = [{ headerName: 'name', field: 'employeeName' }, { headerName: 'Start Date', field: 'fromDate' }, { headerName: 'End Date', field: 'toDate' }, { headerName: 'Applied Date', field: 'requestDate' }, { headerName: 'Reason', field: 'requestorComment' }, { headerName: 'ManagerComment', field: 'approverComment' }, { headerName: 'Status', field: 'status' }];
  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] }
  leaveList: any[] = [];
  leaveTableRows: any;
  leaveTableColumns!: { field: string; filter: boolean; floatingFilter: boolean }[];

  mouseX!: number
  mouseY!: number
  hoveredEmployee: any;
  showPopup!: boolean
  hoverTimeout!: any;
  showSchoolPopup: boolean = false;
  selectedSchool: any;

  isMenuVisible: boolean = false;
  selectMenuRowData: any;
  mouseMenuX: number = 0;
  mouseMenuY: number = 0;
  menuListItems: any[] = [
    { name: 'Approve', icon: "assets/icons/approve.png", value: 'approve' },
    { name: 'Reject', icon: "assets/icons/reject.png", value: 'reject' }
  ]
  isTransferPopup: boolean = false;

  leaveRequestForm!: FormGroup
  submitted!: boolean;
  schoolDropDownList: any;
  isRejectedClick: boolean = false;
  minDate: any;
  toSchoolPr1: any;
  toSchoolPr2: any;
  toSchoolPr3: any;

  selectedSchoolPriority1!: any
  schoolDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'schoolId',
    textField: 'schoolName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',

    itemsShowLimit: 1,
    allowSearchFilter: true,

  };
  schoolDropDownListFilter: any[] = [];
  showSecondDropdown: boolean = false;
  isLeavePopup: boolean = false;
  tableColorChange: boolean = false;

  constructor(private dataService: DataService, private datePipe: DatePipe, private fb: FormBuilder, private toastr: ToastrService, private ngZone: NgZone, private router: Router) {


  }

  ngOnInit(): void {
    this.loadLeaveRequestList()
    // this.loadDropdownData()

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.leaveRequestForm = this.fb.group({

      documentUrl: [''],
      fromDate: ['', [minAndMaxDateValidator(this.minDate, true, false), Validators.required]],
      toDate: ['', [minAndMaxDateValidator(this.minDate, true, false), Validators.required]],
      comment: [''],
    
    })

  }
  dateChange() {
    const dateControl = this.leaveRequestForm.get('date');
    console.log("control", dateControl)

    dateControl?.updateValueAndValidity();  // Manually trigger validation
  }


  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    debugger

    const menuButtons = document.getElementsByClassName('menuButton');
    //  const menuButtonIs = document.getElementsByClassName('menuI');
    const menuPops = document.getElementsByClassName('menuPop');

    let clickedInsidePopup = false;
    let clickedOnButton = menuButtons[0].contains(target);
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

  get getDocument() {
    let result = '';

     let image=this.leaveRequestForm.get('documentUrl')?.value;
    if(this.leaveRequestForm.get('documentUrl')?.value =='No Photo assigned' || null || '') image=""

    if (this.apiUrl && image ) {
      result = this.apiUrl.replace(/\/+$/, '') + '/' + image.replace(/^\/+/, '');
    }
    console.log("result",result)
    // If the result is an empty string, it will fallback to emptyImage in the template
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
    let result:any= fileTypeIcons[extension] || fileTypeIcons['default'];
  
    return result;
  }

  documentClick(url:any){
    window.open(url,"_blank")
  }

  // loadDropdownData() {

  //   let filterSchool: any[] = [{ id: this.selectMenuRowData.toSchoolID_One, name: "Priority 1" },
  //   { id: this.selectMenuRowData.toSchoolID_Two, name: "Priority 2" },
  //   { id: this.selectMenuRowData.toSchoolID_Three, name: "Priority 3" },
  //   ]
  //   forkJoin({
  //     schools: this.dataService.getSchoolList()

  //   }).subscribe({
  //     next: (results: any) => {
  //       console.log("school list", results)
  //       this.schoolDropDownList = results.schools;
  //       const updatedList = [];
  //       filterSchool.forEach((item: any) => {
  //         const school = results.schools.find((school: any) => school.schoolId == item.id);
  //         if (school) {
  //           updatedList.push({
  //             schoolId: school.schoolId,
  //             schoolName: `${school.schoolName} (${item.name})`
  //           });
  //         }
  //       })
  //       updatedList.push({ schoolId: 0, schoolName: "Choose Other school" });
  //       this.schoolDropDownListFilter = updatedList;


  //     },
  //     error: (error) => {
  //       console.error('Error loading dropdown data', error);

  //     },
  //   });
  // }

  // onFirstDropdownChange(selectedItem: any): void {
  //   if (selectedItem && selectedItem.schoolId === 0) {
  //     this.showSecondDropdown = true; 
  //     this.transferRequestForm.get('toSchool')?.setValue(null)

  //   } else {
  //     this.showSecondDropdown = false; 

  //   }
  // }



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

  loadLeaveRequestList() {

    this.dataService.getLeaveRequestData().subscribe(
      (data: any) => {
        debugger
        this.leaveList = data;
        console.log("leave list data", this.leaveList);
        this.leaveTableRows = this.leaveList
        this.leaveTableColumns = this.displayColumns.map((column) => ({
          headerName: column.headerName,
         
          valueFormatter: column.field === 'requestDate' || column.field === 'approvalDate' || column.field === 'fromDate' || column.field === 'toDate'
            ? (params: any) => this.datePipe.transform(params.value, 'dd/MM/yyyy')
            : undefined,
          field: column.field,
          filter: true,
          floatingFilter: column.field === 'employeeName', // For example, only these columns have floating filters
          ... (column.field === 'employeeName' ? {
            cellRenderer: (params: any) => params.value ? `<a style="cursor: pointer;  color: #246CC1;" target="_blank">${params.value}</a>` : `<a style="cursor: pointer;  " target="_blank">N/A</a>`,
            width: 220
          } : {}),
          ... (column.field === 'requestorComment' || column.field === "approverComment" ? {
            cellRenderer: (params: any) => params.value ? `${params.value}` : `<a style="cursor: pointer;color:grey;  " target="_blank">No Value</a>`,
            width: 220
          } : {}),

          ...(column.field === 'status' ?
            {
              cellRenderer: (params: any) => {
                if (true) {
                  const div = document.createElement('div');
                  div.style.display = "flex"
                  div.style.justifyContent = "space-between"

                  // Create anchor element for the name
                  const divSub = document.createElement('div');
                  divSub.style.height = "100%"


                  const nameLink = document.createElement('a');
                  nameLink.style.cursor = 'pointer';
                  // nameLink.style.color = '#246CC1';

                  nameLink.textContent = params.value;
                  divSub.appendChild(nameLink)
                  div.appendChild(divSub);

                  // Create another anchor element for the plus button

                  if (params.value == 'Pending') {
                    const plusButton = document.createElement('a');
                    plusButton.style.marginLeft = '10px';
                    plusButton.classList.add('menuButton')
                    // plusButton.style.float = 'right';
                    plusButton.innerHTML = '<i  style="color:black;" class="bi bi-three-dots-vertical"></i>';
                    this.ngZone.run(() => {
                      plusButton.addEventListener('click', (event: any) => {
                        if (params.onStatusClick) {
                          params.onStatusClick(event, params);
                        }
                      });
                    })

                    div.appendChild(plusButton);

                  } else {
                    const plusButton = document.createElement('a');
                    plusButton.style.marginLeft = '10px';
                    plusButton.classList.add('menuButton')
                    // plusButton.style.float = 'right';
                    plusButton.innerHTML = '<i  style="color:grey;" class="bi bi-three-dots-vertical"></i>';
                    plusButton.addEventListener('click', (event: any) => {
                      // if (params.onStatusClick) {
                      //   params.onStatusClick(event, params);
                      // }
                    });
                    div.appendChild(plusButton);

                  }




                  // Append the elements to the div




                  return div;

                } else {
                  return `<a style="cursor: pointer; " target="_blank">${params.value}</a>`
                }
              }



              ,
              cellRendererParams: {
                onStatusClick: (event: MouseEvent, params: any) => {
                  this.statusMenuClick(event, params)
                },
              }
            } : {}
          )

        }));



      },
      (error: any) => {
        console.error('Error fetching school data:', error);
      }
    );

  }


  updateMenuMousePosition(event: MouseEvent): void {
    debugger;
    console.log("eventRR", event.clientX, event.clientY)
    const offset = 13; // Offset for positioning
    this.mouseMenuX = event.clientX + offset - 226;
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


  statusMenuClick(event: any, params: any) {

    this.isMenuVisible = true
    this.selectMenuRowData = params.node.data
    this.toSchoolPr1 = this.selectMenuRowData.toSchoolOneName;
    this.toSchoolPr2 = this.selectMenuRowData.toSchoolTwoName;
    this.toSchoolPr3 = this.selectMenuRowData.toSchoolThreeName;
    console.log("selectMenuRowData", this.selectMenuRowData)


    this.updateMenuMousePosition(event)

  }

  listClickFromMenuList(event: any) {
    // this.loadDropdownData()
    this.tableColorChange = true;
    this.leaveRequestForm.get("documentUrl")?.setValue(this.selectMenuRowData.documentpath)
    console.log("trans",this.leaveRequestForm.value,this.selectMenuRowData.documentpath)

    if (event.value === 'approve') {
      this.leaveRequestForm.get("fromDate")?.setValue(this.dataService.formatDateToLocal(this.selectMenuRowData.fromDate))
      this.leaveRequestForm.get("toDate")?.setValue(this.dataService.formatDateToLocal(this.selectMenuRowData.toDate))
      this.isRejectedClick = false;
      this.isLeavePopup = event.clicked
      this.isMenuVisible = false;
    } else if (event.value === 'reject') {
      this.leaveRequestForm.get("fromDate")?.setValue(this.dataService.formatDateToLocal(this.selectMenuRowData.fromDate))
      this.leaveRequestForm.get("toDate")?.setValue(this.dataService.formatDateToLocal(this.selectMenuRowData.toDate))
      this.isRejectedClick = true;
      this.isLeavePopup = event.clicked
      this.isMenuVisible = false
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


  onTeacherHover(teacherId: number, teacherData: any, event: MouseEvent): void {
    console.log("teacherId", teacherId, teacherData)

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
      }, 450);
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
    } else if (event.colDef.field === "fromSchoolName") {
      this.onSchoolHover(rowData.fromSchoolID, rowData, event.event)
    }
    else if (event.colDef.field === "toApprovedSchoolName") {
      this.onSchoolHover(rowData.toApprovedSchoolID, rowData, event.event)
    }
  }
  rowMouseHoverOut(event: any) {
    // if (event.colDef.field === "principalName") {
    this.onTeacherMouseOut()
    // } else if (event.colDef.field === "name") {
    this.onSchoolMouseOut()

    // }

  }



  leaveRequestFormSubmit() {
    this.submitted = true

    if (this.leaveRequestForm.valid) {
      console.log("transfer form", this.leaveRequestForm.value)
      let formValue: any = this.leaveRequestForm.value;
      let employee: any = this.selectMenuRowData
      if (!this.isRejectedClick) {
        let payload: any = {

          "ApproverComment": formValue.comment,

        }
        this.dataService.approveLeaveRequest(payload, this.selectMenuRowData.leaveRequestID).subscribe({
          next: (response: any) => {
            if (response.status == 200) {
              this.submitted = false
              this.isLeavePopup = false;
              this.tableColorChange = false;
              this.toastr.success('Leave Approved !', 'Success', {
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-top-left',
                timeOut: 4500,
              });
              this.leaveRequestForm.reset()
              this.loadLeaveRequestList()

            }

          },
          error: (error: any) => {

          },
          complete: () => {
            this.isLeavePopup = false;
            this.tableColorChange = false;

          }
        })

      } else {
        let payload: any = {
          "ApproverComment": formValue.comment,
        }

        this.dataService.rejectLeaveRequest(payload, this.selectMenuRowData.leaveRequestID).subscribe({
          next: (response: any) => {
            if (response.status == 200) {
              this.submitted = false
              this.isLeavePopup = false;
              this.tableColorChange = false;
              this.toastr.success('Transfer Rejected !', 'Success', {
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-top-left',
                timeOut: 4500,
              });
              this.leaveRequestForm.reset()
              this.loadLeaveRequestList()

            }

          },
          error: (error: any) => {
            this.toastr.error('Leave Reject !', 'Failed', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-left',
              timeOut: 4500,
            });

          },
          complete: () => {
            this.isLeavePopup = false;
            this.tableColorChange = false;


          }
        })

      }

    } else {

      console.log("invalid form", this.leaveRequestForm)
    }
  }

  onCellClicked(event: any) {

    const rowNode: any = event.node;
    const rowData = rowNode.data;

    if (event.colDef.field === "employeeName") {
      let teacherId: number = rowData.employeeID

      this.ngZone.run(() => {
        this.router.navigate(['/teachers/view-teacher', teacherId])
      })

    } else if (event.colDef.field === "fromSchoolName") {
      let schoolId: number = rowData.fromSchoolID
      this.router.navigate(['/schools/view', schoolId])
    } else if (event.colDef.field === "toSchoolName") {
      let schoolId: number = rowData.toSchoolID
      this.router.navigate(['/schools/view', schoolId])
    }

  }

  closeLeavePopup() {
    this.leaveRequestForm.reset()
    this.submitted = false;
    this.isLeavePopup = false;
    this.isMenuVisible = false;
    this.tableColorChange = false;
  }
  overlayClick() {
    this.showPopup = false;
    this.showSchoolPopup = false;

  }
}
