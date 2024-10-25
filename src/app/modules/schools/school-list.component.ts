import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/service/data/data.service';
interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements OnInit {
  isSidebarClosed = false;
  displayColumns: string[] = ['schoolID', 'schoolName', 'address', 'cityName', 'state', 'pincode', 'email', 'contactNumber', 'principalName', 'vicePrincipalName'];
  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] }
  schoolList: any[] = [];
  schoolTableRows: any;
  schoolTableColumns!: { field: string; filter: boolean; floatingFilter: boolean }[];

  showSchoolPopup: boolean = false;
  selectedSchool: any;
  hoverTimeout!: any;
  mouseX!: number
  mouseY!: number


  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadSchoolList();
  }

  @HostListener('mousemove', ['$event'])
  updateMousePosition(event: MouseEvent): void {
    const offset = 15; // Offset for positioning
    this.mouseX = event.clientX + offset;
    this.mouseY = event.clientY + offset;
    const popupWidth = 420;
    const popupHeight = 220;

    // Check right edge
    if (this.mouseX + popupWidth > window.innerWidth) {

      this.mouseX = window.innerWidth - popupWidth - offset; // Position left
    }

    // Check bottom edge
    if (this.mouseY + popupHeight > window.innerHeight) {
      this.mouseY = event.clientY - popupHeight+20; // Position above the mouse
    }


  }


  loadSchoolList(): void {
    this.dataService.getSchoolData().subscribe(
      (data) => {
        this.schoolList = data;
        console.log(this.schoolList);
        this.schoolTableRows = this.schoolList
        this.schoolTableColumns = this.displayColumns.map((column) => ({
          field: column,
          filter: true,
          floatingFilter: column === 'name' || column === 'schoolName', // For example, only these columns have floating filters

        }));

      },
      (error) => {
        console.error('Error fetching school data:', error);
      }
    );
  }


  // table row hover popup related functions



  onSchoolHover(schoolId: number, schoolData: any, event: MouseEvent): void {
    console.log("ush", schoolData, schoolId)
    // this.schoolId = schoolId
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    // this.hoveredTeacherId = schoolId;
    if (schoolId && schoolData) {
      this.hoverTimeout = setTimeout(() => {

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



  rowMouseHover(event: any) {

    const rowNode: any = event.node;
    const rowData = rowNode.data;

    if (event.colDef.field === "schoolName") {
      this.onSchoolHover(rowData.schoolID, rowData, event.event)

    }
  }
  rowMouseHoverOut(event: any) {
    if (event.colDef.field === "schoolName") {
      this.onSchoolMouseOut()

    }

  }


}
