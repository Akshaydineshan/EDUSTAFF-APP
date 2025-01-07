import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopbarService {

  constructor() { }

  private popupVisibility = new BehaviorSubject<boolean>(false);
  popupVisible$ = this.popupVisibility.asObservable();


  

  setPopupValue(value:boolean) {
    this.popupVisibility.next(value);
  }



  getPopupToggle(){
    return this.popupVisible$
  }
}
