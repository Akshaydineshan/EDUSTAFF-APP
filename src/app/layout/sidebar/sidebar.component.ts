import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnChanges {
  // isSidebarClosed = false;
  @Input() isSidebarClosed = false;
  
  

  constructor(private router: Router) {}
  ngOnChanges(changes: SimpleChanges): void {
    debugger
   
  }
  // toggleSidebar() {
  //   this.isSidebarClosed = !this.isSidebarClosed;
  // }
}
