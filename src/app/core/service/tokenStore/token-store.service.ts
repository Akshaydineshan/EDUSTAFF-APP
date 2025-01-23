import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class TokenStoreService {

  timeRemaining: number = 0; // Remaining time in milliseconds
  formattedTime = new BehaviorSubject('') // Formatted time (e.g., HH:MM:SS)
  private timerSubscription?: Subscription;

  constructor(private router: Router) { }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.clear();
  }

  public saveToken(token: string) {
    if (!token) return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): any {
    return localStorage.getItem(TOKEN_KEY);
  }
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.clear();
  }



  /**
 * Decode the token to retrieve its payload
 */
  private decodeTokenPayload(token: string): any | null {
    try {
      debugger
      const payload = token.split('.')[1]; // Extract the payload part
      return JSON.parse(atob(payload)); // Decode the base64 payload
    } catch (error) {
      console.error('Failed to decode token payload:', error);
      return null;
    }
  }

  /**
   * Check if the token is expired
   */
  public isTokenExpired(): boolean {
    debugger
    const token = this.getToken();
    if (!token) return true; // If no token, consider it expired

    const payload = this.decodeTokenPayload(token);

    if (!payload || !payload.exp) return true; // Invalid token structure

    const expirationTime = payload.exp * 1000; // Convert expiration time to milliseconds
    return Date.now() > expirationTime; // Check if current time is past expiration
  }

  /**
   * Check if the user is authenticated
   */
  public isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }



  // getTokenExpirationTime(): number | null {
  //   // Replace with your service's method to fetch token expiration time
  //   const token = localStorage.getItem('token'); // Example
  //   if (!token) return null;

  //   const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    
  //   if (!payload || !payload.exp) return null;

  //   return payload.exp * 1000; // Expiration time in milliseconds
  // }

  // startTimer(expirationTime: number): void {
  //   debugger
  //   const now = Date.now();
  //   this.timeRemaining = expirationTime - now;

  //   // Update the timer every second
  //   this.timerSubscription = interval(1000).subscribe(() => {
  //     debugger
  //     const currentTime = Date.now()
  //     this.timeRemaining = expirationTime - currentTime;
  //     console.log("TIMEREM", this.timeRemaining)
  //     if (this.timeRemaining <= 0) {
  //       this.timeRemaining = 0;
  //       this.timerSubscription?.unsubscribe();

  //     }

  //     this.formatTime();
  //   });
  // }

  // formatTime() {
  //   debugger
  //   const seconds = Math.floor(this.timeRemaining / 1000);
  //   const minutes = Math.floor(seconds / 60);
  //   const hours = Math.floor(minutes / 60);

  //   const displaySeconds = seconds % 60;
  //   const displayMinutes = minutes % 60;

  //   this.formattedTime.next(`${this.padNumber(hours)}:${this.padNumber(displayMinutes)}:${this.padNumber(displaySeconds)}`)
  //   return this.formattedTime.asObservable()

  // }

  // padNumber(num: number): string {
  //   return num < 10 ? `0${num}` : `${num}`;
  // }
}
