import { DatePipe } from '@angular/common';
import { Component, HostListener, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/service/data/data.service';
interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}
@Component({
  selector: 'app-on-leave-teacher',
  templateUrl: './on-leave-teacher.component.html',
  styleUrls: ['./on-leave-teacher.component.scss'],
  providers: [DatePipe]
})
export class OnLeaveTeacherComponent {
  isSidebarClosed = false;

  // table related vaiables
  displayColumns: any[] = [{ headerName: 'Name', field: 'name' }, { headerName: 'School Name', field: 'schoolName' },{ headerName: 'Subject', field: 'subject' },{ headerName: 'Age', field: 'age' },{ headerName: 'Experience', field: 'experienceYear' },{ headerName: 'Designation', field: 'designation' }, ];
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
    let tableDataListApiEndPoint: string = 'Teacher/GetAllTeacherOnLeave'
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
          floatingFilter: column.field === 'name', // For example, only these columns have floating filters
          // ... (column.field === 'name' || column.field === "schoolName" ? {
          //   cellRenderer: (params: any) => params.value ? `<a style="cursor: pointer;  color: #246CC1;" target="_blank">${params.value}</a>` : `<a style="cursor: pointer;  " target="_blank">N/A</a>`,
          //   width: 220
          // } : {}),
          ...(column.field === 'name' || column.field === "schoolName" ? {
            cellRenderer: (params: any) => {

              if(params.value=== 'Not Specified' || params.value==null){
                return "N/A"
              }
              
              const div = document.createElement('div');
              div.style.display = "flex";
              div.style.justifyContent = "space-between";
          
              // Create a container for the anchor element
              const divSub = document.createElement('div');
              Object.assign(divSub.style, {
                height: "100%",
                width: "80%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              });
          
              const nameLink = document.createElement('a');
              Object.assign(nameLink.style, {
                cursor: 'pointer',
                color: '#246CC1',
                textDecoration: 'none',  // Initially no underline
                transition: 'text-decoration 0.2s ease-in-out', // Smooth effect
              });
          
              nameLink.textContent = params.value;
          
              // Event bindings inside Angular Zone for proper change detection
              this.ngZone.run(() => {
                nameLink.addEventListener('click', (event) => {
                  if (params.onLinkClick) params.onLinkClick(event, params);
                });
          
                nameLink.addEventListener('mouseover', () => {
                  nameLink.style.textDecoration = 'underline';  // Show underline on hover
                });
          
                nameLink.addEventListener('mouseout', () => {
                  nameLink.style.textDecoration = 'none';  // Remove underline when not hovering
                });
          
                divSub.addEventListener('mouseover', (event) => {
                  if (params.onLinkHover) params.onLinkHover(event, params);
                });
          
                ['mouseout', 'mouseleave'].forEach(eventType => {
                  divSub.addEventListener(eventType, (event) => {
                    if (params.onLinkHoverOut) params.onLinkHoverOut(event, params);
                  });
                });
              });
          
              // Append elements
              divSub.appendChild(nameLink);
              div.appendChild(divSub);
          
              return div;
            },
            cellRendererParams: {
              onLinkClick: (event: MouseEvent, params: any) => this.onCellClicked(params),
              onLinkHover: (event: MouseEvent, params: any) => this.rowMouseHover(params),
              onLinkHoverOut: (event: MouseEvent, params: any) => this.rowMouseHoverOut(params),
            }, width: 250
          } : {}),
          ... (column.field == 'experienceYear' ? {
            valueFormatter: (params: any) => params.value <= 0 ? 0 : `${params.value}`
          } : {}),
      


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
          (data: any) => {
            this.selectedSchool = data;
            console.log("school", this.selectedSchool)
            this.showSchoolPopup = true;
            this.updateMousePosition(event);
          },
          (error: any) => {
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
    console.log("teacherId", teacherId, teacherData)

    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    if (teacherId && teacherData) {
      this.hoverTimeout = setTimeout(() => {
        this.dataService.getTeacherDetailPopUp(teacherId).subscribe(
          (data: any) => {
            this.hoveredEmployee = data; // Store the detailed info
            if (this.hoveredEmployee && teacherId) {
              this.showPopup = true;
              this.updateMousePosition(event);
            }
          },
          (error: any) => {
            console.error('Error fetching teacher details:', error);
          }
        );
      },this.dataService.hoverTime);
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
    if (event.colDef.field === "name") {
      this.onTeacherHover(rowData.teacherId, rowData, event.event)
    } else if (event.colDef.field === "schoolName") {
      this.onSchoolHover(rowData.schoolId, rowData, event.event)
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


  overlayClick() {
    this.showPopup = false;
    this.showSchoolPopup = false;

  }
}
