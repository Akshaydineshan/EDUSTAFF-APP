import { DatePipe } from '@angular/common';
import { Component, HostListener, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/service/data/data.service';
import { minAndMaxDateValidator } from 'src/app/utils/validators/date-range-validator';
interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}
@Component({
  selector: 'app-transfer-completed-list',
  templateUrl: './transfer-completed-list.component.html',
  styleUrls: ['./transfer-completed-list.component.scss'],
  providers: [DatePipe]
})
export class TransferCompletedListComponent {

  isSidebarClosed = false;

  // table related vaiables
  displayColumns: any[] = [{ headerName: 'name', field: 'employeeName' }, { headerName: 'From School', field: 'fromSchoolName' }, { headerName: 'To School', field: 'toApprovedSchoolName' }, { headerName: 'Requested Date', field: 'requestDate' }, { headerName: 'With Efffect From', field: 'transferDate' }, { headerName: 'Comment', field: 'requestorComment' }, { headerName: 'Status', field: 'status' }];
  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] }
  tableDataList: any[] = [];
  tableRows: any;
  tableColumns!: { field: string; filter: boolean; floatingFilter: boolean }[];

  // table column hover related variables
  mouseX!: number
  mouseY!: number
  hoveredEmployee: any;
  showPopup!: boolean;
  hoverTimeout!: any;
  showSchoolPopup: boolean = false;
  selectedSchool: any;



 

  constructor(private dataService: DataService, private datePipe: DatePipe, private fb: FormBuilder, private toastr: ToastrService, private ngZone: NgZone, private router: Router) {


  }

  ngOnInit(): void {
    this.loadTableDataList()
   

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

  loadTableDataList() {
    let tableDataListApiEndPoint: string = ''
    this.dataService.getTableListData(tableDataListApiEndPoint).subscribe(
      (data: any) => {
        debugger
        this.tableDataList = data;
        console.log("school list data", this.tableDataList);
        this.tableRows = this.tableDataList
        this.tableColumns = this.displayColumns.map((column) => ({
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

          // ...(column.field === 'status' ?
          //   {
          //     cellRenderer: (params: any) => {
          //       if (true) {
          //         const div = document.createElement('div');
          //         div.style.display = "flex"
          //         div.style.justifyContent = "space-between"

          //         // Create anchor element for the name
          //         const divSub = document.createElement('div');
          //         divSub.style.height = "100%"


          //         const nameLink = document.createElement('a');
          //         nameLink.style.cursor = 'pointer';
          //         // nameLink.style.color = '#246CC1';

          //         nameLink.textContent = params.value;
          //         divSub.appendChild(nameLink)
          //         div.appendChild(divSub);

          //         // Create another anchor element for the plus button

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
          //           // plusButton.style.float = 'right';
          //           plusButton.innerHTML = '<i  style="color:grey;" class="bi bi-three-dots-vertical"></i>';
          //           plusButton.addEventListener('click', (event: any) => {
          //             // if (params.onStatusClick) {
          //             //   params.onStatusClick(event, params);
          //             // }
          //           });
          //           div.appendChild(plusButton);

          //         }




          //         // Append the elements to the div




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

        }));



      },
      (error: any) => {
        console.error('Error fetching school data:', error);
      }
    );

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
          (data:any) => {
            this.selectedSchool = data;
            console.log("school", this.selectedSchool)
            this.showSchoolPopup = true;
            this.updateMousePosition(event);
          },
          (error:any) => {
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
          (data:any) => {
            this.hoveredEmployee = data; // Store the detailed info
            if (this.hoveredEmployee && teacherId) {
              this.showPopup = true;
              this.updateMousePosition(event);
            }
          },
          (error:any) => {
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

  
  overlayClick() {
    this.showPopup = false;
    this.showSchoolPopup = false;

  }
}