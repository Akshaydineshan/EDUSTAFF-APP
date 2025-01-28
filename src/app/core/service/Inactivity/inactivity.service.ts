import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TokenStoreService } from '../tokenStore/token-store.service';

@Injectable({
  providedIn: 'root',
})
export class InactivityService implements OnDestroy {
  private inactivityTimeout!: ReturnType<typeof setTimeout>;
  private inactivityDuration = 1000 * 60 * 10;
  private isInactive = new BehaviorSubject<boolean>(false); // Observable to track inactivity

  inactivityState$ = this.isInactive.asObservable(); // Public observable for other components to subscribe

  constructor(private router:Router,private tokenService:TokenStoreService) {
    this.startTracking();
  }

  private startTracking(): void {
    // Listen for global mousemove events
    document.addEventListener('mousemove', this.resetInactivityTimer.bind(this));

    // Start the inactivity timer
    this.startInactivityTimer();
  }

  private startInactivityTimer(): void {
    this.inactivityTimeout = setTimeout(() => {

      if (this.isExcludedPage()) {
        return;
      }
      
      this.isInactive.next(true); // Notify inactivity
      this.handleInactivity(); // Perform desired action on inactivity
    }, this.inactivityDuration);
  }

  private resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimeout); // Clear existing timer
    this.isInactive.next(false); // Notify activity
    this.startInactivityTimer(); // Restart the timer
  }

  private handleInactivity(): void {
    const userResponse = window.confirm(
      'You have been inactive for 10 minutes. Do you wish to continue your session?'
    );
  
    if (userResponse) {
      // console.log('User chose to stay logged in.');
      this.resetInactivityTimer(); // Reset the inactivity timer
    } else {
      // console.log('User chose to logout.');
      this.tokenService.logout();
      this.router.navigate(['/auth/login']);
    }
  }

  private isExcludedPage(): boolean {
    // Add the routes you want to exclude
    const excludedRoutes = ['/auth/login', '/auth/register']; // Add other routes if needed
    const currentRoute = this.router.url;
    return excludedRoutes.includes(currentRoute);
  }

  ngOnDestroy(): void {
    // Cleanup global event listener
    document.removeEventListener('mousemove', this.resetInactivityTimer.bind(this));
    clearTimeout(this.inactivityTimeout);
  }
}

