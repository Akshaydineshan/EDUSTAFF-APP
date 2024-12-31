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
  sidebarLinks:any = [
    { name: 'Dashboard', route: '/dashboard', icon: 'fas fa-home' },
    { name: 'Teacher', route: '/teachers', icon: 'fas fa-chalkboard-teacher' },
    { name: 'Non Teaching Staff', route: '/non-teachers', icon: 'fas fa-user-friends' },
    { name: 'School', route: '/schools', icon: 'fas fa-school' },
    { name: 'Settings', route: '/settings', icon: 'fas fa-cog' }
  ];




  constructor(private router: Router) { }
  ngOnChanges(changes: SimpleChanges): void {
    debugger

  }
  // toggleSidebar() {
  //   this.isSidebarClosed = !this.isSidebarClosed;
  // }
}
