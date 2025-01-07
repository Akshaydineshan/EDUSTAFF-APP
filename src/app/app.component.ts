import { Component, HostListener } from '@angular/core';
import { TopbarComponent } from './layout/topbar/topbar.component';
import { TopbarService } from './layout/topbar/topbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'edustaff';

  constructor(private topBarService:TopbarService){

  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    // Check if the click is outside the popup or trigger button
    if (!targetElement.closest('.profile-menu-wrapper') && !targetElement.closest('.popup-trigger')) {
      this.topBarService.setPopupValue(false)
      console.log("llll")
    
    }
  }
}
