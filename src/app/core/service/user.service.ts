import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userDetailsSubject = new BehaviorSubject<any>(null); // BehaviorSubject to hold user details
  private readonly userDetailsKey = 'userDetails';

  constructor() {
    // Load initial value from localStorage
    const savedDetails = localStorage.getItem(this.userDetailsKey);
    if (savedDetails) {
      this.userDetailsSubject.next(JSON.parse(savedDetails));
    }
  }

  // Observable to subscribe to user details
  getUserDetails$(): Observable<any> {
    return this.userDetailsSubject.asObservable();
  }

  // Method to set user details
  setUserDetails(details: any): void {
    this.userDetailsSubject.next(details); // Emit new value
    localStorage.setItem(this.userDetailsKey, JSON.stringify(details)); // Save to localStorage
  }

  // Method to clear user details
  clearUserDetails(): void {
    this.userDetailsSubject.next(null); // Emit null value
    localStorage.removeItem(this.userDetailsKey); // Clear from localStorage
    localStorage.removeItem('token'); // Clear token
  }
}
