import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.component.html',
  styleUrls: ['./settings-main.component.scss']
})
export class SettingsMainComponent {
  isSidebarClosed: boolean = false;



  tabs = ['Reset Password', 'Edit Profile', 'Edit Profile Picture',]; // Tab labels
  activeTabIndex = 0; // Tracks the active tab index
  indicatorWidth = 175; // Width of the tab indicator
  indicatorLeft = 30; // Left offset of the tab indicator

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
