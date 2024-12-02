import { DatePipe } from '@angular/common';
import { Component, HostListener, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { DataService } from 'src/app/core/service/data/data.service';
import { minAndMaxDateValidator } from 'src/app/utils/validators/date-range-validator';
interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}

@Component({
  selector: 'app-promotion-request',
  templateUrl: './promotion-request.component.html',
  styleUrls: ['./promotion-request.component.scss'],
  providers: [DatePipe]
})
export class PromotionRequestComponent {



  isSidebarClosed = false;
  displayColumns: any[] = [{ headerName: 'name', field: 'employeeName' }, { headerName: 'From School', field: 'promotedFromSchool' }, { headerName: 'From Designation', field: 'promotedFromDesignation' },{ headerName: 'To Designation', field: 'promotedToDesignation' },{ headerName: 'Requested Date', field: 'requestDate' },{ headerName: 'Promotion Date', field: 'promotionDate' }, { headerName: 'Comment', field: 'requestorCommand' }, { headerName: 'Status', field: 'status' }];
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
  isPromotionPopup: boolean=false;

  promotionRequestForm!: FormGroup
  submitted!: boolean;
 
  isRejectedClick: boolean = false;
  minDate: any;
  toSchoolPr1:any;
  toSchoolPr2:any;
  toSchoolPr3:any;

 
  schoolDropDownListFilter: any[] = [];
  schoolDropDownList: any;
  schoolDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'schoolId',
    textField: 'schoolName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',

    itemsShowLimit: 1,
    allowSearchFilter: true,

  };
 
  showSecondDropdown: boolean = false;

  tableColorChange:boolean=false;

  constructor(private dataService: DataService, private datePipe: DatePipe, private fb: FormBuilder, private toastr: ToastrService, private ngZone: NgZone, private router: Router) {


  }

  ngOnInit(): void {
    this.loadPromotionRequestList()
    this.loadDropdownData()

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.promotionRequestForm = this.fb.group({
      fromSchool:[''],
      toSchool:['',[Validators.required]],
      fromDesignation:[''],
      toDesignation:[''],
      documentUrl: [''],
      promotionDate:['',[Validators.required]],
      comment: ['']
    })


  }
  dateChange() {
    const dateControl = this.promotionRequestForm.get('date');
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

  loadDropdownData() {
   
 
    forkJoin({
      schools: this.dataService.getSchoolList()

    }).subscribe({
      next: (results: any) => {
        console.log("school list", results)
        this.schoolDropDownList = results.schools;
       
        


      },
      error: (error) => {
        console.error('Error loading dropdown data', error);

      },
    });
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

  loadPromotionRequestList() {

    this.dataService.getPromotionRequestData().subscribe(
      (data: any) => {
        debugger
        this.transferList = data
        // [{employeeName:"dummy",fromSchoolName:"dummy",fromDesignation:"dummy",toDesignation:"dummy",requestDate:"dummy",status:"Pending"}];
        console.log("school list data", this.transferList);
        this.transferTableRows = this.transferList
        this.transferTableColumns = this.displayColumns.map((column) => ({
          headerName: column.headerName,
          // valueFormatter: column.field === 'requestDate' || column.field === 'approvalDate' || column.field === 'transferDate'
          //   ? (params: any) => this.datePipe.transform(params.value, 'dd/MM/yyyy')
          //   : undefined,
          field: column.field,
          filter: true,
          floatingFilter: column.field === 'employeeName', // For example, only these columns have floating filters
          ... (column.field === 'employeeName' ? {
            cellRenderer: (params: any) => params.value ? `<a style="cursor: pointer;  color: #246CC1;" target="_blank">${params.value}</a>` : `<a style="cursor: pointer;  " target="_blank">N/A</a>`,
            width: 220
          } : {}),
          valueFormatter: column.field === 'requestDate'  || column.field === 'promotionDate'
          ? (params: any) => this.datePipe.transform(params.value, 'dd/MM/yyyy')
          : undefined,

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
    this.toSchoolPr1=this.selectMenuRowData.toSchoolOneName;
    this.toSchoolPr2=this.selectMenuRowData.toSchoolTwoName;
    this.toSchoolPr3=this.selectMenuRowData.toSchoolThreeName;
    console.log("selectMenuRowData", this.selectMenuRowData)


    this.updateMenuMousePosition(event)

  }

  listClickFromMenuList(event: any) {
    // this.loadDropdownData()
     this.tableColorChange=true;
     this.promotionRequestForm.get("fromSchool")?.setValue(this.selectMenuRowData.promotedFromSchool)
     this.promotionRequestForm.get("fromDesignation")?.setValue(this.selectMenuRowData.promotedFromDesignation)
     this.promotionRequestForm.get("toDesignation")?.setValue(this.selectMenuRowData.promotedToDesignation)
     this.promotionRequestForm.get("toSchool")?.setValue([this.schoolDropDownList.find((item:any)=>item.schoolId === this.selectMenuRowData.fromSchoolID )])
     this.promotionRequestForm.get("documentUrl")?.setValue(this.selectMenuRowData.filePath)

   
    if (event.value === 'approve') {
      this.isRejectedClick = false;
     

      this.isPromotionPopup = event.clicked
      this.isMenuVisible = false
    } else if (event.value === 'reject') {
  
      this.isRejectedClick = true;
     
      this.isPromotionPopup = event.clicked
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
      }, 200);
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



  promotionRequestFormSubmit() {
    this.submitted = true

    if (this.promotionRequestForm.valid) {
      console.log("promotion  form", this.promotionRequestForm.value)
      let formValue: any = this.promotionRequestForm.value;
      let employee: any = this.selectMenuRowData
      if (!this.isRejectedClick) {
        let payload: any = {
          "promotionDate":this.dataService.formatDateToISO(formValue.promotionDate),
          "approverComment": formValue.comment,
          "approvedSchoolID": formValue.toSchool[0].schoolId
         
        }
        this.dataService.approvePromotionRequest(payload, this.selectMenuRowData.promotionID).subscribe({
          next: (response: any) => {
            if (response.status == 200) {
              this.submitted = false
              this.isTransferPopup = false;
              this.toastr.success('Transfer Approved !', 'Success', {
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-top-left',
                timeOut: 4500,
              });
              this.promotionRequestForm.reset()
              this.loadPromotionRequestList()

            }

          },
          error: (error: any) => {

          },
          complete: () => {
            this.promotionRequestForm.reset()
            this.tableColorChange=false;
            this.isPromotionPopup=false


          }
        })

      } else {
        let payload: any = {
          "approverComment": formValue.comment,
          
        }

        this.dataService.rejectPromotionRequest(payload, this.selectMenuRowData.promotionID).subscribe({
          next: (response: any) => {
            if (response.status == 200) {
              this.submitted = false
              this.isTransferPopup = false;
              this.toastr.success('Transfer Rejected !', 'Success', {
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-top-left',
                timeOut: 4500,
              });
              this.promotionRequestForm.reset()
              this.loadPromotionRequestList()

            }

          },
          error: (error: any) => {

          },
          complete: () => {
            this.promotionRequestForm.reset()
            this.tableColorChange=false;
            this.isPromotionPopup=false
          }
        })

      }

    } else {

      console.log("invalid form",this.promotionRequestForm)
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
    this.promotionRequestForm.reset()
    this.submitted = false;
    this.isPromotionPopup = false;
    this.isMenuVisible = false;
    this.tableColorChange=false;
  }
  overlayClick() {
    this.showPopup = false;
    this.showSchoolPopup = false;

  }



}
