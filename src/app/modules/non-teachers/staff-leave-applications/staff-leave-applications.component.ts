

import { DatePipe } from '@angular/common';
import { Component, HostListener, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/service/data/data.service';
import { minAndMaxDateValidator } from 'src/app/utils/validators/date-range-validator';
import { environment } from 'src/environments/environment';
import dayjs, { Dayjs } from 'dayjs';
import { forkJoin } from 'rxjs';
import { UserService } from 'src/app/core/service/user.service';
interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}
@Component({
  selector: 'app-staff-leave-applications',
  templateUrl: './staff-leave-applications.component.html',
  styleUrls: ['./staff-leave-applications.component.scss'],
  providers: [DatePipe],
})
export class StaffLeaveApplicationsComponent {
  apiUrl = environment.imageBaseUrl;
  isSidebarClosed = false;
  displayColumns: any[] = [{ headerName: 'Name', field: 'employeeName' }, { headerName: 'Start Date', field: 'fromDate' }, { headerName: 'End Date', field: 'toDate' }, { headerName: 'Applied Date', field: 'requestDate' }, { headerName: 'Reason', field: 'requestorComment' }, { headerName: 'Manager Comment', field: 'approverComment' }, { headerName: 'Status', field: 'status' }];
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



    // Filter Range Picker  
    minValue: any = 0;
    maxValue: any = 100;
    minSelected: any = 0;
    maxSelected: any = 100;
    filterForm!: FormGroup;
    showFilterModal: boolean = false;
    selected!: { startDate: Dayjs | null, endDate: Dayjs | null } | null;
    designationList: any = [];
    schoolList: any = []
  gridOptions: any;

  constructor(private dataService: DataService, private datePipe: DatePipe, private fb: FormBuilder, private toastr: ToastrService, private ngZone: NgZone, private router: Router,private userService:UserService) {
    this.filterForm = this.fb.group({
      designationFilter: [''],
      schoolNameFilter: [''],
      uniqueIdFilter: [''],

    });

  }

  ngOnInit(): void {
    this.loadLeaveRequestList()
    this.loadDropdownListData()
    // this.loadDropdownData()

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.leaveRequestForm = this.fb.group({

      documentUrl: [''],
      fromDate: ['', [ Validators.required]],
      toDate: ['', [ Validators.required]],
      comment: [''],
      reason: [''],
    
    })

  }
  dateChange() {
    const dateControl = this.leaveRequestForm.get('date');
  

    dateControl?.updateValueAndValidity();  // Manually trigger validation
  }


  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {

    if (!target.closest('.dropdown') && this.showFilterModal) {
      this.showFilterModal = false; // Close dropdown when clicking outside
    }

    const menuButtons = document.getElementsByClassName('menuButton');
    //  const menuButtonIs = document.getElementsByClassName('menuI');
    const menuPops = document.getElementsByClassName('menuPop');

    let clickedInsidePopup = false;
    let clickedOnButton = false
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

    this.dataService.getStaffLeaveRequestData().subscribe(
      (data: any) => {
        debugger
        this.leaveList = data;

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

          // ...(column.field === 'status' ?
          //   {
          //     cellRenderer: (params: any) => {
          //       if (true) {
          //         const div = document.createElement('div');
          //         div.style.display = "flex"
          //         div.style.justifyContent = "space-between"

                
          //         const divSub = document.createElement('div');
          //         divSub.style.height = "100%"


          //         const nameLink = document.createElement('a');
          //         nameLink.style.cursor = 'pointer';
                 
          //         nameLink.textContent = params.value;
          //         divSub.appendChild(nameLink)
          //         div.appendChild(divSub);

              

          //         if (params.value == 'Pending') {
          //           const plusButton = document.createElement('a');
          //           plusButton.style.marginLeft = '10px';
          //           plusButton.classList.add('menuButton')
          //           // plusButton.style.float = 'right';
          //           plusButton.innerHTML = '<i  style="color:black;" class="bi bi-three-dots-vertical"></i>';
          //           this.ngZone.run(() => {
          //             plusButton.addEventListener('click', (event: any) => {
          //               if (params.onStatusClick) {
          //                 params.onStatusClick(event, params);
          //               }
          //             });
          //           })

          //           div.appendChild(plusButton);

          //         } else {
          //           const plusButton = document.createElement('a');
          //           plusButton.style.marginLeft = '10px';
          //           plusButton.classList.add('menuButton')
                   
          //           plusButton.innerHTML = '<i  style="color:grey;" class="bi bi-three-dots-vertical"></i>';
          //           plusButton.addEventListener('click', (event: any) => {
                  
          //           });
          //           div.appendChild(plusButton);

          //         }


          //         return div;

          //       } else {
          //         return `<a style="cursor: pointer; " target="_blank">${params.value}</a>`
          //       }
          //     }



          //     ,
          //     cellRendererParams: {
          //       onStatusClick: (event: MouseEvent, params: any) => {
          //         this.statusMenuClick(event, params)
          //       },
          //     }
          //   } : {}
          // )
          ...(column.field === 'status' ?
            {
              cellRenderer: (params: any) => {
                if (true) {
                  let div = document.createElement('div');
                  div.style.margin = '9px 0px'
                  div.style.display = "flex";
                  div.style.flexDirection = "column";
                  div.style.alignItems = "center";

                  let divSub = document.createElement('div');
                  const nameLink = document.createElement('a');
                  nameLink.style.cursor = 'pointer';

                  if (params.value == 'Pending') {
                    nameLink.style.color = '#FFBE18';
                    divSub.style.display = "flex";
                    divSub.style.gap = "5px"
                    if (this.userService.hasRole('Manager')) {
                      let approveBtn = document.createElement('button');
                      approveBtn.classList.add('btn', 'btn-sm', 'btn-outline-success', 'status-btn');
                      approveBtn.innerHTML = '<i class="bi bi-check-lg  " style="font-size:16px"></i>Approve';
                      approveBtn.style.width = '86px';
                      approveBtn.style.paddingRight = "10px"
                      approveBtn.setAttribute('title','Approve Transfer Request')
  
  
  
                      let rejectBtn = document.createElement('button');
                      rejectBtn.classList.add('btn', 'btn-sm', 'btn-outline-danger', 'status-btn');
                      rejectBtn.innerHTML = '<i class="bi bi-x  " style="font-size:16px"></i> Reject';
                      rejectBtn.style.width = '80px';
                      rejectBtn.setAttribute('title','Reject Transfer Request')
  
                      divSub.appendChild(approveBtn);
                      divSub.appendChild(rejectBtn)
  
  
                      this.ngZone.run(() => {
                        approveBtn.addEventListener('click', (event: any) => {
                          if (params.onApproveClick) {
                            params.onApproveClick(event, params);
                          }
                        }),
                          rejectBtn.addEventListener('click', (event: any) => {
                            if (params.onRejectClick) {
                              params.onRejectClick(event, params);
                            }
                          });
  
                      })
                    }

                

                    // div.appendChild(plusButton);

                  } else {
                    if (params.value === 'Rejected') {
                      nameLink.style.color = '#FE2D53';
                    } else {
                      nameLink.style.color = '#31904E';
                    }

                  }

                  nameLink.textContent = params.value;
                  div.appendChild(nameLink)
                  div.appendChild(divSub);


                  return div;

                } else {
                  return `<a style="cursor: pointer; " target="_blank">${params.value}</a>`
                }
              }



              ,
              cellRendererParams: {
                onApproveClick: (event: MouseEvent, params: any) => {
                  this.approveClick(event, params)
                },
                onRejectClick: (event: MouseEvent, params: any) => {
                  this.rejectClick(event, params)
                },
              }, autoHeight: true, width: 250,
            } : {}
          )


        }));
         // Add the row styling based on the status
         this.gridOptions = {
          getRowStyle: (params: any) => {
            if (params.data.status === 'Rejected') {
              return { backgroundColor: '#F8113A08', color: 'black' };
            }else if(params.data.status === 'Approved'){
              return { backgroundColor: '#17F65A08', color: 'black' };
            }
            return null; // No styling for other statuses
          },
        };



      },
      (error: any) => {
        console.error('Error fetching school data:', error);
      }
    );

  }


  updateMenuMousePosition(event: MouseEvent): void {
  
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
    
    this.updateMenuMousePosition(event)

  }

  listClickFromMenuList(event: any) {
    // this.loadDropdownData()
    this.tableColorChange = true;
    this.leaveRequestForm.get("documentUrl")?.setValue(this.selectMenuRowData.documentpath)

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

  approveClick(event: any, params: any){
    this.selectMenuRowData = params.node.data
  
    this.tableColorChange = true;
    this.leaveRequestForm.get("documentUrl")?.setValue(this.selectMenuRowData.documentpath)
    this.leaveRequestForm.get("reason")?.setValue(this.selectMenuRowData.requestorComment)
    this.leaveRequestForm.get("fromDate")?.setValue(this.dataService.formatDateToLocal(this.selectMenuRowData.fromDate))
    this.leaveRequestForm.get("toDate")?.setValue(this.dataService.formatDateToLocal(this.selectMenuRowData.toDate))
    this.isRejectedClick = false;
    this.isLeavePopup = true;

  }

  rejectClick(event: any, params: any){
    this.selectMenuRowData = params.node.data

    this.tableColorChange = true;
    this.leaveRequestForm.get("documentUrl")?.setValue(this.selectMenuRowData.documentpath)
    this.leaveRequestForm.get("reason")?.setValue(this.selectMenuRowData.requestorComment)
    this.leaveRequestForm.get("fromDate")?.setValue(this.dataService.formatDateToLocal(this.selectMenuRowData.fromDate))
    this.leaveRequestForm.get("toDate")?.setValue(this.dataService.formatDateToLocal(this.selectMenuRowData.toDate))
    this.isRejectedClick = true;
    this.isLeavePopup = true;

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

            this.showSchoolPopup = true;
            this.updateMousePosition(event);
          },
          (error) => {
            console.error('Error fetching school details:', error);
          }
        );
      },this.dataService.hoverTime);
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


   // Filter related funtions
  


   loadDropdownListData() {


    forkJoin({
      designations: this.dataService.getAllDesignations(),
      schools: this.dataService.getSchoolList()
    }).subscribe({
      next: (results:any) => {
      
        this.designationList=results.designations
        this.schoolList = results.schools;
        this.schoolDropDownList = results.schools;

      },
      error: (error:any) => {
        console.error('Error loading dropdown data', error);

      },
            complete: () => {

      }
    });
    // this.dataService.getAllDesignations().subscribe({
    //   next: (data: any) => {
    //     console.log("designt", data)
    //     this.designationList = data;
    //   },
    //   error: (error: any) => {

    //   },
    //   complete: () => {

    //   }
    // })
  }
toggleFilterDropdown() {

  this.ngZone.run(() => {

    this.showFilterModal = !this.showFilterModal;
  })
}

applyFilters() {

  this.ngZone.run(() => {
    debugger

    const filters = this.filterForm.value;

    let filter: any = {
      "designationID": filters.designationFilter.designationID,
      "uniqueID": filters.uniqueIdFilter,
      "schoolID": filters.schoolNameFilter.schoolId,
      // "fromPromotionDate": this.dataService.formatDateToISO(this.selected?.['startDate']),
      // "toPromotionDate": this.dataService.formatDateToISO(this.selected?.['endDate'])


    }
  

    let url:string='LeaveRequest/NonTeacherLeaveRequestedfilter'
    this.dataService.filterInTeacherList(url,filter).subscribe((data: any) => {
      this.leaveList = data.map((teacher: any) => ({
        ...teacher,

      }));
      this.leaveTableRows = this.leaveList
      // this.teacherTableRows = this.teacherList;
      // this.updatePaginatedData();
      this.showFilterModal = false;
    });
  })

}
resetFilter() {

  this.ngZone.run(() => {
 
    this.selected = null;
    this.filterForm.reset({
      designationFilter: "",
      schoolNameFilter: "",
      uniqueIdFilter: "",
    })
    this.loadLeaveRequestList();
    this.showFilterModal = false
  })
}
}


