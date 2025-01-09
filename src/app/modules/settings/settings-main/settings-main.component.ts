import { Component } from '@angular/core';


@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.component.html',
  styleUrls: ['./settings-main.component.scss']
})
export class SettingsMainComponent {
  isSidebarClosed: boolean = false;
  tabs = ['Reset Password', 'Edit Profile',]; // Tab labels
  activeTabIndex = 0; // Tracks the active tab index
  indicatorWidth = 135; // Width of the tab indicator
  indicatorLeft = 0; // Left offset of the tab indicator



  constructor() { }


   onTabClick(event: MouseEvent, index: number) {
    // Update the active tab index
    this.activeTabIndex = index;

    // Calculate indicator width and position
    const target = event.target as HTMLElement;
    this.indicatorWidth = target.offsetWidth;
    this.indicatorLeft = target.offsetLeft;
  }


  // topBar-sidebar 
  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
  get getSidebarToggle() {
    return this.isSidebarClosed;
  }
}
