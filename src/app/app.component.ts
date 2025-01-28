import { Component, HostListener, OnInit } from '@angular/core';
import { TopbarComponent } from './layout/topbar/topbar.component';
import { TopbarService } from './layout/topbar/topbar.service';
import { InactivityService } from './core/service/Inactivity/inactivity.service';
import { Router } from '@angular/router';
import { TokenStoreService } from './core/service/tokenStore/token-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'edustaff';

  constructor(private topBarService:TopbarService,private inactivityService:InactivityService,private router:Router,private tokenService:TokenStoreService){

  }
  ngOnInit(): void {
    // this.inactivityService.inactivityState$.subscribe((isInactive) => {
    //   if (isInactive) {
    //     console.log('Global inactivity detected. Executing action...');
    //     // Add your global action here
    //     this.tokenService.logout();
    //     this.router.navigate(['/auth/login'])
    //   } else {
    //     console.log('User is active.');
    //   }
    // });
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
