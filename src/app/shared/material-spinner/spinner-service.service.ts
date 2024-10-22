import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerServiceService {

  constructor() { }

  private spinnerVisibleSubject = new BehaviorSubject<boolean>(false);
  spinnerVisible$ = this.spinnerVisibleSubject.asObservable(); // Observable to subscribe to

  // Show the spinner
  show() {
    this.spinnerVisibleSubject.next(true); // Emit true to show spinner
  }

  // Hide the spinner
  hide() {
    this.spinnerVisibleSubject.next(false); // Emit false to hide spinner
  }
}
