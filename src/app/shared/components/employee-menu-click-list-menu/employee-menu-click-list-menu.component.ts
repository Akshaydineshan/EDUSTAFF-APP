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
  @Output() clickListEvent :EventEmitter<boolean> =new EventEmitter()

  ngOnInit(): void {
     console.log('positions')
  } 

  closeMenu(){

  }

  listClick(){
   this.clickListEvent.emit(true)
  }
}
