import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { DataService } from 'src/app/core/service/data/data.service';
import { minAndMaxDateValidator } from 'src/app/utils/validators/date-range-validator';
import dayjs, { Dayjs } from 'dayjs';
interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}
@Component({
  selector: 'app-transfer-request-list',
  templateUrl: './transfer-request-list.component.html',
  styleUrls: ['./transfer-request-list.component.scss'],
  providers: [DatePipe]
})
export class TransferRequestListComponent implements OnInit {

  isSidebarClosed = false;
  // { headerName: 'Requested School', field: 'toSchoolOneName' },
  displayColumns: any[] = [{ headerName: 'name', field: 'employeeName' }, { headerName: 'Current School', field: 'fromSchoolName' },{ headerName: 'Requested School', field: 'toSchoolOneName' },  { headerName: 'To School', field: 'toApprovedSchoolName' }, { headerName: 'Requested Date', field: 'requestDate' }, { headerName: 'With Efffect From', field: 'transferDate' }, { headerName: 'Comment', field: 'requestorComment' }, { headerName: 'Status', field: 'status' }];
  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] }
  transferList: any[] = [];
  transferTableRows: any;
  transferTableColumns!: { field: string; filter: boolean; floatingFilter: boolean }[];

  mouseX!: number
  mouseY!: number
  hoveredEmployee: any;
  showPopup!: boolean;
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

  transferRequestForm!: FormGroup
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
  tableColorChange: boolean = false;


  // Filter Range Picker  
  minValue: any = 0;
  maxValue: any = 100;
  minSelected: any = 0;
  maxSelected: any = 100;
  filterForm!: FormGroup;
  showFilterModal: boolean = false;
  selected!: { startDate: Dayjs | null, endDate: Dayjs | null } | null;
  selectedWithEffectFrom!: { startDate: Dayjs | null, endDate: Dayjs | null } | null;
  designationList: any = [];
  schoolList: any = []
  gridOptions: any

  constructor(private dataService: DataService, private datePipe: DatePipe, private fb: FormBuilder, private toastr: ToastrService, private ngZone: NgZone, private router: Router,) {

    this.filterForm = this.fb.group({
      designationFilter: [''],
      schoolNameFilter: [''],
      uniqueIdFilter: [''],

    });
  }

  ngOnInit(): void {
    this.loadtransferRequestList()
    // this.loadDropdownData()
    this.loadDropdownListData()

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.transferRequestForm = this.fb.group({
      fromSchool: [''],
      toSchool: ['',],
      documentUrl: ['', Validators.required],
      date: ['', [minAndMaxDateValidator(this.minDate, true, false)]],
      comment: ['']
    })

  }
  dateChange() {
    const dateControl = this.transferRequestForm.get('date');
    console.log("control", dateControl)

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
    console.log("menubn", menuButtons)

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

  loadDropdownData() {
    // let filterSchool:number[]=[this.selectMenuRowData.toSchoolID_One,this.selectMenuRowData.toSchoolID_Two,this.selectMenuRowData.toSchoolID_Three]
    let filterSchool: any[] = [{ id: this.selectMenuRowData.toSchoolID_One, name: "Priority 1" },
    { id: this.selectMenuRowData.toSchoolID_Two, name: "Priority 2" },
    { id: this.selectMenuRowData.toSchoolID_Three, name: "Priority 3" },
    ]
    forkJoin({
      schools: this.dataService.getSchoolList()

    }).subscribe({
      next: (results: any) => {
        console.log("school list", results)
        this.schoolDropDownList = results.schools.filter((school: any) =>
          !filterSchool.some((filter) => filter.id === school.schoolId)
        ).filter((item: any) => item.schoolId !== this.selectMenuRowData.fromSchoolID
        )

        console.log("filt", this.schoolDropDownList)

        const updatedList = [];
        filterSchool.forEach((item: any) => {
          const school = results.schools.find((school: any) => school.schoolId == item.id);
          if (school) {
            updatedList.push({
              schoolId: school.schoolId,
              schoolName: `${school.schoolName} (${item.name})`
            });
          }
        })
        updatedList.push({ schoolId: 0, schoolName: "Choose Other school" });
        this.schoolDropDownListFilter = updatedList;


      },
      error: (error) => {
        console.error('Error loading dropdown data', error);

      },
    });
  }

  onFirstDropdownChange(selectedItem: any): void {
    if (selectedItem && selectedItem.schoolId === 0) {
      this.showSecondDropdown = true; // Show the second dropdown
      this.transferRequestForm.get('toSchool')?.setValue(null)

    } else {
      this.showSecondDropdown = false; // Hide the second dropdown
      // this.transferRequestForm.get('toSchool')?.setValue(null); // Reset the second dropdown value
    }
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

  loadtransferRequestList() {

    this.dataService.getTransferRequestData().subscribe(
      (data: any) => {
        debugger
        this.transferList = data;
        console.log("school list data", this.transferList);
        this.transferTableRows = this.transferList
        this.transferTableColumns = this.displayColumns.map((column) => ({
          headerName: column.headerName,
          valueFormatter: column.field === 'requestDate' || column.field === 'approvalDate' || column.field === 'transferDate'
            ? (params: any) => this.datePipe.transform(params.value, 'dd/MM/yyyy')
            : undefined,
          field: column.field,
          filter: true,
          floatingFilter: column.field === 'employeeName', // For example, only these columns have floating filters
          ... (column.field === 'employeeName' || column.field === "toApprovedSchoolName" || column.field === "fromSchoolName" ? {
            cellRenderer: (params: any) => params.value ? `<a style="cursor: pointer;  color: #246CC1;" target="_blank">${params.value}</a>` : `<a style="cursor: pointer;  " target="_blank">N/A</a>`,
            width: 220
          } : {}),

          ...(column.field === "toSchoolOneName" ? {
            cellRenderer: (params: any) => {
              // Combine fields styled as inline-block elements
              if (params.data.status === 'Pending' ||true) {
                const { toSchoolOneName, toSchoolTwoName, toSchoolThreeName } = params.data;
                return `
               <div style="display: block; margin: 0; padding: 0;">
              <span style="display: block; border-bottom: 1px solid  #b8b1b1; padding: 0; margin: 0;" >
                <span style="margin-right: 5px;">1)</span>${toSchoolOneName}
              </span>
              <span style="display: block; border-bottom: 1px solid  #b8b1b1; padding: 0; margin: 0;">
                <span style="margin-right: 5px;">2)</span>${toSchoolTwoName}
              </span>
              <span style="display: block; padding: 0; margin: 0;">
                <span style="margin-right: 5px;">3)</span>${toSchoolThreeName}
              </span>
            </div>
  
                    `;
              } else {
                return ''
              }

            }, autoHeight: true, width: 250, cellStyle: {
              padding: '0px',
            },
          } : {}),


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


  // statusMenuClick(event: any, params: any) {

  //   this.isMenuVisible = true
  //   this.selectMenuRowData = params.node.data
  //   this.toSchoolPr1 = this.selectMenuRowData.toSchoolOneName;
  //   this.toSchoolPr2 = this.selectMenuRowData.toSchoolTwoName;
  //   this.toSchoolPr3 = this.selectMenuRowData.toSchoolThreeName;
  //   console.log("selectMenuRowData", this.selectMenuRowData)


  //   this.updateMenuMousePosition(event)

  // }

  approveClick(event: any, params: any) {
    this.selectMenuRowData = params.node.data
    this.toSchoolPr1 = this.selectMenuRowData.toSchoolOneName;
    this.toSchoolPr2 = this.selectMenuRowData.toSchoolTwoName;
    this.toSchoolPr3 = this.selectMenuRowData.toSchoolThreeName;
    this.loadDropdownData()
    const dateControl = this.transferRequestForm.get('date');
    this.showSecondDropdown = false;
    this.tableColorChange = true;
    this.isRejectedClick = false;

    this.transferRequestForm.get('toSchool')?.setValidators(Validators.required)
    this.transferRequestForm.get('date')?.setValue(this.dataService.formatDateToLocal(this.selectMenuRowData.transferDate))
    dateControl?.setValidators([minAndMaxDateValidator(this.minDate, true, false), Validators.required]);

    this.transferRequestForm.get("fromSchool")?.setValue(this.selectMenuRowData.fromSchoolName)
    // this.transferRequestForm.get("toSchool")?.setValue([
    //   this.schoolDropDownList.find((item:any)=> item.schoolId ===this.selectMenuRowData.toSchoolID )
    // ])
    this.transferRequestForm.get("documentUrl")?.setValue(this.selectMenuRowData.filePath)
    this.isTransferPopup = true;
    this.isMenuVisible = false

  }

  rejectClick(event: any, params: any) {
    this.selectMenuRowData = params.node.data
    this.toSchoolPr1 = this.selectMenuRowData.toSchoolOneName;
    this.toSchoolPr2 = this.selectMenuRowData.toSchoolTwoName;
    this.toSchoolPr3 = this.selectMenuRowData.toSchoolThreeName;
    this.loadDropdownData()
    const dateControl = this.transferRequestForm.get('date');
    this.showSecondDropdown = false;
    this.tableColorChange = true;

    dateControl?.clearValidators();
    this.isRejectedClick = true;
    this.transferRequestForm.get("fromSchool")?.setValue(this.selectMenuRowData.fromSchoolName)
    // this.transferRequestForm.get("toSchool")?.setValue(this.selectMenuRowData.toSchoolName)
    this.transferRequestForm.get('toSchool')?.clearValidators()
    this.transferRequestForm.get("documentUrl")?.setValue(this.selectMenuRowData.filePath)
    this.isTransferPopup = true
    this.isMenuVisible = false
  }

  listClickFromMenuList(event: any) {
    this.loadDropdownData()
    const dateControl = this.transferRequestForm.get('date');
    this.showSecondDropdown = false;
    this.tableColorChange = true;
    if (event.value === 'approve') {
      this.isRejectedClick = false;
      this.transferRequestForm.get('toSchool')?.setValidators(Validators.required)
      this.transferRequestForm.get('date')?.setValue(this.dataService.formatDateToLocal(this.selectMenuRowData.transferDate))
      dateControl?.setValidators([minAndMaxDateValidator(this.minDate, true, false), Validators.required]);

      this.transferRequestForm.get("fromSchool")?.setValue(this.selectMenuRowData.fromSchoolName)

      this.transferRequestForm.get("documentUrl")?.setValue(this.selectMenuRowData.filePath)
      this.isTransferPopup = event.clicked
      this.isMenuVisible = false
    } else if (event.value === 'reject') {
      dateControl?.clearValidators();
      this.isRejectedClick = true;
      this.transferRequestForm.get("fromSchool")?.setValue(this.selectMenuRowData.fromSchoolName)

      this.transferRequestForm.get('toSchool')?.clearValidators()
      this.transferRequestForm.get("documentUrl")?.setValue(this.selectMenuRowData.filePath)
      this.isTransferPopup = event.clicked
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

  transferRequestFormSubmit() {
    this.submitted = true

    if (this.transferRequestForm.valid) {
      console.log("transfer form", this.transferRequestForm.value)
      let formValue: any = this.transferRequestForm.value;
      let employee: any = this.selectMenuRowData
      if (!this.isRejectedClick) {
        let payload: any = {
          "toSchoolIDApproved": formValue.toSchool[0].schoolId,
          "transferDate": formValue.date,
          "ApproverComment": formValue.comment,
          "filePath": formValue.documentUrl
        }
        this.dataService.approveTransferRequest(payload, this.selectMenuRowData.transferRequestID).subscribe({
          next: (response: any) => {
            if (response.status == 200) {
              this.submitted = false
              this.isTransferPopup = false;
              this.tableColorChange = false;
              this.toastr.success('Transfer Approved !', 'Success', {
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-top-left',
                timeOut: 4500,
              });
              this.transferRequestForm.reset()
              this.loadtransferRequestList()

            }

          },
          error: (error: any) => {

          },
          complete: () => {
            this.isTransferPopup = false;
            this.tableColorChange = false;

          }
        })

      } else {
        let payload: any = {
          "ApproverComment": formValue.comment,
        }

        this.dataService.rejectTransferRequest(payload, this.selectMenuRowData.transferRequestID).subscribe({
          next: (response: any) => {
            if (response.status == 200) {
              this.submitted = false
              this.isTransferPopup = false;
              this.tableColorChange = false;
              this.toastr.success('Transfer Rejected !', 'Success', {
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-top-left',
                timeOut: 4500,
              });
              this.transferRequestForm.reset()
              this.loadtransferRequestList()

            }

          },
          error: (error: any) => {

          },
          complete: () => {
            this.isTransferPopup = false;
            this.tableColorChange = false;

          }
        })

      }

    } else {

      console.log("invalid form", this.transferRequestForm)
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
      let schoolId: number = rowData.toApprovedSchoolID
      this.router.navigate(['/schools/view', schoolId])
    }

  }
  closeTransferPopup() {
    this.transferRequestForm.reset()
    this.submitted = false;
    this.isTransferPopup = false;
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
      next: (results: any) => {

        this.designationList = results.designations
        this.schoolList = results.schools;

      },
      error: (error: any) => {
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
    console.log("filter click")
    this.ngZone.run(() => {

      this.showFilterModal = !this.showFilterModal;
    })
  }

  applyFilters() {

    this.ngZone.run(() => {
      debugger
      console.log("isSelected", this.selected)
      const filters = this.filterForm.value;

      let filter: any = {
        "designationID": filters.designationFilter.designationID,
        "uniqueID": filters.uniqueIdFilter,
        "schoolID": filters.schoolNameFilter.schoolId,
        "fromTransferDate": this.dataService.formatDateToISO(this.selected?.['startDate']),
        "toTransferDate": this.dataService.formatDateToISO(this.selected?.['endDate']),
        // "fromWithEffectDate": this.dataService.formatDateToISO(this.selectedWithEffectFrom?.['startDate']),
        // "toWithEffectDate": this.dataService.formatDateToISO(this.selectedWithEffectFrom?.['endDate'])


      }
      console.log("payload", filter)

      let url: string = 'TransferRequest/TeacherTransferRequestfilter'
      this.dataService.filterInTeacherList(url, filter).subscribe((data: any) => {
        this.transferList = data.map((teacher: any) => ({
          ...teacher,

        }));
        this.transferTableRows = this.transferList
        // this.teacherTableRows = this.teacherList;
        // this.updatePaginatedData();
        this.showFilterModal = false;
      });
    })

  }
  resetFilter() {

    this.ngZone.run(() => {

      this.selected = null;
      this.selectedWithEffectFrom = null;
      this.filterForm.reset({
        designationFilter: "",
        schoolNameFilter: "",
        uniqueIdFilter: "",
      })
      this.loadtransferRequestList();
      this.showFilterModal = false
    })
  }


}
