import { Component, OnInit } from '@angular/core';
import { NonTeacherService } from './non-teacher.service';
import { Router } from '@angular/router';

interface PagonationConfig {
  pagination: boolean,
  paginationPageSize: number,
  paginationPageSizeSelector: number[]
}

@Component({
  selector: 'app-non-teacher-list',
  templateUrl: './non-teacher-list.component.html',
  styleUrls: ['./non-teacher-list.component.scss']
})
export class NonTeacherListComponent implements OnInit {
  isSidebarClosed = false;

  paginationConfig: PagonationConfig = { pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [5, 10, 15, 20, 25, 30, 35] }
  displayColumns: string[] = ['name', 'schoolName', 'designation', 'employeeType', 'experienceYear', 'age', 'phoneNumber', 'documentCount'];
  nonTeacherTableRows: any[] = []
  nonTeacherTableColumns: any[] = []
  nonTeacherList: any[] = [];

  constructor(private NonTeacherService:NonTeacherService,private router:Router) { }

  ngOnInit(): void {
    this.getNonTeacherListData()

  }

  getNonTeacherListData(){
    
    this.NonTeacherService.fetchNonTeachersData().subscribe({
      next:(data:any)=>{
        this.nonTeacherList= data.map((teacher: any) => ({
          ...teacher,
          documentStatus: this.getDocumentStatus(teacher.documentCount, teacher.error)
        }));
        this.nonTeacherTableRows=data
        console.log("Non teacher data list",this.nonTeacherList)

        this.nonTeacherTableColumns= this.displayColumns.map((column:any)=>{
          return {
            field: column,
            filter: true,
            floatingFilter:  column === 'name',
          }
        })

      },
      error:(error:any)=>{

      },
      complete:()=>{

      }
    })
    
  }

  getDocumentStatus(documentCount: number, error: any): any {
    if (documentCount !== 0 && error && error.length !== 0) {
      return { icon: 'fas fa-exclamation-triangle text-warning', text: documentCount };
    } else if (documentCount !== 0 && (!error || error.length === 0)) {
      return { icon: 'fas fa-file-alt text-primary', text: documentCount };
    } else if (documentCount === 0) {
      return { icon: '', text: '0' };
    }
    return { icon: '', text: '0' };
  }




  // table event handling function
  
  rowMouseHover(event: any) {

  }
  rowMouseHoverOut(event: Event) {

  }

  onCellClicked(event: any) {
    const rowNode: any = event.node;
    const rowData = rowNode.data;
    let teacherId:number=rowData.teacherId
    
    if (event.colDef.field === "name") {
      this.router.navigate(['/non-teachers/view',teacherId])
    }
  }
}
