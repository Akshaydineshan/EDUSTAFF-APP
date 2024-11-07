import { Component, HostListener } from '@angular/core';
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
  displayColumns: string[] = ['name', 'age', 'experienceYear', 'fromPromotion', 'fromSchool', 'phoneNumber', 'subject'];

  promotionEligibleList: any[] = [];


  // table related variables
  promotionEligibleTableRows: any[] = []
  promotionEligibleTableColumns: any[] = []
  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] }

  //table hover related variable
  hoverTimeout!: any;
  mouseX!: number
  mouseY!: number
  hoveredEmployee: any;
  showPopup!: boolean;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadPromotionEligibleList();
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
            ... (column === 'name' || column === 'schoolName' ? {
              cellRenderer: (params: any) => `<a style="cursor: pointer; color:  #246CC1;" target="_blank">${params.value}</a>`

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
    if (event.colDef.field === "name") {
      this.onTeacherHover(rowData.id, rowData, event.event)
    }
  }
  rowMouseHoverOut(event: any) {
    // if (event.colDef.field === "principalName") {
    this.onTeacherMouseOut()
    // } else if (event.colDef.field === "name") {
    // this.onSchoolMouseOut()

    // }

  }
}