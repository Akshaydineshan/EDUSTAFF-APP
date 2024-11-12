import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-teacher-table-name-section',
  templateUrl: './teacher-table-name-section.component.html',
  styleUrls: ['./teacher-table-name-section.component.scss']
})
export class TeacherTableNameSectionComponent implements ICellRendererAngularComp  {
  params:any
  menuPosition = { top: 0, left: 0 };
  isMenuVisible = false;
  @Output() menuBtnClickE :EventEmitter<any> = new EventEmitter<any>(); 
  constructor(private router:Router){

  }

  agInit(params: ICellRendererParams): void {
  
    this.params=params
  
  }
  refresh(params: ICellRendererParams): boolean {
    return true;
  }


  onNameeClick(){
   
    let event=this.params
    debugger

    const rowNode: any = event.node;
    const rowData = rowNode.data;

    if (event.colDef.field === "name") {
      let teacherId: number = rowData.teacherId
      this.router.navigate(['/teachers/view-teacher', teacherId])
    } else if (event.colDef.field === "schoolName") {
      let schoolId: number = rowData.schoolId
      this.router.navigate(['/schools/view', schoolId])
    }

  }
  onPlusButtonClick(event:any): void {
    event.stopPropagation(); // Prevent event bubbling to AG Grid row click
    // const data = { event, params: this.params };
    this.menuBtnClickE.emit(event); 
  
  }
}
