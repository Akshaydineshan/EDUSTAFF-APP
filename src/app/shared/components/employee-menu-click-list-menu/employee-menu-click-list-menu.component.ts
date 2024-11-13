import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-employee-menu-click-list-menu',
  templateUrl: './employee-menu-click-list-menu.component.html',
  styleUrls: ['./employee-menu-click-list-menu.component.scss']
})
export class EmployeeMenuClickListMenuComponent implements OnInit {

  @Input() mouseX:any
  @Input() mouseY:any
  @Input() isMenuVisible:boolean=false;
  @Input() selectedTeacher:any;
  @Input() menuListItems!:any[];
  @Output() clickListEvent :EventEmitter<any> =new EventEmitter()

  ngOnInit(): void {
     console.log('positions')
  } 

  closeMenu(){

  }

  listClick(value:string){
    let data = { value: value, clicked: true };
    this.clickListEvent.emit(data);
  }
}
