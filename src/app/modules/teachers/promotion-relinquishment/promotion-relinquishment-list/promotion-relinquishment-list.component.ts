import { DatePipe } from '@angular/common';
import { Component, HostListener, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/service/data/data.service';
import { UserService } from 'src/app/core/service/user.service';
import { environment } from 'src/environments/environment';
interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}
@Component({
  selector: 'app-promotion-relinquishment-list',
  templateUrl: './promotion-relinquishment-list.component.html',
  styleUrls: ['./promotion-relinquishment-list.component.scss'],
  providers: [DatePipe]
})
export class PromotionRelinquishmentListComponent {
  isSidebarClosed = false;
  apiBaseUrl: any = environment.imageBaseUrl;



  // table related vaiables
  displayColumns: any[] = [{ headerName: 'Name', field: 'employeeName' }, { headerName: 'RelinquishmentYear', field: 'relinquishmentYear' }, { headerName: 'Document', field: 'documentFile' }, { headerName: 'Status', field: 'approvalStatus' },
  ];
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




  constructor(private dataService: DataService, private datePipe: DatePipe, private ngZone: NgZone, private userService: UserService, private toastr: ToastrService, private router: Router) {

  }
  ngOnInit(): void {
    this.loadTableData()

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




  loadTableData() {
    // Determine the endpoint based on the selected tab
    const tableDataListApiEndPoint = 'Promotion/GetAllPromotionRelinquishments'

    // Fetch data from the API
    this.dataService.getTableListData(tableDataListApiEndPoint).subscribe(
      (data: any) => {
        // Debugging point to inspect data
        console.log("Teacher list data:", data);

        // Assign fetched data to variables
        this.tableDataList = data;
        this.tableRows = this.tableDataList;

        // Map the columns with conditional formatting and renderers
        this.tableColumns = this.displayColumns.map((column) => ({
          headerName: column.headerName,
          field: column.field,
          filter: true, width: 250,
          floatingFilter: column.field === 'name', // Floating filter for specific columns

          // Conditional formatting for date fields


          // Conditional rendering for name or schoolName columns
          ...(column.field === 'employeeName'
            ? {
              cellRenderer: (params: any) =>
                params.value
                  ? `<a style="cursor: pointer; color: #246CC1;" target="_blank">${params.value}</a>`
                  : `<a style="cursor: pointer;" target="_blank">N/A</a>`,
              width: 320,
            }
            : {}),

          ...(column.field === 'approvalStatus'
            ? {
              cellRenderer: (params: any) => {
                if (true) {
                  let div = document.createElement('div');
                  div.style.margin = '9px 0px';
                  div.style.display = 'flex';
                  div.style.flexDirection = 'column';
                  div.style.alignItems = 'center';

                  let divSub = document.createElement('div');
                  const nameLink = document.createElement('a');
                  nameLink.style.cursor = 'pointer';

                  if (params.value === false) {
                    nameLink.style.color = '#FFBE18';
                    nameLink.textContent = 'Pending';
                    divSub.style.display = 'flex';
                    divSub.style.gap = '5px';

                    if (this.userService.hasRole('Manager')) {
                      let approveBtn = document.createElement('button');
                      approveBtn.classList.add('btn', 'btn-sm', 'btn-outline-success', 'status-btn');
                      approveBtn.innerHTML = '<i class="bi bi-check-lg" style="font-size:16px"></i>Approve';
                      approveBtn.style.width = '86px';
                      approveBtn.style.paddingRight = '10px';
                      approveBtn.setAttribute('title', 'Approve Relinquishment');

                      divSub.appendChild(approveBtn);

                      this.ngZone.run(() => {
                        approveBtn.addEventListener('click', (event: any) => {
                          if (params.onApproveClick) {
                            params.onApproveClick(event, params);
                          }
                        });
                      });
                    }
                  } else if (params.value === true) {
                    nameLink.textContent = 'Approved';
                    nameLink.style.color = '#31904E';
                  }

                  div.appendChild(nameLink);
                  div.appendChild(divSub);

                  return div;
                } else {
                  return `<a style="cursor: pointer;" target="_blank">${params.value}</a>`;
                }
              },
              cellRendererParams: {
                onApproveClick: (event: MouseEvent, params: any) => {
                  this.approveClick(event, params);
                },
              },
              autoHeight: true,
              width: 400,
            }
            : {}),
          ...(column.field === 'documentFile'
            ? {
              cellRenderer: (params: any) => {
                const documentFile = params.value;
                if (documentFile) {
                  let div = document.createElement('div');
                  div.style.display = 'flex';
                  div.style.alignItems = 'center';

             
                  const fileLink = document.createElement('a');
                  fileLink.style.cursor = 'pointer';
                  fileLink.style.color = '#246CC1';
                  fileLink.textContent = 'View';
                  fileLink.setAttribute('target', '_blank');

                  // Create the file URL
                  const fileUrl = `${this.apiBaseUrl.replace(/\/$/, '')}${documentFile.startsWith('/') ? documentFile : `/${documentFile}`}`;

                  // Set the href for viewing the document
                  fileLink.setAttribute('href', fileUrl);

                  // Add the download functionality for the file
                  fileLink.setAttribute('download',  'file');  // Use the file name for download

                  console.log("FILE LINK ",fileLink)

                  // Add the file name if needed
                  const fileName = documentFile.split('/').pop();  // Extract file name
                  const fileNameDiv = document.createElement('div');
                  fileNameDiv.style.fontSize = '12px';
                  fileNameDiv.style.marginTop = '5px';
                  fileNameDiv.textContent = fileName ? fileName : 'No file available';

                  div.appendChild(fileLink);
                  // div.appendChild(fileNameDiv);

                  return div;
                }
                return `<span>No Document</span>`;
              },
              width: 250, // Adjust width as needed
            }
            : {})









        }));
      },
      (error: any) => {
        // Log errors for debugging
        console.error('Error fetching teacher data:', error);
      }
    );
  }

  approveClick(event: any, params: any): void {
    const rowData: any = params.node.data;

    const data = { "approvalStatus": true };

    this.dataService.approveRelinquishmentRequest(rowData.relinquishmentID, data).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.toastr.success('Approved!', 'Success', {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-left',
            timeOut: 4500,
          });
          this.loadTableData();
        }
      },
      error: (error: any) => {
        this.toastr.error('Something went wrong!', 'Failed', {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-left',
          timeOut: 4500,
        });
      },
      complete: () => {
        // Optional: You can add any logic here when the request completes
      }
    });
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
      }, this.dataService.hoverTime);
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
    if (event.colDef.field === "name") {
      this.onTeacherHover(rowData.teacherId, rowData, event.event)
    }
    // } else if (event.colDef.field === "fromSchoolName") {
    //   this.onSchoolHover(rowData.fromSchoolID, rowData, event.event)
    // }

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

    }
    // else if (event.colDef.field === "fromSchoolName") {
    //   let schoolId: number = rowData.fromSchoolID
    //   this.router.navigate(['/schools/view', schoolId])
    // }

  }


  overlayClick() {
    // this.showPopup = false;
    // this.showSchoolPopup = false;

  }

  navigateToCreatePage() {
    this.router.navigate(['teachers/Promotion-relinquishment/create'])
  }
}
