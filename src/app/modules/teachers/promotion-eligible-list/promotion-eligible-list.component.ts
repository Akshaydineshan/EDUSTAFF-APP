import { Component, HostListener, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Toast } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/service/data/data.service';
import { UserService } from 'src/app/core/service/user.service';
interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}
@Component({
  selector: 'app-promotion-eligible-list',
  templateUrl: './promotion-eligible-list.component.html',
  styleUrls: ['./promotion-eligible-list.component.scss']
})
export class PromotionEligibleListComponent {
  isSidebarClosed = false;

  // column menu hover related 
  selectMenuRowData: any;
  menuListItems: any[] = [
    { name: 'Promotion Request', icon: "assets/icons/transfer-request.jpg", value: 'promotionRequest', icons: 'bi bi-trophy' },]
  isMenuVisible: boolean = false;
  mouseMenuX: number = 0;
  mouseMenuY: number = 0;
  isPromotionPopup: boolean = false;
  tableColorChange: boolean = false;
  submitted: boolean = false;
  promotionRequestForm!: FormGroup

  // table related variables
  promotionEligibleTableRows: any[] = []
  promotionEligibleTableColumns: any[] = []
  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] };
  displayColumns: string[] = ['name', 'age', 'experienceYear', 'fromDesignation', 'toDesignation', 'schoolName', 'phoneNumber', 'subject'];
  promotionEligibleList: any[] = [];

  //table hover popup related variable
  hoverTimeout!: any;
  mouseX: number = 0;
  mouseY: number = 0;
  hoveredEmployee: any;
  showPopup!: boolean;

  constructor(private dataService: DataService, private ngZone: NgZone, private router: Router, private fb: FormBuilder, private toastr: ToastrService,private userService:UserService) { }

  ngOnInit(): void {
    this.loadPromotionEligibleList();

    this.promotionRequestForm = this.fb.group({
      fromSchool: [''],
      fromDesignation: [''],
      toDesignation: [''],
      documentUrl: [''],
      comment: ['']
    })
  }

  // for menu popup hide click outside the popup and button
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    const menuButtons = document.getElementsByClassName('menuButton');

    const menuPops = document.getElementsByClassName('menuPop');

    let clickedInsidePopup = false;
    let clickedOnButton = false;

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
    if (!clickedOnButton && !clickedInsidePopup) {
      this.isMenuVisible = false; // Hide the popup if clicked outside
    }




  }
  //  mouse position updation for show column hovered popup
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

  // get table data
  loadPromotionEligibleList(): void {
    this.dataService.getTeachersPromotionEligibilityList().subscribe(
      (data) => {
        this.promotionEligibleList = data;
        console.log(this.promotionEligibleList);
        this.promotionEligibleTableRows = this.promotionEligibleList

        this.promotionEligibleTableColumns = this.displayColumns.map((column: any) => {
          return {
            field: column,
            headers: column,
            filter: true,
            floatingFilter: column === 'name',
            ... (column === 'name' ? {
              // cellRenderer: (params: any) => `<a style="cursor: pointer; color:  #246CC1;" target="_blank">${params.value}</a>`
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
                   // Append the elements to the div
                   divSub.appendChild(nameLink)
                   div.appendChild(divSub);


                if (this.userService.hasRole('Staff')) {
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


                  div.appendChild(plusButton);
                }



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

            } : {}),

            ... (column === 'schoolName' ? { width: 300 } : {}),
            ... (column === 'experienceYear' ? { valueFormatter: (params: any) => params.value <= 0 ? 'New Joiner' : `${params.value}` } : {}),
            ... (column === 'age' ? { valueFormatter: (params: any) => params.value <= 0 ? 'N/A' : `${params.value}` } : {})


          }


        })
      },
      (error) => {
        console.error('Error fetching teachers eligible promotion data:', error);
      }
    );
  }

  // promotion request submit 
  promotionRequestFormSubmit() {
    this.submitted = true
    console.log("transferForm", this.promotionRequestForm)

    if (this.promotionRequestForm.valid) {
      console.log("transfer form", this.promotionRequestForm.value)
      let formValue: any = this.promotionRequestForm.value;
      let employee: any = this.selectMenuRowData
      let payload: any = {
        "employeeID": employee.id,
        "requestorComment": formValue.comment,
        "filePath": formValue.documentUrl

      }


      this.dataService.createPromotionRequest(payload).subscribe({
        next: (response: any) => {
          console.log(response, response)
          if (response.status == 200) {
            this.submitted = false
            this.isPromotionPopup = false;
            this.tableColorChange = false;
            this.toastr.success('Transfer Requested !', 'Success', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-left',
              timeOut: 4500,
            });
            this.promotionRequestForm.reset()

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
          this.promotionRequestForm.reset()
          this.isPromotionPopup = false;
          this.tableColorChange = false;

        }
      })
    } else {

      console.log("invalid form")
    }
  }


  // TABLE COLUMN CLICK EVENT
  // click name and school column redirect to view page
  onCellClicked(event: any) {
    const rowNode: any = event.node;
    const rowData = rowNode.data;
    if (event.colDef.field === "name") {
      let teacherId: number = rowData.id
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




  // close promotion popup
  closePromotionPopup() {
    this.promotionRequestForm.reset()
    this.submitted = false
    this.isPromotionPopup = false
    this.isMenuVisible = false
    this.tableColorChange = false
  }

  // Update Menu posision For showing MEnu popup when click Morebutton in table Column
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



  // column hover time show details using popup
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
    // const rowNode: any = event.node;
    // const rowData = rowNode.data;
    // if (event.colDef.field === "name") {
    //   this.onTeacherHover(rowData.id, rowData, event.event)
    // }
  }
  rowMouseHoverOut(event: any) {
    // if (event.colDef.field === "principalName") {
    this.onTeacherMouseOut()
    // } else if (event.colDef.field === "name") {
    // this.onSchoolMouseOut()

    // }

  }
  nameColumnHover(event: any, ev: any) {
    this.isMenuVisible = false;
    const rowNode: any = event.node;
    const rowData = rowNode.data;
    if (event.colDef.field === "name") {

      this.onTeacherHover(rowData.id, rowData, ev)
    }
  }


  //  click more btn in table column
  menuBtnEventFunction(event: any, params: any) {
    debugger
    this.showPopup = false;
    this.isMenuVisible = true;
    this.isPromotionPopup = false;
    this.selectMenuRowData = params.node.data


    this.updateMenuMousePosition(event)
  }

  menuBtnhoverOut(event: any, params: any) {

  }

  // select menu item
  listClickFromMenuList(event: any) {
    this.showPopup = false;
    // this.showSchoolPopup = false;

    this.tableColorChange = true
    if (event.value === 'promotionRequest') {
      this.isMenuVisible = false
      // this.loadDropdownData()
      this.isPromotionPopup = event.clicked
      this.tableColorChange = true;
      this.promotionRequestForm.get("fromDesignation")?.setValue(this.selectMenuRowData.fromDesignation);
      this.promotionRequestForm.get("toDesignation")?.setValue(this.selectMenuRowData.toDesignation)
      this.promotionRequestForm.get("fromSchool")?.setValue(this.selectMenuRowData.schoolName)
    }

  }



  // onSchoolHover(schoolId: number, schoolData: any, event: MouseEvent): void {
  //   console.log("ush", schoolData, schoolId)

  //   if (this.hoverTimeout) {
  //     clearTimeout(this.hoverTimeout);
  //   }

  //   if (schoolId && schoolData) {
  //     this.hoverTimeout = setTimeout(() => {

  //       this.dataService.getSchoolDetailPopUp(schoolId).subscribe(
  //         (data) => {
  //           this.selectedSchool = data;
  //           this.showSchoolPopup = true;
  //           this.updateMousePosition(event);
  //         },
  //         (error) => {
  //           console.error('Error fetching school details:', error);
  //         }
  //       );
  //     }, 200);
  //   }
  // }

  // onSchoolMouseOut(): void {

  //   this.showSchoolPopup = false;
  //   this.selectedSchool = null;
  //   if (this.hoverTimeout) {
  //     clearTimeout(this.hoverTimeout);
  //     this.hoverTimeout = null;
  //   }
  // }



}