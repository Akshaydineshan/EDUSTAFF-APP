import { Component, HostListener, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/service/data/data.service';
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
  displayColumns: string[] = ['name', 'age', 'experienceYear', 'fromDesignation', 'toDesignation', 'schoolName', 'phoneNumber', 'subject'];

  promotionEligibleList: any[] = [];
  selectMenuRowData: any;
  menuListItems: any[] = [
    { name: 'Promotion Request', icon: "assets/icons/transfer-request.jpg", value: 'promotionRequest' },
   
  ]
  isMenuVisible:boolean=false;


  // table related variables
  promotionEligibleTableRows: any[] = []
  promotionEligibleTableColumns: any[] = []
  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] }

  //table hover related variable
  hoverTimeout!: any;
  mouseX: number = 0;
  mouseY: number = 0;
  mouseMenuX: number = 0;
  mouseMenuY: number = 0;
  hoveredEmployee: any;
  showPopup!: boolean;
  isPromotionPopup: boolean=false;
  tableColorChange: boolean=false;
  submitted: boolean=false;
  promotionRequestForm!:FormGroup
  constructor(private dataService: DataService,private ngZone:NgZone,private router:Router,private fb:FormBuilder) { }

  ngOnInit(): void {
    this.loadPromotionEligibleList();


    
    this.promotionRequestForm = this.fb.group({
    
      comment: ['']
    })
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

  loadPromotionEligibleList(): void {
    this.dataService.getTeachersPromotionEligibilityList().subscribe(
      (data) => {
        this.promotionEligibleList = data;
        console.log(this.promotionEligibleList);
        this.promotionEligibleTableRows = this.promotionEligibleList

        this.promotionEligibleTableColumns = this.displayColumns.map((column: any) => {
          return {
            field: column,
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

            } : {}),

            ... (column === 'schoolName' ? { width: 300 } : {})

          }


        })
      },
      (error) => {
        console.error('Error fetching teachers eligible promotion data:', error);
      }
    );
  }

  promotionRequestFormSubmit(){

  }

  onCellClicked(event: any) {

    debugger

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
  closePromotionPopup() {
    this.promotionRequestForm.reset()
    this.submitted = false
    this.isPromotionPopup = false
    this.isMenuVisible = false
    this.tableColorChange = false
  }


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

  
  nameColumnHover(event: any, ev: any) {
    this.isMenuVisible = false;
    const rowNode: any = event.node;
    const rowData = rowNode.data;
    if (event.colDef.field === "name") {
    
      this.onTeacherHover(rowData.id, rowData, ev)
    }
  }



  menuBtnEventFunction(event: any, params: any) {
    debugger
    this.showPopup = false;
    this.isMenuVisible = true;
    this.isPromotionPopup=false;
    this.selectMenuRowData = params.node.data


    this.updateMenuMousePosition(event)
  }

  menuBtnhoverOut(event: any, params: any) {

  }

  
  listClickFromMenuList(event: any) {
    debugger
    console.log("EVENT->", event)
    this.showPopup = false;
    // this.showSchoolPopup = false;

    this.tableColorChange = true
    if (event.value === 'promotionRequest') {
      this.isMenuVisible = false
      // this.loadDropdownData()
      this.isPromotionPopup = event.clicked
      this.tableColorChange=true;
      
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

  onTeacherHover(teacherId: number, teacherData: any, event: MouseEvent): void {
    console.log("teacherId",teacherId,teacherData)

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
}